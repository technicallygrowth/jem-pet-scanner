import { useCallback, useEffect, useState } from 'react';

const PETS_KEY = 'jem-pets';
const ACTIVE_ID_KEY = 'jem-active-pet-id';
// Superseded single-pet key from before multi-pet support. Migrated once on
// load, then left alone (not deleted) so older app builds a user might still
// have open somewhere don't suddenly see a blank profile.
const LEGACY_SINGLE_PET_KEY = 'jem-pet-profile';

function readPetsFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PETS_KEY);
    if (raw) return JSON.parse(raw);

    const legacyRaw = window.localStorage.getItem(LEGACY_SINGLE_PET_KEY);
    if (legacyRaw) {
      const legacyPet = JSON.parse(legacyRaw);
      return legacyPet ? [legacyPet] : [];
    }
  } catch {
    // Fall through to empty.
  }
  return [];
}

function readActiveIdFromStorage(pets) {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(ACTIVE_ID_KEY);
  if (stored && pets.some((p) => p.id === stored)) return stored;
  return pets[0]?.id ?? null;
}

export function usePets() {
  const [pets, setPets] = useState(readPetsFromStorage);
  const [activePetId, setActivePetId] = useState(() => readActiveIdFromStorage(readPetsFromStorage()));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activePetId) {
      window.localStorage.setItem(ACTIVE_ID_KEY, activePetId);
    } else {
      window.localStorage.removeItem(ACTIVE_ID_KEY);
    }
  }, [activePetId]);

  const addPet = useCallback((next) => {
    const id = `pet-${Date.now()}`;
    setPets((prev) => [
      ...prev,
      {
        id,
        name: next.name.trim(),
        species: next.species,
        lifeStage: next.lifeStage,
        furColor: next.furColor ?? 'orange',
        eyeColor: next.eyeColor ?? 'darkBrown',
        collarColor: next.collarColor ?? 'magenta',
        createdAt: new Date().toISOString(),
      },
    ]);
    setActivePetId(id);
    return id;
  }, []);

  const updatePet = useCallback((id, changes) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...changes, name: (changes.name ?? p.name).trim() }
          : p,
      ),
    );
  }, []);

  const removePet = useCallback((id) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    setActivePetId((current) => (current === id ? null : current));
  }, []);

  const activePet = pets.find((p) => p.id === activePetId) ?? null;

  return { pets, activePet, activePetId, setActivePetId, addPet, updatePet, removePet };
}
