import { notFound } from 'next/navigation'
import { requireLocationManage } from '@/lib/auth/require-access'
import { getLocationById } from '@/features/locations/queries'
import { LocationEditForm } from '@/features/locations/components/location-edit-form'

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ locationId: string }>
}) {
  const { locationId } = await params
  await requireLocationManage(locationId)

  const location = await getLocationById(locationId)
  if (!location) notFound()

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Edit Location</h1>
      <LocationEditForm location={location} />
    </div>
  )
}