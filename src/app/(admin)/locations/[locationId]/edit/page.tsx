import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
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
    <div className="mx-auto max-w-xl space-y-6 p-4 sm:p-8">
      {/* Header & Navigation */}
      <div className="space-y-2">
        <Link
          href={`/businesses/${location.business_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Store Overview</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Edit Location Details</h1>
            <p className="text-xs text-slate-500 font-medium">
              Updating branch details for <span className="font-bold text-slate-800">{location.name}</span>
            </p>
          </div>
        </div>
      </div>

      <LocationEditForm location={location} />
    </div>
  )
}