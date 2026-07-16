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

export default function EditPetProfile({ pet, onSave, onCancel, onDelete }) {
  const { t } = useTranslation();
  const [species, setSpecies] = useState(pet.species);
  const [name, setName] = useState(pet.name);
  const [bodyType, setBodyType] = useState(pet.bodyType ?? (pet.species === 'cat' ? 'shorthair' : 'floppy'));
  const [furColor, setFurColor] = useState(pet.furColor ?? 'orange');
  const [eyeColor, setEyeColor] = useState(pet.eyeColor ?? 'darkBrown');
  const [collarColor, setCollarColor] = useState(pet.collarColor ?? 'magenta');
  const [sex, setSex] = useState(pet.sex ?? null);
  const [lifeStage, setLifeStage] = useState(pet.lifeStage);

  const furOptions = FUR_COLORS.map((c) => ({ ...c, label: t(`profile.furColors.${c.key}`) }));
  const eyeOptions = EYE_COLORS.map((c) => ({ ...c, label: t(`profile.eyeColors.${c.key}`) }));
  const collarOptions = COLLAR_COLORS.map((c) => ({ ...c, label: t(`profile.collarColors.${c.key}`) }));

  function chooseSpecies(next) {
    setSpecies(next);
    setBodyType(BODY_TYPES[next][0]);
  }

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({ species, name, bodyType, furColor, eyeColor, collarColor, sex, lifeStage });
  }

  function confirmDelete() {
    if (window.confirm(t('editPet.deleteConfirm', { name: pet.name }))) {
      onDelete();
    }
  }

  return (
    <form className="profile-creation" onSubmit={submit}>
      <h2 className="profile-creation__title">{t('editPet.title')}</h2>

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

      <div className="profile-creation__species-grid">
        <button
          type="button"
          className={
            species === 'dog'
              ? 'profile-creation__species-card is-selected'
              : 'profile-creation__species-card'
          }
          onClick={() => chooseSpecies('dog')}
        >
          <span>{t('profile.dog')}</span>
        </button>
        <button
          type="button"
          className={
            species === 'cat'
              ? 'profile-creation__species-card is-selected'
              : 'profile-creation__species-card'
          }
          onClick={() => chooseSpecies('cat')}
        >
          <span>{t('profile.cat')}</span>
        </button>
      </div>

      <input
        type="text"
        className="profile-creation__input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('profile.namePlaceholder')}
        maxLength={30}
      />

      <div className="profile-creation__shape-grid">
        {BODY_TYPES[species].map((shape) => (
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
              size={90}
              furColor={furColor}
              eyeColor={eyeColor}
              collarColor={collarColor}
            />
            <span>{t(`profile.bodyTypes.${shape}`)}</span>
          </button>
        ))}
      </div>

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

      <div className="profile-creation__species-grid">
        {SEXES.map((s) => (
          <button
            key={s}
            type="button"
            className={
              sex === s ? 'profile-creation__species-card is-selected' : 'profile-creation__species-card'
            }
            onClick={() => setSex(s)}
          >
            <span>{t(`profile.sex.${s}`)}</span>
          </button>
        ))}
      </div>

      <div className="profile-creation__stage-list">
        {LIFE_STAGES.map((stage) => (
          <button
            key={stage.key}
            type="button"
            className={
              lifeStage === stage.key
                ? 'profile-creation__stage-card is-selected'
                : 'profile-creation__stage-card'
            }
            onClick={() => setLifeStage(stage.key)}
          >
            <span className="profile-creation__stage-label">{t(`profile.${stage.key}`)}</span>
            <span className="profile-creation__stage-hint">{t(`profile.${stage.ageHint}`)}</span>
          </button>
        ))}
      </div>

      <button type="submit" className="scanner__primary-button" disabled={!name.trim()}>
        {t('editPet.saveButton')}
      </button>
      <button type="button" className="profile-creation__back" onClick={onCancel}>
        {t('profile.cancelButton')}
      </button>
      <button type="button" className="editPet__delete" onClick={confirmDelete}>
        {t('editPet.deleteButton')}
      </button>
    </form>
  );
}
