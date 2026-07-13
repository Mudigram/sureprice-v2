import { createClient } from '@/lib/supabase/server'
import type { SubscriptionStatus } from '@/features/role-assignments/types'

const VALID_STATUSES: SubscriptionStatus[] = ['trial', 'active', 'past_due', 'canceled']
const BLOCKED_STATUSES: SubscriptionStatus[] = ['past_due', 'canceled']

export async function getSubscriptionStatus(organizationId: string): Promise<SubscriptionStatus | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('organization_id', organizationId)
    .single()

  if (error) throw error
  if (!data) return null

  if (!VALID_STATUSES.includes(data.status as SubscriptionStatus)) {
    throw new Error(`Unexpected subscriptions.status value: "${data.status}"`)
  }

  return data.status as SubscriptionStatus
}

export function isSubscriptionBlocked(status: SubscriptionStatus | null): boolean {
  if (!status) return false // no subscription row — treat as unblocked, adjust if that's wrong
  return BLOCKED_STATUSES.includes(status)
}