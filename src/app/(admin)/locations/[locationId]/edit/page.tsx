import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, MapPin, ChevronRight, Building2 } from 'lucide-react'
import { requireLocationManage } from '@/lib/auth/require-access'
import { getLocationById } from '@/features/locations/queries'
import { getBusinessById } from '@/features/businesses/queries'
import { LocationEditForm } from '@/features/locations/components/location-edit-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationId: string }>
}): Promise<Metadata> {
  const { locationId } = await params
  const location = await getLocationById(locationId)
  if (!location) return {}
  return {
    title: `Edit ${location.name} · Locations — SurePrice`,
  }
}

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ locationId: string }>
}) {
  const { locationId } = await params
  await requireLocationManage(locationId)

  const location = await getLocationById(locationId)
  if (!location) notFound()

  const business = await getBusinessById(location.business_id)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8 text-slate-900">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 flex-wrap">
        <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        {business && (
          <>
            <Link
              href={`/businesses/${business.id}`}
              className="hover:text-slate-900 transition-colors"
            >
              {business.name}
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
          </>
        )}
        <Link
          href={`/locations/${location.id}`}
          className="hover:text-slate-900 transition-colors truncate"
        >
          {location.name}
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="font-bold text-slate-900">Edit</span>
      </nav>

      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Edit Location Details
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Updating physical branch profile for <span className="font-bold text-slate-800">{location.name}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/locations/${location.id}`}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Cancel</span>
        </Link>
      </div>

      <LocationEditForm location={location} />
    </div>
  )
}