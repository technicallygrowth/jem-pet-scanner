import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BarcodeScanner from './BarcodeScanner';
import { useScanHistory } from '../hooks/useScanHistory';
import './ScanTab.css';

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

  return (
    <div className="scan-tab">
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
                  onClick={() => setOpenBarcode(item.barcode)}
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
