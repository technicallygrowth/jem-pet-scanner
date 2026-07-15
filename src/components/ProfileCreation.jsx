import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import './ProfileCreation.css';

const LIFE_STAGES = [
  { key: 'puppy', ageHint: 'puppyAgeHint' },
  { key: 'adult', ageHint: 'adultAgeHint' },
  { key: 'senior', ageHint: 'seniorAgeHint' },
];

export default function ProfileCreation({ onSave, onCancel }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState(null);
  const [name, setName] = useState('');
  const [lifeStage, setLifeStage] = useState(null);

  function chooseSpecies(next) {
    setSpecies(next);
    setStep(2);
  }

  function submitName(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setStep(3);
  }

  function chooseLifeStage(next) {
    setLifeStage(next);
    setStep(4);
  }

  function finish() {
    onSave({ species, name, lifeStage });
  }

  const totalSteps = 3;
  const shownStep = Math.min(step, totalSteps);

  return (
    <div className="profile-creation">
      <div className="profile-creation__progress" aria-label={`Step ${shownStep} of ${totalSteps}`}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={i < shownStep ? 'profile-creation__dot is-active' : 'profile-creation__dot'}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <h2 className="profile-creation__title">{t('profile.step1Title')}</h2>
          <p className="profile-creation__subtitle">{t('profile.step1Subtitle')}</p>
          <div className="profile-creation__species-grid">
            <button
              type="button"
              className="profile-creation__species-card"
              onClick={() => chooseSpecies('dog')}
            >
              <PetAvatar species="dog" size={140} />
              <span>{t('profile.dog')}</span>
            </button>
            <button
              type="button"
              className="profile-creation__species-card"
              onClick={() => chooseSpecies('cat')}
            >
              <PetAvatar species="cat" size={140} />
              <span>{t('profile.cat')}</span>
            </button>
          </div>
          <p className="profile-creation__illustration-note">{t('profile.illustrationNote')}</p>
          {onCancel && (
            <button type="button" className="profile-creation__back" onClick={onCancel}>
              {t('profile.cancelButton')}
            </button>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <div className="profile-creation__hero">
            <PetAvatar species={species} size={140} />
          </div>
          <h2 className="profile-creation__title">
            {t(species === 'dog' ? 'profile.step2DogTitle' : 'profile.step2CatTitle')}
          </h2>
          <form className="profile-creation__form" onSubmit={submitName}>
            <input
              type="text"
              className="profile-creation__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              autoFocus
              maxLength={30}
            />
            <button
              type="submit"
              className="scanner__primary-button"
              disabled={!name.trim()}
            >
              {t('profile.continueButton')}
            </button>
          </form>
          <button
            type="button"
            className="profile-creation__back"
            onClick={() => setStep(1)}
          >
            {t('profile.backButton')}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="profile-creation__hero">
            <PetAvatar species={species} size={140} />
          </div>
          <h2 className="profile-creation__title">
            {t('profile.step3Title', { name })}
          </h2>
          <div className="profile-creation__stage-list">
            {LIFE_STAGES.map((stage) => (
              <button
                key={stage.key}
                type="button"
                className="profile-creation__stage-card"
                onClick={() => chooseLifeStage(stage.key)}
              >
                <span className="profile-creation__stage-label">
                  {t(`profile.${stage.key}`)}
                </span>
                <span className="profile-creation__stage-hint">
                  {t(`profile.${stage.ageHint}`)}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="profile-creation__back"
            onClick={() => setStep(2)}
          >
            {t('profile.backButton')}
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <div className="profile-creation__hero">
            <PetAvatar species={species} size={180} />
          </div>
          <h2 className="profile-creation__title">
            {t('profile.step4Greeting', { name })}
          </h2>
          <p className="profile-creation__subtitle">
            {t(`profile.step4Summary_${lifeStage}`, {
              species: t(`profile.${species}Lower`),
            })}
          </p>
          <button type="button" className="scanner__primary-button" onClick={finish}>
            {t('profile.startButton')}
          </button>
          <button
            type="button"
            className="profile-creation__back"
            onClick={() => setStep(3)}
          >
            {t('profile.backButton')}
          </button>
        </>
      )}
    </div>
  );
}
