import brandsData from '../data/brands.json';

function normalize(text) {
  return (text || '').toLowerCase();
}

// The structured `brands` field from Open Pet Food Facts is often empty
// (confirmed against a real Hill's barcode during Phase 2 testing — see
// docs/rubrica-v1-y-datos.md section 3), so we search the brand field AND
// the free-text product name for any known alias. Longer aliases are
// checked first so "hill's prescription diet" wins over the bare "hill's".
export function matchBrand(product) {
  if (!product?.found) return null;

  const haystack = normalize(`${product.brandsField} ${product.productName} ${product.genericName}`);
  if (!haystack.trim()) return null;

  const candidates = brandsData.brands
    .flatMap((brand) => brand.aliases.map((alias) => ({ brand, alias: normalize(alias) })))
    .sort((a, b) => b.alias.length - a.alias.length);

  const match = candidates.find(({ alias }) => haystack.includes(alias));
  return match ? match.brand : null;
}
