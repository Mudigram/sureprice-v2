'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRoleAssignments, resolveRedirectPath } from '@/features/role-assignments/queries'
import { getSubscriptionStatus, isSubscriptionBlocked } from '@/features/subscriptions/queries'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    redirect('/login?error=invalid_credentials')
  }

  const assignments = await getUserRoleAssignments(data.user.id)

  const owner = assignments.find((a) => a.role === 'owner' && a.scope_type === 'organization')
  if (owner) {
    const status = await getSubscriptionStatus(owner.scope_id)
    if (isSubscriptionBlocked(status)) {
      redirect('/renew')
    }
  }

  const path = resolveRedirectPath(assignments)
  redirect(path)
}