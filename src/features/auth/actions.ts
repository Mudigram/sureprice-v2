'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRoleAssignments, resolveRedirectPath } from '@/features/role-assignments/queries'
import { getSubscriptionStatus, isSubscriptionBlocked } from '@/features/subscriptions/queries'
import { BUSINESS_TYPES } from '@/features/businesses/types'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    redirect('/login?error=invalid_credentials')
  }

  try {
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
  } catch (err: unknown) {
    // If error is a Next.js redirect exception, rethrow it so Next.js performs the redirect!
    if (err && typeof err === 'object' && 'digest' in err && typeof (err as { digest: unknown }).digest === 'string' && (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')) {
      throw err
    }
    console.error('Login role lookup error:', err)
    redirect('/dashboard')
  }
}

export async function registerMerchantOwner(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const storeName = (formData.get('storeName') as string)?.trim()
  const businessType = (formData.get('businessType') as string)?.trim() || 'retail'
  const passcode = (formData.get('passcode') as string)?.trim()

  if (!email || !password || !storeName || !passcode) {
    redirect('/register?error=missing_fields')
  }

  const validPasscodes = [
    (process.env.PILOT_ACCESS_CODE || 'SUREPRICE2026').trim().toUpperCase(),
    'SUREPRICE2026',
    'SUREPRICE-PILOT',
  ]

  if (!validPasscodes.includes(passcode.toUpperCase())) {
    redirect('/register?error=invalid_passcode')
  }

  const admin = createAdminClient()

  // 1. Create or fetch user in auth.users with email_confirm = true
  let userId: string
  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    // If user already exists, try signing in with that password
    if (
      createError.message.toLowerCase().includes('already registered') ||
      createError.message.toLowerCase().includes('already exists')
    ) {
      const client = await createClient()
      const { data: signInData, error: signInErr } = await client.auth.signInWithPassword({ email, password })
      if (signInErr || !signInData.user) {
        redirect('/register?error=user_exists')
      }
      userId = signInData.user.id
    } else {
      console.error('Error creating user:', createError)
      redirect(`/register?error=${encodeURIComponent(createError.message)}`)
    }
  } else {
    userId = userData.user.id
  }

  // 2. Check if user already has an organization role
  const { data: existingRoles } = await admin
    .from('role_assignments')
    .select('id, scope_id')
    .eq('user_id', userId)
    .eq('role', 'owner')
    .eq('scope_type', 'organization')
    .maybeSingle()

  let orgId = existingRoles?.scope_id

  if (!orgId) {
    orgId = crypto.randomUUID()
    const orgSlug = `${storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'org'}-${Math.random().toString(36).substring(2, 6)}`

    // Create Organization
    const { error: orgError } = await admin.from('organizations').insert({
      id: orgId,
      name: storeName,
      slug: orgSlug,
      created_by: userId,
    })
    if (orgError) console.error('Org insert error:', orgError)

    // Create Subscription (trial status)
    const { error: subError } = await admin.from('subscriptions').insert({
      organization_id: orgId,
      status: 'trial',
    })
    if (subError) console.error('Subscription insert error:', subError)

    // Create Role Assignment (owner role at organization scope)
    const { error: roleError } = await admin.from('role_assignments').insert({
      user_id: userId,
      role: 'owner',
      scope_type: 'organization',
      scope_id: orgId,
      created_by: userId,
    })
    if (roleError) console.error('Role insert error:', roleError)
  }

  // 3. Create initial Business if one doesn't exist for this org
  const { data: existingBiz } = await admin
    .from('businesses')
    .select('id')
    .eq('organization_id', orgId)
    .limit(1)

  if (!existingBiz || existingBiz.length === 0) {
    const baseSlug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'store'
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
    const validBizType = (BUSINESS_TYPES as readonly string[]).includes(businessType)
      ? businessType
      : 'retail'

    await admin.from('businesses').insert({
      organization_id: orgId,
      name: storeName,
      slug: uniqueSlug,
      business_type: validBizType as any,
      created_by: userId,
    })
  }

  // 4. Sign in on the client cookie context and redirect to dashboard
  const supabase = await createClient()
  await supabase.auth.signInWithPassword({ email, password })

  redirect('/dashboard')
}