import type { ListItem } from '@/context/CartContext'

export interface VenueGroup {
  slug: string
  name: string
  items: ListItem[]
  total: number
  itemCount: number
}

/**
 * Groups cart items by physical venue / merchant so checkout and reference totals
 * are calculated per store rather than blended into a single misleading figure.
 */
export function groupCartByVenue(items: ListItem[]): VenueGroup[] {
  const groups = new Map<string, VenueGroup>()
  for (const item of items) {
    const slug = item.businessSlug || 'unknown'
    const name = item.businessName || 'Store'
    const itemTotal = (item.base_price ?? 0) * item.quantity
    const existing = groups.get(slug)

    if (existing) {
      existing.items.push(item)
      existing.total += itemTotal
      existing.itemCount += item.quantity
    } else {
      groups.set(slug, {
        slug,
        name,
        items: [item],
        total: itemTotal,
        itemCount: item.quantity,
      })
    }
  }
  return Array.from(groups.values())
}

/**
 * Computes overall grand total across all items in cart
 */
export function cartGrandTotal(items: ListItem[]): number {
  return items.reduce((sum, item) => sum + (item.base_price ?? 0) * item.quantity, 0)
}

/**
 * Computes overall item count across all items in cart
 */
export function cartTotalCount(items: ListItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
