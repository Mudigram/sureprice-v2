import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { LocationForm } from '@/features/locations/components/location-form'
import { getBusinessById } from '@/features/businesses/queries'

export default async function NewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ business_id?: string }>
}) {
  const { business_id } = await searchParams
  if (!business_id) redirect('/dashboard')

  await requireBusinessManage(business_id)
  const business = await getBusinessById(business_id)

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4 sm:p-8">
      {/* Header & Navigation */}
      <div className="space-y-2">
        <Link
          href={`/businesses/${business_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to {business?.name || 'Store'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Add New Location</h1>
            <p className="text-xs text-slate-500 font-medium">
              Physical branch or stall address for <span className="font-bold text-slate-800">{business?.name}</span>
            </p>
          </div>
        </div>
      </div>

      <LocationForm businessId={business_id} />
    </div>
  )
}