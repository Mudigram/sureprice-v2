'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAnonClient } from '@/lib/supabase/server'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getAvailableTimeSlots } from './queries'
import {
  serviceSchema,
  updateServiceSchema,
  serviceAddonSchema,
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  type ServiceInput,
  type UpdateServiceInput,
  type ServiceAddonInput,
  type CreateAppointmentInput,
  type UpdateAppointmentStatusInput,
} from './schema'

/**
 * Creates a new bookable service for a business.
 */
export async function createService(input: ServiceInput) {
  const parsed = serviceSchema.parse(input)
  await requireBusinessManage(parsed.business_id)

  const supabase = await createClient()
  const { data, error } = await (supabase as any)
    .from('services')
    .insert({
      business_id: parsed.business_id,
      category_id: parsed.category_id || null,
      name: parsed.name,
      description: parsed.description || null,
      price: parsed.price,
      duration_minutes: parsed.duration_minutes,
      buffer_minutes: parsed.buffer_minutes,
      requires_deposit: parsed.requires_deposit,
      deposit_amount: parsed.deposit_amount || 0,
      image_url: parsed.image_url || null,
      sort_order: parsed.sort_order,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath(`/businesses/${parsed.business_id}/services`)
  return data
}

/**
 * Updates an existing service.
 */
export async function updateService(
  serviceId: string,
  businessId: string,
  input: UpdateServiceInput
) {
  const parsed = updateServiceSchema.parse(input)
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const { error } = await (supabase as any)
    .from('services')
    .update({
      category_id: parsed.category_id || null,
      name: parsed.name,
      description: parsed.description || null,
      price: parsed.price,
      duration_minutes: parsed.duration_minutes,
      buffer_minutes: parsed.buffer_minutes,
      requires_deposit: parsed.requires_deposit,
      deposit_amount: parsed.deposit_amount || 0,
      image_url: parsed.image_url || null,
      sort_order: parsed.sort_order,
      status: parsed.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', serviceId)
    .eq('business_id', businessId)

  if (error) throw error

  revalidatePath(`/businesses/${businessId}/services`)
}

/**
 * Archives a service.
 */
export async function archiveService(serviceId: string, businessId: string) {
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const { error } = await (supabase as any)
    .from('services')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', serviceId)
    .eq('business_id', businessId)

  if (error) throw error

  revalidatePath(`/businesses/${businessId}/services`)
}

/**
 * Adds an upsell add-on to a service.
 */
export async function createServiceAddon(input: ServiceAddonInput) {
  const parsed = serviceAddonSchema.parse(input)
  await requireBusinessManage(parsed.business_id)

  const supabase = await createClient()
  const { data, error } = await (supabase as any)
    .from('service_addons')
    .insert({
      business_id: parsed.business_id,
      service_id: parsed.service_id || null,
      name: parsed.name,
      price: parsed.price,
      duration_minutes: parsed.duration_minutes,
      is_active: parsed.is_active,
    })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath(`/businesses/${parsed.business_id}/services`)
  return data
}

/**
 * Deletes an add-on.
 */
export async function deleteServiceAddon(addonId: string, businessId: string) {
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const { error } = await (supabase as any)
    .from('service_addons')
    .delete()
    .eq('id', addonId)
    .eq('business_id', businessId)

  if (error) throw error

  revalidatePath(`/businesses/${businessId}/services`)
}

/**
 * Public action: Creates a customer appointment from the storefront.
 * Checks for collision before inserting.
 */
export async function createAppointment(input: CreateAppointmentInput) {
  const parsed = createAppointmentSchema.parse(input)
  const supabase = createAnonClient()

  // 1. Double-booking collision check
  const { data: collisions, error: checkError } = await (supabase as any)
    .from('appointments')
    .select('id')
    .eq('business_id', parsed.business_id)
    .neq('status', 'cancelled')
    .or(
      `and(start_time.lte.${parsed.start_time},end_time.gt.${parsed.start_time}),and(start_time.lt.${parsed.end_time},end_time.gte.${parsed.end_time})`
    )

  if (checkError) {
    // If collision check fails or table not yet present
  }

  if (collisions && collisions.length > 0) {
    throw new Error('This time slot has just been booked. Please choose another time slot.')
  }

  // 2. Insert appointment
  const { data, error } = await (supabase as any)
    .from('appointments')
    .insert({
      business_id: parsed.business_id,
      service_id: parsed.service_id,
      client_name: parsed.client_name,
      client_phone: parsed.client_phone,
      client_email: parsed.client_email || null,
      start_time: parsed.start_time,
      end_time: parsed.end_time,
      total_price: parsed.total_price,
      deposit_amount: parsed.deposit_amount,
      deposit_paid: false,
      status: 'pending',
      notes: parsed.notes || null,
      selected_addons: parsed.selected_addons,
    })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath(`/businesses/${parsed.business_id}/bookings`)
  return data
}

/**
 * Merchant action: Updates an appointment's status (confirm, mark deposit paid, complete, cancel).
 */
export async function updateAppointmentStatus(
  businessId: string,
  input: UpdateAppointmentStatusInput
) {
  const parsed = updateAppointmentStatusSchema.parse(input)
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const updates: Record<string, unknown> = {
    status: parsed.status,
    updated_at: new Date().toISOString(),
  }

  if (parsed.deposit_paid !== undefined) {
    updates.deposit_paid = parsed.deposit_paid
  }
  if (parsed.cancellation_reason !== undefined) {
    updates.cancellation_reason = parsed.cancellation_reason
  }

  const { error } = await (supabase as any)
    .from('appointments')
    .update(updates)
    .eq('id', parsed.appointment_id)
    .eq('business_id', businessId)

  if (error) throw error

  revalidatePath(`/businesses/${businessId}/bookings`)
}

/**
 * Public action: Fetches available time slots for booking without requiring auth.
 */
export async function getAvailableSlotsAction(
  businessId: string,
  serviceId: string,
  targetDateStr: string
) {
  return await getAvailableTimeSlots(businessId, serviceId, targetDateStr)
}

