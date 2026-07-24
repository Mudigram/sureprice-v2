import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getBusinessById } from '@/features/businesses/queries'
import { getLocationsForBusiness } from '@/features/locations/queries'

export const metadata: Metadata = {
  title: 'Business Overview',
  description: 'View and manage store locations, catalog items, and team members.',
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessView(businessId)

  const business = await getBusinessById(businessId)
  if (!business) notFound()

  const locations = await getLocationsForBusiness(businessId)

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
      <div>
  <h1 className="text-2xl font-semibold text-foreground">{business.name}</h1>
  <p className="text-sm capitalize text-muted-foreground">{business.business_type.replace('_', ' ')}</p>
  <Link href={`/businesses/${businessId}/edit`} className="text-sm text-muted-foreground underline hover:text-foreground">
    Edit
  </Link>
</div>
        <div className="flex items-center gap-2">
          <Link
            href={`/businesses/${businessId}/team`}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-ring"
          >
            Manage Team
          </Link>
          <Link
            href={`/locations/new?business_id=${businessId}`}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            New Location
          </Link>
        </div>
      </div>

      {locations.length === 0 ? (
        <p className="text-muted-foreground">No locations yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.id}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-ring"
            >
              <p className="font-medium text-card-foreground">{loc.name}</p>
              {loc.city && <p className="text-sm text-muted-foreground">{loc.city}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}