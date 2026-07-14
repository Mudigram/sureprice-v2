import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireLocationManage } from '@/lib/auth/require-access'
import { getLocationById } from '@/features/locations/queries'

export default async function LocationDetailPage({
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
      <h1 className="text-2xl font-semibold text-foreground">{location.name}</h1>
<Link href={`/locations/${locationId}/edit`} className="text-sm text-muted-foreground underline hover:text-foreground">
  Edit
</Link>
      {location.address_line1 && <p className="mt-2 text-muted-foreground">{location.address_line1}</p>}
      {location.city && <p className="text-muted-foreground">{location.city}</p>}
    </div>
  )
}