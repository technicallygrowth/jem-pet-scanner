const API_BASE = 'https://world.openpetfoodfacts.org/api/v2/product';
const REQUEST_TIMEOUT_MS = 8000;

// Real-world lookups (see docs/rubrica-v1-y-datos.md section 3) show the
// structured `brands` field is often empty even when the product exists —
// so callers should also text-search `productName`/`genericName`, which is
// why both are returned here instead of just the brand field.
export async function lookupProductByBarcode(barcode) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(barcode)}.json`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      return { found: false };
    }
    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      return { found: false };
    }
    const product = data.product;
    return {
      found: true,
      barcode,
      productName: product.product_name || product.generic_name || '',
      genericName: product.generic_name || '',
      brandsField: product.brands || '',
      ingredientsText: product.ingredients_text || '',
      imageUrl: product.image_url || null,
    };
  } catch {
    // Network failure, timeout, or malformed response — treat the same as
    // "not found" so the UI can fall back to the "brand unknown" state
    // instead of a scary error for what's ultimately a routine gap.
    return { found: false };
  } finally {
    clearTimeout(timeout);
  }
}
