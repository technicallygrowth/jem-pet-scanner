import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import { useScanHistory } from '../hooks/useScanHistory';
import { useCareRecords } from '../hooks/useCareRecords';
import { CARE_CATEGORIES } from '../data/careCategories';
import tipsData from '../data/generalTips.json';
import './HomeTab.css';

// One card per pet in the multi-pet dashboard row. Each pet's care records
// live under their own localStorage key, so this has to be a real component
// (not inlined in a .map) — useCareRecords is a hook and needs one call per
// pet, which is only legal inside its own component instance.
function PetSummaryCard({ pet, isActive, onSelect }) {
  const { t } = useTranslation();
  const { records } = useCareRecords(pet.id);
  const applicableCategories = CARE_CATEGORIES.filter(
    (c) => c.key !== 'heat' || pet.sex !== 'male',
  );
  const loggedCount = applicableCategories.filter(
    (c) => records[c.key]?.lastDate || records[c.key]?.neutered,
  ).length;

  return (
    <button
      type="button"
      className={isActive ? 'home-tab__pet-card is-active' : 'home-tab__pet-card'}
      onClick={onSelect}
    >
      <PetAvatar
        species={pet.species}
        size={44}
        furColor={pet.furColor}
        eyeColor={pet.eyeColor}
        collarColor={pet.collarColor}
      />
      <span className="home-tab__pet-card-name">{pet.name}</span>
      <span className="home-tab__pet-card-care">
        {t('home.careProgressValue', { count: loggedCount, total: applicableCategories.length })}
      </span>
    </button>
  );
}

export default function HomeTab({ activePet: pet, petsState, onNavigate, onShowMethodology, onShowAddPet, onShowEditPet }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'es' ? 'es' : 'en';
  const { pets, setActivePetId } = petsState;
  const { history } = useScanHistory();
  const { records } = useCareRecords(pet.id);

  const lastScan = history[0] ?? null;
  // Heat cycles don't apply to males — don't count that slot at all.
  const applicableCareCategories = CARE_CATEGORIES.filter(
    (c) => c.key !== 'heat' || pet.sex !== 'male',
  );
  const careLoggedCount = applicableCareCategories.filter(
    (c) => records[c.key]?.lastDate || records[c.key]?.neutered,
  ).length;
  // A rotating teaser would need a stable clock; for the pilot just surface
  // the first tip as a taste of the Consejos tab.
  const featuredTip = tipsData.tips[0];

  return (
    <div className="home-tab">
      {pets.length > 1 && (
        <section className="home-tab__pets-dashboard">
          <h3 className="home-tab__pets-dashboard-title">{t('home.yourPetsTitle')}</h3>
          <div className="home-tab__pets-grid">
            {pets.map((p) => (
              <PetSummaryCard
                key={p.id}
                pet={p}
                isActive={p.id === pet.id}
                onSelect={() => setActivePetId(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Identity moment — the one place the warm brand gradient lives. */}
      <section className="home-tab__hero">
        <button
          type="button"
          className="home-tab__hero-edit"
          onClick={onShowEditPet}
          aria-label={t('dashboard.editPetLink')}
        >
          ✎
        </button>
        <div className="home-tab__hero-avatar">
          <PetAvatar
            species={pet.species}
            size={104}
            furColor={pet.furColor}
            eyeColor={pet.eyeColor}
            collarColor={pet.collarColor}
          />
        </div>
        <h2 className="home-tab__hello">{t('dashboard.greeting', { name: pet.name })}</h2>
        <span className="home-tab__meta-chip">
          {t(`profile.${pet.species}Lower`)} · {t(`profile.${pet.lifeStage}`)}
        </span>
      </section>

      <div className="home-tab__highlights">
        <button
          type="button"
          className="home-tab__highlight-card"
          onClick={() => onNavigate('scan')}
        >
          <span className="home-tab__chip home-tab__chip--scan" aria-hidden="true">🔍</span>
          <span className="home-tab__highlight-label">{t('home.lastScanLabel')}</span>
          <span className="home-tab__highlight-value">
            {lastScan
              ? lastScan.brandName || lastScan.productName || lastScan.barcode
              : t('home.noScansYet')}
          </span>
        </button>
        <button
          type="button"
          className="home-tab__highlight-card"
          onClick={() => onNavigate('care')}
        >
          <span className="home-tab__chip home-tab__chip--care" aria-hidden="true">🩺</span>
          <span className="home-tab__highlight-label">{t('home.careProgressLabel')}</span>
          <span className="home-tab__highlight-value">
            {t('home.careProgressValue', { count: careLoggedCount, total: applicableCareCategories.length })}
          </span>
        </button>
      </div>

      <button
        type="button"
        className="home-tab__cta"
        onClick={() => onNavigate('scan')}
      >
        <span aria-hidden="true">📷</span>
        {t('home.scanNowButton')}
      </button>

      {/* Cross-link that signals "this app does more than food". */}
      <button
        type="button"
        className="home-tab__tip-teaser"
        onClick={() => onNavigate('tips')}
      >
        <span className="home-tab__chip home-tab__chip--tips" aria-hidden="true">💡</span>
        <span className="home-tab__tip-teaser-text">
          <span className="home-tab__tip-teaser-label">{t('home.tipTeaserLabel')}</span>
          <span className="home-tab__tip-teaser-title">{featuredTip.title[lang]}</span>
        </span>
        <span className="home-tab__tip-teaser-arrow" aria-hidden="true">→</span>
      </button>

      <div className="home-tab__footer-links">
        <button type="button" className="home-tab__text-link" onClick={onShowMethodology}>
          {t('dashboard.methodologyLink')}
        </button>
        <button type="button" className="home-tab__text-link" onClick={onShowAddPet}>
          {t('dashboard.addPet')}
        </button>
      </div>
    </div>
  );
}
