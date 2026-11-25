export const APPOINTMENT_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
] as const
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]

export const SERVICE_STATUSES = ['active', 'archived'] as const
export type ServiceStatus = (typeof SERVICE_STATUSES)[number]

export interface ServiceAddon {
  id: string
  business_id: string
  service_id: string | null
  name: string
  price: number
  duration_minutes: number
  is_active: boolean
  created_at: string
}

export interface Service {
  id: string
  business_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  duration_minutes: number
  buffer_minutes: number
  requires_deposit: boolean
  deposit_amount: number | null
  image_url: string | null
  status: ServiceStatus
  sort_order: number
  created_at: string
  updated_at: string
  addons?: ServiceAddon[]
}

export interface SelectedAddon {
  id: string
  name: string
  price: number
  duration_minutes: number
}

export interface Appointment {
  id: string
  business_id: string
  service_id: string
  client_name: string
  client_phone: string
  client_email: string | null
  start_time: string
  end_time: string
  total_price: number
  deposit_amount: number
  deposit_paid: boolean
  status: AppointmentStatus
  notes: string | null
  selected_addons: SelectedAddon[]
  cancellation_reason: string | null
  created_at: string
  updated_at: string
  service?: Service
}

export interface TimeSlot {
  startTime: string // ISO string
  endTime: string // ISO string
  formattedTime: string // "10:00 AM"
  isAvailable: boolean
}
