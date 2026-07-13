import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

export async function requireOrgAccess(orgId: string) {
  await requireUser()
  const supabase = await createClient()

  const { data: isMember, error } = await supabase.rpc('is_org_member', { org_id: orgId })
  if (error) throw error
  if (!isMember) redirect('/no-access')
}

export async function requireBusinessView(businessId: string) {
  await requireUser()
  const supabase = await createClient()

  const { data: canView, error } = await supabase.rpc('can_view_business', { biz_id: businessId })
  if (error) throw error
  if (!canView) redirect('/no-access')
}

export async function requireBusinessManage(businessId: string) {
  await requireUser()
  const supabase = await createClient()

  const { data: canManage, error } = await supabase.rpc('can_manage_business', { biz_id: businessId })
  if (error) throw error
  if (!canManage) redirect('/no-access')
}

// Used for both viewing and managing a location — there's no separate
// read-only access tier at location scope, so one check covers both.
export async function requireLocationManage(locationId: string) {
  await requireUser()
  const supabase = await createClient()

  const { data: canManage, error } = await supabase.rpc('can_manage_location', { loc_id: locationId })
  if (error) throw error
  if (!canManage) redirect('/no-access')
}