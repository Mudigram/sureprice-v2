import type { Tables } from '@/types/database'

export type LocationHours = {
  id: string
  location_id: string
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export type StorefrontLocation = Tables<'locations'> & {
  location_hours?: LocationHours[]
  address_text?: string | null
}

export type StorefrontBusiness = Tables<'businesses'> & {
  storefront: (Tables<'storefronts'> & { logo_url?: string | null }) | null
  locations?: StorefrontLocation[]
}

export type StorefrontCategory = Tables<'categories'>

export type StorefrontItem = Tables<'catalog_items'> & {
  category: StorefrontCategory | null
  sku?: string | null
}

export type StorefrontItemDetail = Tables<'catalog_items'> & {
  category: StorefrontCategory | null
  images: Tables<'media'>[]
  sku?: string | null
}

export type AttributeEntry = { key: string; value: string }

/**
 * Computes whether a store location is currently open based on day_of_week and open/close time
 */
export function computeIsOpen(hours?: LocationHours[]): { isOpen: boolean; text: string } {
  if (!hours || hours.length === 0) return { isOpen: true, text: 'Open' }

  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 6 = Saturday
  const todayHours = hours.find((h) => h.day_of_week === currentDay)

  if (!todayHours || todayHours.is_closed) {
    return { isOpen: false, text: 'Closed' }
  }

  if (!todayHours.open_time || !todayHours.close_time) {
    return { isOpen: true, text: 'Open' }
  }

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const isOpen = currentTime >= todayHours.open_time && currentTime <= todayHours.close_time
  return { isOpen, text: isOpen ? 'Open' : 'Closed' }
}
