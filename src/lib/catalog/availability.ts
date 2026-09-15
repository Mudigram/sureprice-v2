/**
 * Utility functions for checking item stock and availability status
 * across all store types (Retail, Restaurants, Cafes, Pop-up Stalls).
 */

export function isItemSoldOut(attributes: unknown): boolean {
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return false
  }

  const attrs = attributes as Record<string, unknown>

  if (attrs.in_stock === false || attrs.in_stock === 'false') {
    return true
  }

  if (attrs.is_sold_out === true || attrs.is_sold_out === 'true') {
    return true
  }

  if (attrs.availability === 'sold_out' || attrs.availability === 'out_of_stock') {
    return true
  }

  return false
}
