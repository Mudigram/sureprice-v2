import { z } from 'zod'

export const createLocationSchema = z.object({
  business_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  address_line1: z.string().optional(),
  city: z.string().optional(),
})

export type CreateLocationInput = z.infer<typeof createLocationSchema>

export const updateLocationSchema = createLocationSchema.omit({ business_id: true })
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>