import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getBusinessByIdForAdmin } from '@/features/businesses/queries'
import { getTeamMembersForBusiness, getScopeOptionsForOrg } from '@/features/role-assignments/queries'
import { BusinessTeamClient } from './business-team-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Business Team — Qarty Admin',
  description: 'Manage team member roles and managers for this business.',
}

export default async function BusinessTeamPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessView(businessId)

  const business = await getBusinessByIdForAdmin(businessId)
  if (!business) notFound()

  const teamMembers = await getTeamMembersForBusiness(businessId)
  const scopeOptions = await getScopeOptionsForOrg(business.organization_id)

  return (
    <BusinessTeamClient
      business={business}
      teamMembers={teamMembers}
      scopeOptions={scopeOptions}
    />
  )
}
