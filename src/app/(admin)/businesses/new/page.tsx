import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireOrgAccess } from '@/lib/auth/require-access'
import { BusinessForm } from '@/features/businesses/components/business-form'

export const metadata: Metadata = {
  title: 'Create New Business',
  description: 'Register a new physical supermarket, restaurant, café, or event pop-up.',
}

export default async function NewBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ organization_id?: string }>
}) {
  const { organization_id } = await searchParams
  if (!organization_id) redirect('/dashboard')

  await requireOrgAccess(organization_id)

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">New Business</h1>
      <BusinessForm organizationId={organization_id} />
    </div>
  )
}