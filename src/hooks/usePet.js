import { useCallback, useEffect, useState } from 'react';

// One key = one pet profile. Multi-pet is out of scope for the pilot per the
// plan doc — the layered avatar spec already accounts for it, but the data
// shape stays a single object so we don't over-engineer today.
const STORAGE_KEY = 'jem-pet-profile';

function readFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function usePet() {
  const [pet, setPetState] = useState(readFromStorage);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pet) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [pet]);

  const savePet = useCallback((next) => {
    setPetState({
      id: next.id ?? `pet-${Date.now()}`,
      name: next.name.trim(),
      species: next.species,
      lifeStage: next.lifeStage,
      createdAt: next.createdAt ?? new Date().toISOString(),
    });
  }, []);

  const clearPet = useCallback(() => setPetState(null), []);

  return { pet, savePet, clearPet };
}
