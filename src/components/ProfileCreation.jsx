import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PetAvatar, { FUR_COLORS, EYE_COLORS, COLLAR_COLORS, BODY_TYPES } from './PetAvatar';
import ColorSwatchRow from './ColorSwatchRow';
import './ProfileCreation.css';

const LIFE_STAGES = [
  { key: 'puppy', ageHint: 'puppyAgeHint' },
  { key: 'adult', ageHint: 'adultAgeHint' },
  { key: 'senior', ageHint: 'seniorAgeHint' },
];

const SEXES = ['female', 'male'];

// Steps: 1 species, 2 name, 3 body shape, 4 look (colors), 5 sex,
// 6 life stage, 7 greeting (not counted in the progress dots).
export default function ProfileCreation({ onSave, onCancel }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState(null);
  const [name, setName] = useState('');
  const [bodyType, setBodyType] = useState('floppy');
  const [furColor, setFurColor] = useState('orange');
  const [eyeColor, setEyeColor] = useState('darkBrown');
  const [collarColor, setCollarColor] = useState('magenta');
  const [sex, setSex] = useState(null);
  const [lifeStage, setLifeStage] = useState(null);

  const furOptions = FUR_COLORS.map((c) => ({ ...c, label: t(`profile.furColors.${c.key}`) }));
  const eyeOptions = EYE_COLORS.map((c) => ({ ...c, label: t(`profile.eyeColors.${c.key}`) }));
  const collarOptions = COLLAR_COLORS.map((c) => ({ ...c, label: t(`profile.collarColors.${c.key}`) }));
  const shapeOptions = species ? BODY_TYPES[species] : [];

  function chooseSpecies(next) {
    setSpecies(next);
    setBodyType(BODY_TYPES[next][0]);
    setStep(2);
  }

  function submitName(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setStep(3);
  }

  function chooseSex(next) {
    setSex(next);
    setStep(6);
  }

  function chooseLifeStage(next) {
    setLifeStage(next);
    setStep(7);
  }

  function finish() {
    onSave({ species, name, bodyType, furColor, eyeColor, collarColor, sex, lifeStage });
  }

  const totalSteps = 6;
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
            <PetAvatar species={species} bodyType={bodyType} size={140} />
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
          <h2 className="profile-creation__title">{t('profile.shapeTitle', { name })}</h2>
          <p className="profile-creation__subtitle">{t('profile.shapeSubtitle')}</p>
          <div className="profile-creation__shape-grid">
            {shapeOptions.map((shape) => (
              <button
                key={shape}
                type="button"
                className={
                  bodyType === shape
                    ? 'profile-creation__species-card is-selected'
                    : 'profile-creation__species-card'
                }
                onClick={() => setBodyType(shape)}
              >
                <PetAvatar
                  species={species}
                  bodyType={shape}
                  size={110}
                  furColor={furColor}
                  eyeColor={eyeColor}
                  collarColor={collarColor}
                />
                <span>{t(`profile.bodyTypes.${shape}`)}</span>
              </button>
            ))}
          </div>
          <button type="button" className="scanner__primary-button" onClick={() => setStep(4)}>
            {t('profile.continueButton')}
          </button>
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
            <PetAvatar
              species={species}
              bodyType={bodyType}
              size={150}
              furColor={furColor}
              eyeColor={eyeColor}
              collarColor={collarColor}
            />
          </div>
          <h2 className="profile-creation__title">{t('profile.lookTitle', { name })}</h2>
          <p className="profile-creation__subtitle">{t('profile.lookSubtitle')}</p>

          <ColorSwatchRow
            label={t('profile.furColorLabel')}
            options={furOptions}
            value={furColor}
            onChange={setFurColor}
          />
          <ColorSwatchRow
            label={t('profile.eyeColorLabel')}
            options={eyeOptions}
            value={eyeColor}
            onChange={setEyeColor}
          />
          <ColorSwatchRow
            label={t('profile.collarColorLabel')}
            options={collarOptions}
            value={collarColor}
            onChange={setCollarColor}
          />

          <button type="button" className="scanner__primary-button" onClick={() => setStep(5)}>
            {t('profile.continueButton')}
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

      {step === 5 && (
        <>
          <div className="profile-creation__hero">
            <PetAvatar
              species={species}
              bodyType={bodyType}
              size={140}
              furColor={furColor}
              eyeColor={eyeColor}
              collarColor={collarColor}
            />
          </div>
          <h2 className="profile-creation__title">{t('profile.sexTitle', { name })}</h2>
          <div className="profile-creation__stage-list">
            {SEXES.map((s) => (
              <button
                key={s}
                type="button"
                className="profile-creation__stage-card"
                onClick={() => chooseSex(s)}
              >
                <span className="profile-creation__stage-label">{t(`profile.sex.${s}`)}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="profile-creation__back"
            onClick={() => setStep(4)}
          >
            {t('profile.backButton')}
          </button>
        </>
      )}

      {step === 6 && (
        <>
          <div className="profile-creation__hero">
            <PetAvatar
              species={species}
              bodyType={bodyType}
              size={140}
              furColor={furColor}
              eyeColor={eyeColor}
              collarColor={collarColor}
            />
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
            onClick={() => setStep(5)}
          >
            {t('profile.backButton')}
          </button>
        </>
      )}

      {step === 7 && (
        <>
          <div className="profile-creation__hero">
            <PetAvatar
              species={species}
              bodyType={bodyType}
              size={180}
              furColor={furColor}
              eyeColor={eyeColor}
              collarColor={collarColor}
            />
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
            onClick={() => setStep(6)}
          >
            {t('profile.backButton')}
          </button>
        </>
      )}
    </div>
  );
}
