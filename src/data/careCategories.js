// Structure-only tracker categories (docs discussion: "Cuidados" tab).
// Deliberately no due-date prediction math yet — each category just stores
// a last-done date and shows elapsed time. Real per-vaccine schedules,
// heat-cycle prediction, etc. are a distinct, harder feature to build later.
export const CARE_CATEGORIES = [
  { key: 'vaccines', icon: '💉' },
  { key: 'vet', icon: '🩺' },
  { key: 'nails', icon: '✂️' },
  { key: 'heat', icon: '🌸', hasNeuteredToggle: true },
  { key: 'bath', icon: '🛁' },
  { key: 'deworming', icon: '🐛' },
];
