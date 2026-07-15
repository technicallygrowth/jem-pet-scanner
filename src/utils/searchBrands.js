import brandsData from '../data/brands.json';

// Simple substring match over name + aliases — good enough for ~16 curated
// brands. Returns the actual brand objects from brands.json (stable
// references), not copies, so callers can pass them straight through as
// AnalysisResult's directBrand prop.
export function searchBrands(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return brandsData.brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(q) ||
      brand.aliases.some((alias) => alias.toLowerCase().includes(q)),
  );
}
