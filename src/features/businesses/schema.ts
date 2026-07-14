import { z } from 'zod'
import { BUSINESS_TYPES } from './types'

export const createBusinessSchema = z.object({
  organization_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  business_type: z.enum(BUSINESS_TYPES),
})

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>

export const updateBusinessSchema = createBusinessSchema.omit({ organization_id: true })
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>