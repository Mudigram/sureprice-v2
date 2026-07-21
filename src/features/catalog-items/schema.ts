import { z } from 'zod'

const attributeEntry = z.object({
  key: z.string().min(1, 'Key required'),
  value: z.string(),
})

export const createCatalogItemSchema = z.object({
  business_id: z.string().uuid(),
  category_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Name is required').max(150),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0, 'Price must be 0 or more').optional(),
  attributes: z.array(attributeEntry).default([]),
})

export type CreateCatalogItemFormValues = z.input<typeof createCatalogItemSchema>  // pre-coercion shape — what the form holds
export type CreateCatalogItemInput = z.output<typeof createCatalogItemSchema>      // post-coercion shape — what the action receives

export const updateCatalogItemSchema = createCatalogItemSchema.omit({ business_id: true })
export type UpdateCatalogItemFormValues = z.input<typeof updateCatalogItemSchema>
export type UpdateCatalogItemInput = z.output<typeof updateCatalogItemSchema>