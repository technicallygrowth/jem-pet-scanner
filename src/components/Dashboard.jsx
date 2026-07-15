import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import BarcodeScanner from './BarcodeScanner';
import Methodology from './Methodology';
import ProfileCreation from './ProfileCreation';
import EditPetProfile from './EditPetProfile';
import { useScanHistory } from '../hooks/useScanHistory';
import './Dashboard.css';

// Matches SignalBadge's icon vocabulary: ✓ confirmed, ~ partial info,
// ? nothing found at all.
const OUTCOME_ICON = {
  analyzed: '✓',
  'brand-unknown': '~',
  'not-found': '?',
};

export default function Dashboard({ activePet: pet, petsState }) {
  const { t } = useTranslation();
  const { pets, setActivePetId, addPet, updatePet, removePet } = petsState;
  const { history, addEntry } = useScanHistory();
  const [openBarcode, setOpenBarcode] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [showEditPet, setShowEditPet] = useState(false);

  function handleAnalysisResult(result) {
    addEntry(result);
  }

  function handleAddPet(data) {
    addPet(data);
    setShowAddPet(false);
  }

  function handleSaveEdit(data) {
    updatePet(pet.id, data);
    setShowEditPet(false);
  }

  function handleDeletePet() {
    removePet(pet.id);
    setShowEditPet(false);
  }

  if (showMethodology) {
    return <Methodology onBack={() => setShowMethodology(false)} />;
  }

  if (showAddPet) {
    return <ProfileCreation onSave={handleAddPet} onCancel={() => setShowAddPet(false)} />;
  }

  if (showEditPet) {
    return (
      <EditPetProfile
        pet={pet}
        onSave={handleSaveEdit}
        onCancel={() => setShowEditPet(false)}
        onDelete={handleDeletePet}
      />
    );
  }

  return (
    <div className="dashboard">
      {pets.length > 1 && (
        <div className="dashboard__pet-switcher">
          {pets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={
                p.id === pet.id
                  ? 'dashboard__pet-switcher-item is-active'
                  : 'dashboard__pet-switcher-item'
              }
              onClick={() => setActivePetId(p.id)}
            >
              <PetAvatar species={p.species} size={44} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}

      <section className="dashboard__greeting">
        <PetAvatar species={pet.species} size={120} />
        <div className="dashboard__greeting-text">
          <h2 className="dashboard__hello">{t('dashboard.greeting', { name: pet.name })}</h2>
          <span className="dashboard__meta">
            {t(`profile.${pet.species}Lower`)} · {t(`profile.${pet.lifeStage}`)}
          </span>
        </div>
        <button
          type="button"
          className="dashboard__edit-pet-button"
          onClick={() => setShowEditPet(true)}
          aria-label={t('dashboard.editPetLink')}
        >
          ✎
        </button>
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

      <div className="dashboard__footer-links">
        <button type="button" className="dashboard__edit" onClick={() => setShowMethodology(true)}>
          {t('dashboard.methodologyLink')}
        </button>
        <button type="button" className="dashboard__edit" onClick={() => setShowAddPet(true)}>
          {t('dashboard.addPet')}
        </button>
      </div>
    </div>
  );
}
