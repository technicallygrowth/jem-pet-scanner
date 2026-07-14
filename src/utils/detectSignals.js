// Keyword scan over OFF's free-text ingredients — deliberately simple for
// Phase 2. Returns 'met' (found), 'none' (ingredients list present but no
// match), or 'missing' (no ingredients text to check at all, the common
// case per docs/rubrica-v1-y-datos.md section 3).
const ARTIFICIAL_ADDITIVE_KEYWORDS = [
  'red 40', 'yellow 5', 'yellow 6', 'blue 2', 'titanium dioxide',
  'artificial color', 'artificial colour', 'artificial flavor', 'artificial flavour',
  'fd&c',
];

export function detectArtificialAdditives(ingredientsText) {
  if (!ingredientsText || !ingredientsText.trim()) return 'missing';
  const text = ingredientsText.toLowerCase();
  const found = ARTIFICIAL_ADDITIVE_KEYWORDS.some((keyword) => text.includes(keyword));
  return found ? 'met' : 'none';
}
