import { createClient, createAnonClient } from '@/lib/supabase/server'
import type { Service, ServiceAddon, Appointment, TimeSlot } from './types'
import { computeIsOpen, type WeeklyOperatingHours } from '@/features/storefront/types'

/**
 * Fetches all active services for a business (public or admin).
 */
export async function getBusinessServices(businessId: string): Promise<Service[]> {
  const supabase = await createClient()

  const { data: servicesRaw, error } = await (supabase as any)
    .from('services')
    .select('*, addons:service_addons(*)')
    .eq('business_id', businessId)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error || !servicesRaw) return []

  return servicesRaw.map((s: any) => ({
    ...s,
    price: Number(s.price),
    duration_minutes: Number(s.duration_minutes),
    buffer_minutes: Number(s.buffer_minutes),
    deposit_amount: s.deposit_amount ? Number(s.deposit_amount) : 0,
    addons: (s.addons || []).map((a: any) => ({
      ...a,
      price: Number(a.price),
      duration_minutes: Number(a.duration_minutes),
    })),
  }))
}

/**
 * Fetches all services (including archived) for merchant management.
 */
export async function getAdminServices(businessId: string): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('services')
    .select('*, addons:service_addons(*)')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })

  if (error || !data) return []

  return data.map((s: any) => ({
    ...s,
    price: Number(s.price),
    duration_minutes: Number(s.duration_minutes),
    buffer_minutes: Number(s.buffer_minutes),
    deposit_amount: s.deposit_amount ? Number(s.deposit_amount) : 0,
    addons: (s.addons || []).map((a: any) => ({
      ...a,
      price: Number(a.price),
      duration_minutes: Number(a.duration_minutes),
    })),
  }))
}

/**
 * Fetches a single service by ID with its addons.
 */
export async function getServiceById(serviceId: string, businessId: string): Promise<Service | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('services')
    .select('*, addons:service_addons(*)')
    .eq('id', serviceId)
    .eq('business_id', businessId)
    .single()

  if (error || !data) return null

  return {
    ...data,
    price: Number(data.price),
    duration_minutes: Number(data.duration_minutes),
    buffer_minutes: Number(data.buffer_minutes),
    deposit_amount: data.deposit_amount ? Number(data.deposit_amount) : 0,
    addons: (data.addons || []).map((a: any) => ({
      ...a,
      price: Number(a.price),
      duration_minutes: Number(a.duration_minutes),
    })),
  }
}

/**
 * Fetches active add-ons available for a business.
 */
export async function getBusinessAddons(businessId: string): Promise<ServiceAddon[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('service_addons')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map((a: any) => ({
    ...a,
    price: Number(a.price),
    duration_minutes: Number(a.duration_minutes),
  }))
}

/**
 * Fetches appointments for a business within a date range (for merchant calendar).
 */
export async function getAppointments(
  businessId: string,
  options?: { startDate?: string; endDate?: string; status?: string }
): Promise<Appointment[]> {
  const supabase = await createClient()

  let query = (supabase as any)
    .from('appointments')
    .select('*, service:services(name, duration_minutes, price)')
    .eq('business_id', businessId)
    .order('start_time', { ascending: true })

  if (options?.startDate) {
    query = query.gte('start_time', options.startDate)
  }
  if (options?.endDate) {
    query = query.lte('end_time', options.endDate)
  }
  if (options?.status) {
    query = query.eq('status', options.status)
  }

  const { data, error } = await query

  if (error || !data) return []

  return data.map((item: any) => ({
    ...item,
    total_price: Number(item.total_price),
    deposit_amount: Number(item.deposit_amount),
    selected_addons: item.selected_addons || [],
  }))
}

/**
 * Computes available booking time slots for a given service and date.
 * Prevents double-booking by checking existing appointments.
 */
export async function getAvailableTimeSlots(
  businessId: string,
  serviceId: string,
  targetDateStr: string // "YYYY-MM-DD"
): Promise<TimeSlot[]> {
  const supabase = createAnonClient()

  // 1. Fetch service details
  const { data: service, error: serviceError } = await (supabase as any)
    .from('services')
    .select('duration_minutes, buffer_minutes')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) return []

  const totalSlotDuration = Number(service.duration_minutes) + Number(service.buffer_minutes)

  // 2. Fetch business operating hours
  const { data: storefront } = await supabase
    .from('storefronts')
    .select('theme')
    .eq('business_id', businessId)
    .maybeSingle()

  const theme = (storefront?.theme as Record<string, unknown>) || {}
  const operatingHours = theme.operating_hours as WeeklyOperatingHours | undefined

  // Determine day of week
  const dateObj = new Date(`${targetDateStr}T00:00:00`)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  const dayOfWeek = dayNames[dateObj.getDay()]
  const daySchedule = operatingHours?.[dayOfWeek]

  // Default to 09:00 - 18:00 if not configured
  const openTimeStr = daySchedule?.open || '09:00'
  const closeTimeStr = daySchedule?.close || '18:00'
  const isClosed = daySchedule?.closed ?? false

  if (isClosed) return []

  // Parse open and close hour/minute
  const [openHour, openMin] = openTimeStr.split(':').map(Number)
  const [closeHour, closeMin] = closeTimeStr.split(':').map(Number)

  const dayStart = new Date(dateObj)
  dayStart.setHours(openHour, openMin, 0, 0)

  const dayEnd = new Date(dateObj)
  dayEnd.setHours(closeHour, closeMin, 0, 0)

  // 3. Fetch existing appointments for that business on this day (excluding cancelled)
  const searchStart = new Date(dateObj)
  searchStart.setHours(0, 0, 0, 0)
  const searchEnd = new Date(dateObj)
  searchEnd.setHours(23, 59, 59, 999)

  const { data: existingBookings } = await (supabase as any)
    .from('appointments')
    .select('start_time, end_time, status')
    .eq('business_id', businessId)
    .neq('status', 'cancelled')
    .gte('start_time', searchStart.toISOString())
    .lte('end_time', searchEnd.toISOString())

  const bookedIntervals = (existingBookings || []).map((b: any) => ({
    start: new Date(b.start_time).getTime(),
    end: new Date(b.end_time).getTime(),
  }))

  // 4. Generate prospective slots every 30 or 60 minutes
  const intervalMins = 30
  const slots: TimeSlot[] = []
  const now = Date.now()

  let current = new Date(dayStart)

  while (current.getTime() + service.duration_minutes * 60000 <= dayEnd.getTime()) {
    const slotStart = current.getTime()
    const slotEnd = slotStart + service.duration_minutes * 60000

    // Is slot in the past?
    const isInPast = slotStart < now

    // Does slot collide with any existing booking?
    const collides = bookedIntervals.some((b: { start: number; end: number }) => {
      return (
        (slotStart >= b.start && slotStart < b.end) ||
        (slotEnd > b.start && slotEnd <= b.end) ||
        (slotStart <= b.start && slotEnd >= b.end)
      )
    })

    const isAvailable = !isInPast && !collides

    // Format human readable time (e.g. "10:30 AM")
    const formattedTime = current.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    slots.push({
      startTime: current.toISOString(),
      endTime: new Date(slotEnd).toISOString(),
      formattedTime,
      isAvailable,
    })

    // Advance by interval
    current = new Date(current.getTime() + intervalMins * 60000)
  }

  return slots
}
