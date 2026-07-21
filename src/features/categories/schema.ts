import { z } from 'zod'

export const createCategorySchema = z.object({
  business_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
})
export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.omit({ business_id: true })
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>