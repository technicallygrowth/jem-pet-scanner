import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BarcodeScanner from './BarcodeScanner';
import BrandSearch from './BrandSearch';
import AnalysisResult from './AnalysisResult';
import { useScanHistory } from '../hooks/useScanHistory';
import brandsData from '../data/brands.json';
import './ScanTab.css';

// History entries created via BrandSearch use this pseudo-barcode (see
// AnalysisResult's directBrand mode) since there's no real barcode to key
// on. Re-opening one has to route back through search, not the scanner —
// looking it up against the real barcode API would just 404.
const BRAND_SEARCH_PREFIX = 'brand:';

// Matches SignalBadge's icon vocabulary: ✓ confirmed, ~ partial info,
// ? nothing found at all.
const OUTCOME_ICON = {
  analyzed: '✓',
  'brand-unknown': '~',
  'not-found': '?',
};

export default function ScanTab({ activePet: pet }) {
  const { t } = useTranslation();
  const { history, addEntry } = useScanHistory();
  const [openBarcode, setOpenBarcode] = useState(null);
  const [searchedBrand, setSearchedBrand] = useState(null);

  function reopenHistoryItem(item) {
    if (item.barcode.startsWith(BRAND_SEARCH_PREFIX)) {
      const brandId = item.barcode.slice(BRAND_SEARCH_PREFIX.length);
      const brand = brandsData.brands.find((b) => b.id === brandId);
      if (brand) setSearchedBrand(brand);
      return;
    }
    setOpenBarcode(item.barcode);
  }

  if (searchedBrand) {
    return (
      <div className="scan-tab">
        <AnalysisResult
          directBrand={searchedBrand}
          pet={pet}
          onScanAgain={() => setSearchedBrand(null)}
          onResult={addEntry}
        />
      </div>
    );
  }

  return (
    <div className="scan-tab">
      <BrandSearch onSelectBrand={setSearchedBrand} />
      <div className="scan-tab__divider">{t('search.orDivider')}</div>

      <BarcodeScanner
        pet={pet}
        onAnalysisResult={addEntry}
        openBarcode={openBarcode}
        onOpenedBarcode={() => setOpenBarcode(null)}
      />

      {history.length > 0 && (
        <section className="dashboard__history">
          <h3 className="dashboard__history-title">{t('dashboard.historyTitle')}</h3>
          <ul className="dashboard__history-list">
            {history.map((item) => (
              <li key={item.barcode}>
                <button
                  type="button"
                  className="dashboard__history-item"
                  onClick={() => reopenHistoryItem(item)}
                >
                  <span
                    className={`dashboard__history-icon dashboard__history-icon--${item.outcome}`}
                  >
                    {OUTCOME_ICON[item.outcome] ?? '?'}
                  </span>
                  <span className="dashboard__history-text">
                    <span className="dashboard__history-name">
                      {item.brandName || item.productName || item.barcode}
                    </span>
                    <span className="dashboard__history-outcome">
                      {t(`dashboard.historyOutcome.${item.outcome}`)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
