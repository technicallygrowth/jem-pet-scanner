import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PetAvatar from './PetAvatar';
import './ProfileCreation.css';

const LIFE_STAGES = [
  { key: 'puppy', ageHint: 'puppyAgeHint' },
  { key: 'adult', ageHint: 'adultAgeHint' },
  { key: 'senior', ageHint: 'seniorAgeHint' },
];

export default function EditPetProfile({ pet, onSave, onCancel, onDelete }) {
  const { t } = useTranslation();
  const [species, setSpecies] = useState(pet.species);
  const [name, setName] = useState(pet.name);
  const [lifeStage, setLifeStage] = useState(pet.lifeStage);

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({ species, name, lifeStage });
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
        <PetAvatar species={species} size={140} />
      </div>

      <div className="profile-creation__species-grid">
        <button
          type="button"
          className={
            species === 'dog'
              ? 'profile-creation__species-card is-selected'
              : 'profile-creation__species-card'
          }
          onClick={() => setSpecies('dog')}
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
          onClick={() => setSpecies('cat')}
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
