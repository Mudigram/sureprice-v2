import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getOwnerOrganizationId } from '@/features/organizations/queries'
import { getTeamMembersForOrg, getScopeOptionsForOrg } from '@/features/role-assignments/queries'
import { TeamClient } from './team-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Team & Roles — SurePrice Admin',
  description: 'Manage team member roles and scope assignments across your organization.',
}

export default async function OrgTeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const orgId = await getOwnerOrganizationId(user.id)
  if (!orgId) redirect('/no-access')

  const teamMembers = await getTeamMembersForOrg(orgId)
  const scopeOptions = await getScopeOptionsForOrg(orgId)

  return <TeamClient teamMembers={teamMembers} scopeOptions={scopeOptions} orgId={orgId} />
}
