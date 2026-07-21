import { createClient } from '@/lib/supabase/server'
import type { StorefrontBusiness, StorefrontItem, StorefrontItemDetail } from './types'

/**
 * Fetches the business by ID (UUID), joined with its storefront config.
 * Used by the QR redirect route handler which only has business_id.
 */
export async function getStorefrontBusinessById(
  id: string
): Promise<StorefrontBusiness | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*, storefront:storefronts(*)')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const raw = data as typeof data & { storefront: unknown }
  const storefront = Array.isArray(raw.storefront)
    ? (raw.storefront[0] ?? null)
    : (raw.storefront ?? null)

  return { ...data, storefront } as StorefrontBusiness
}

/**
 * Fetches the business by slug, joined with its storefront config.
 * Returns null if not found. Respects is_published flag:
 * returns the full record (caller decides what to render based on is_published).
 */
export async function getStorefrontBusiness(
  slug: string
): Promise<StorefrontBusiness | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*, storefront:storefronts(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  // The join returns storefront as an array (one-to-one) — normalise to single or null
  if (!data) return null
  const raw = data as typeof data & { storefront: unknown }
  const storefront = Array.isArray(raw.storefront)
    ? (raw.storefront[0] ?? null)
    : (raw.storefront ?? null)

  return { ...data, storefront } as StorefrontBusiness
}

/**
 * Fetches all active catalog items for a business, joined with their categories.
 * Ordered by category sort_order, then item name.
 */
export async function getStorefrontItems(businessId: string): Promise<StorefrontItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select('*, category:categories(id, name, sort_order, status, business_id, created_at, created_by, updated_at)')
    .eq('business_id', businessId)
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (error) throw error
  if (!data) return []

  // Sort by category sort_order (null categories last), then name
  return (data as StorefrontItem[]).sort((a, b) => {
    const aOrder = a.category?.sort_order ?? 9999
    const bOrder = b.category?.sort_order ?? 9999
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.name.localeCompare(b.name)
  })
}

/**
 * Fetches a single catalog item with its images, for the item detail page.
 */
export async function getStorefrontItem(
  businessId: string,
  itemId: string
): Promise<StorefrontItemDetail | null> {
  const supabase = await createClient()

  const [itemResult, imagesResult] = await Promise.all([
    supabase
      .from('catalog_items')
      .select('*, category:categories(id, name, sort_order, status, business_id, created_at, created_by, updated_at)')
      .eq('id', itemId)
      .eq('business_id', businessId)
      .eq('status', 'active')
      .maybeSingle(),
    supabase
      .from('media')
      .select('*')
      .eq('target_type', 'catalog_item')
      .eq('target_id', itemId)
      .order('created_at', { ascending: true }),
  ])

  if (itemResult.error) throw itemResult.error
  if (!itemResult.data) return null

  const images = imagesResult.data ?? []
  const raw = itemResult.data as typeof itemResult.data & { category: unknown }
  const category = Array.isArray(raw.category)
    ? (raw.category[0] ?? null)
    : (raw.category ?? null)

  return { ...itemResult.data, category, images } as StorefrontItemDetail
}
