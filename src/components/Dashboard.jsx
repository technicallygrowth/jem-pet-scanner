import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import BarcodeScanner from './BarcodeScanner';
import { useScanHistory } from '../hooks/useScanHistory';
import './Dashboard.css';

// Matches SignalBadge's icon vocabulary: ✓ confirmed, ~ partial info,
// ? nothing found at all.
const OUTCOME_ICON = {
  analyzed: '✓',
  'brand-unknown': '~',
  'not-found': '?',
};

export default function Dashboard({ pet, onEditPet }) {
  const { t } = useTranslation();
  const { history, addEntry } = useScanHistory();
  const [openBarcode, setOpenBarcode] = useState(null);

  function handleAnalysisResult(result) {
    addEntry(result);
  }

  return (
    <div className="dashboard">
      <section className="dashboard__greeting">
        <PetAvatar species={pet.species} size={120} />
        <div className="dashboard__greeting-text">
          <h2 className="dashboard__hello">{t('dashboard.greeting', { name: pet.name })}</h2>
          <span className="dashboard__meta">
            {t(`profile.${pet.species}Lower`)} · {t(`profile.${pet.lifeStage}`)}
          </span>
        </div>
      </section>

      <section className="dashboard__prompt">
        <p className="dashboard__prompt-text">
          {t('dashboard.prompt', { name: pet.name })}
        </p>
      </section>

      <BarcodeScanner
        pet={pet}
        onAnalysisResult={handleAnalysisResult}
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

      <button type="button" className="dashboard__edit" onClick={onEditPet}>
        {t('dashboard.editPet')}
      </button>
    </div>
  );
}
