import { useCallback, useEffect, useState } from 'react';

const STORAGE_PREFIX = 'jem-care-';

function readFromStorage(petId) {
  if (typeof window === 'undefined' || !petId) return {};
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${petId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// One record set per pet — vaccines for one pet shouldn't show up under
// another. { [categoryKey]: { lastDate: 'YYYY-MM-DD' | null, neutered?: bool } }
export function useCareRecords(petId) {
  const [records, setRecords] = useState(() => readFromStorage(petId));

  useEffect(() => {
    setRecords(readFromStorage(petId));
  }, [petId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !petId) return;
    window.localStorage.setItem(`${STORAGE_PREFIX}${petId}`, JSON.stringify(records));
  }, [petId, records]);

  const updateCategory = useCallback((categoryKey, changes) => {
    setRecords((prev) => ({
      ...prev,
      [categoryKey]: { ...prev[categoryKey], ...changes },
    }));
  }, []);

  return { records, updateCategory };
}
