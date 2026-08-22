import { z } from 'zod'

export const HIGHLIGHT_OPTIONS = [
  { id: 'halal', label: 'Halal Certified', icon: '🌿' },
  { id: 'cocktails', label: 'Cocktail Bar', icon: '🍹' },
  { id: 'wifi', label: 'Free Wi-Fi', icon: '📶' },
  { id: 'ac', label: 'Air Conditioned', icon: '❄️' },
  { id: 'outdoor', label: 'Outdoor Dining', icon: '🌳' },
  { id: 'takeout', label: 'Takeout & Delivery', icon: '🚗' },
  { id: 'parking', label: 'On-Site Parking', icon: '🅿️' },
] as const

export const updateStorefrontBrandingSchema = z.object({
  is_published: z.boolean().default(true),
  logo_url: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  tagline: z.string().max(120, 'Tagline must be 120 characters or less').nullable().optional(),
  primary_color: z.string().nullable().optional(),
  highlights: z.array(z.string()).default([]),
})

export type UpdateStorefrontBrandingInput = z.input<typeof updateStorefrontBrandingSchema>
export type UpdateStorefrontBrandingParsed = z.infer<typeof updateStorefrontBrandingSchema>
