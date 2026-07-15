import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import BarcodeScanner from './BarcodeScanner';
import './Dashboard.css';

export default function Dashboard({ pet, onEditPet }) {
  const { t } = useTranslation();

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

      <BarcodeScanner pet={pet} />

      <button type="button" className="dashboard__edit" onClick={onEditPet}>
        {t('dashboard.editPet')}
      </button>
    </div>
  );
}
