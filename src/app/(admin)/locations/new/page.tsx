import { redirect } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { LocationForm } from '@/features/locations/components/location-form'

export default async function NewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ business_id?: string }>
}) {
  const { business_id } = await searchParams
  if (!business_id) redirect('/dashboard')

  await requireBusinessManage(business_id)

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">New Location</h1>
      <LocationForm businessId={business_id} />
    </div>
  )
}