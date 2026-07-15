import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'jem-scan-history';
const MAX_ENTRIES = 20;

function readFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useScanHistory() {
  const [history, setHistory] = useState(readFromStorage);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // De-dupes on barcode — re-scanning the same product moves it to the top
  // with the freshest outcome instead of piling up repeats.
  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      const withoutDupe = prev.filter((item) => item.barcode !== entry.barcode);
      const next = [{ ...entry, scannedAt: new Date().toISOString() }, ...withoutDupe];
      return next.slice(0, MAX_ENTRIES);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, clearHistory };
}
