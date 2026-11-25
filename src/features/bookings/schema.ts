import { z } from 'zod'
import { APPOINTMENT_STATUSES, SERVICE_STATUSES } from './types'

export const serviceSchema = z.object({
  business_id: z.string().uuid(),
  category_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Service name is required').max(150),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  duration_minutes: z.coerce.number().min(5, 'Duration must be at least 5 minutes').default(60),
  buffer_minutes: z.coerce.number().min(0, 'Buffer must be 0 or more').default(15),
  requires_deposit: z.boolean().default(false),
  deposit_amount: z.coerce.number().min(0).optional().nullable(),
  image_url: z.string().optional().nullable(),
  sort_order: z.coerce.number().default(0),
})

export type ServiceFormValues = z.input<typeof serviceSchema>
export type ServiceInput = z.output<typeof serviceSchema>

export const updateServiceSchema = serviceSchema.omit({ business_id: true }).extend({
  status: z.enum(SERVICE_STATUSES).default('active'),
})
export type UpdateServiceFormValues = z.input<typeof updateServiceSchema>
export type UpdateServiceInput = z.output<typeof updateServiceSchema>

export const serviceAddonSchema = z.object({
  business_id: z.string().uuid(),
  service_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Add-on name is required').max(150),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  duration_minutes: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type ServiceAddonFormValues = z.input<typeof serviceAddonSchema>
export type ServiceAddonInput = z.output<typeof serviceAddonSchema>

export const createAppointmentSchema = z.object({
  business_id: z.string().uuid(),
  service_id: z.string().uuid(),
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  client_phone: z.string().min(8, 'Valid phone number is required'),
  client_email: z.string().email('Valid email address required').optional().nullable(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  total_price: z.coerce.number().min(0),
  deposit_amount: z.coerce.number().min(0).default(0),
  notes: z.string().optional().nullable(),
  selected_addons: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        duration_minutes: z.number(),
      })
    )
    .default([]),
})

export type CreateAppointmentFormValues = z.input<typeof createAppointmentSchema>
export type CreateAppointmentInput = z.output<typeof createAppointmentSchema>

export const updateAppointmentStatusSchema = z.object({
  appointment_id: z.string().uuid(),
  status: z.enum(APPOINTMENT_STATUSES),
  deposit_paid: z.boolean().optional(),
  cancellation_reason: z.string().optional().nullable(),
})

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>
