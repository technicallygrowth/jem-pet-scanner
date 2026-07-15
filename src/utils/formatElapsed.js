// Deliberately just "time since last logged" — no due-date prediction.
// Real schedules (annual rabies vs. tri-annual distemper, breed-specific
// heat cycles, etc.) need domain rules we haven't built yet; showing elapsed
// time is honest about what we actually know.
export function formatElapsedDays(isoDate, t) {
  if (!isoDate) return t('care.neverLogged');
  // New Date('YYYY-MM-DD') parses as UTC midnight, but comparing that
  // against a local "today" can shift the result by a day depending on
  // timezone offset — build both dates from local y/m/d components instead
  // so neither side ever touches UTC parsing.
  const [year, month, day] = isoDate.split('-').map(Number);
  const last = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = Math.round((now - last) / 86400000);
  if (days <= 0) return t('care.today');
  if (days === 1) return t('care.yesterday');
  return t('care.daysAgo', { count: days });
}
