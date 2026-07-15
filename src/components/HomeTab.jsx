import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import { useScanHistory } from '../hooks/useScanHistory';
import { useCareRecords } from '../hooks/useCareRecords';
import { CARE_CATEGORIES } from '../data/careCategories';
import './HomeTab.css';

export default function HomeTab({ activePet: pet, petsState, onNavigate, onShowMethodology, onShowAddPet, onShowEditPet }) {
  const { t } = useTranslation();
  const { pets, setActivePetId } = petsState;
  const { history } = useScanHistory();
  const { records } = useCareRecords(pet.id);

  const lastScan = history[0] ?? null;
  const careLoggedCount = CARE_CATEGORIES.filter((c) => records[c.key]?.lastDate || records[c.key]?.neutered).length;

  return (
    <div className="home-tab">
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
              <PetAvatar
                species={p.species}
                size={44}
                furColor={p.furColor}
                eyeColor={p.eyeColor}
                collarColor={p.collarColor}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}

      <section className="home-tab__greeting">
        <PetAvatar
          species={pet.species}
          size={120}
          furColor={pet.furColor}
          eyeColor={pet.eyeColor}
          collarColor={pet.collarColor}
        />
        <div className="home-tab__greeting-text">
          <h2 className="home-tab__hello">{t('dashboard.greeting', { name: pet.name })}</h2>
          <span className="home-tab__meta">
            {t(`profile.${pet.species}Lower`)} · {t(`profile.${pet.lifeStage}`)}
          </span>
        </div>
        <button
          type="button"
          className="dashboard__edit-pet-button"
          onClick={onShowEditPet}
          aria-label={t('dashboard.editPetLink')}
        >
          ✎
        </button>
      </section>

      <div className="home-tab__highlights">
        <button type="button" className="home-tab__highlight-card" onClick={() => onNavigate('scan')}>
          <span className="home-tab__highlight-label">{t('home.lastScanLabel')}</span>
          <span className="home-tab__highlight-value">
            {lastScan ? (lastScan.brandName || lastScan.productName || lastScan.barcode) : t('home.noScansYet')}
          </span>
        </button>
        <button type="button" className="home-tab__highlight-card" onClick={() => onNavigate('care')}>
          <span className="home-tab__highlight-label">{t('home.careProgressLabel')}</span>
          <span className="home-tab__highlight-value">
            {t('home.careProgressValue', { count: careLoggedCount, total: CARE_CATEGORIES.length })}
          </span>
        </button>
      </div>

      <p className="home-tab__prompt-text">{t('dashboard.prompt', { name: pet.name })}</p>

      <button type="button" className="scanner__primary-button" onClick={() => onNavigate('scan')}>
        {t('home.scanNowButton')}
      </button>

      <div className="dashboard__footer-links">
        <button type="button" className="dashboard__edit" onClick={onShowMethodology}>
          {t('dashboard.methodologyLink')}
        </button>
        <button type="button" className="dashboard__edit" onClick={onShowAddPet}>
          {t('dashboard.addPet')}
        </button>
      </div>
    </div>
  );
}
