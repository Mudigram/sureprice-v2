import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  MapPin,
  Building2,
  Globe,
  Edit,
  Printer,
  Package,
  Store,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { requireLocationManage } from '@/lib/auth/require-access'
import { getLocationById } from '@/features/locations/queries'
import { getBusinessById } from '@/features/businesses/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationId: string }>
}): Promise<Metadata> {
  const { locationId } = await params
  const location = await getLocationById(locationId)
  if (!location) return {}
  return {
    title: `${location.name} · Branch Overview — SurePrice`,
  }
}

export default async function LocationDetailPage({
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
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8 text-slate-900">
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
        <span className="font-bold text-slate-900 truncate">{location.name}</span>
      </nav>

      {/* Main Location Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Active Physical Location</span>
            </span>
            {business && (
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {business.business_type.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {location.name}
          </h1>

          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin size={14} className="text-emerald-700 shrink-0" />
            <span>
              {location.address_line1 ? `${location.address_line1}, ` : ''}
              {location.city || 'Nigeria'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/locations/${location.id}/edit`}
            id="edit-location-header-btn"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--lime-base)] px-4 py-2.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 hover:bg-[var(--lime-dark)] active:scale-[0.98] transition-all"
          >
            <Edit size={14} />
            <span>Edit Details</span>
          </Link>
          {business && (
            <Link
              href={`/businesses/${business.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back to Store</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid: Details & Quick Actions */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Branch Info Card */}
        <div className="md:col-span-2 space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Building2 size={16} className="text-emerald-700" />
            <span>Branch Overview</span>
          </h2>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/50">
            <div className="flex items-center justify-between p-4 text-xs">
              <span className="font-semibold text-slate-500">Branch Name</span>
              <span className="font-bold text-slate-900">{location.name}</span>
            </div>

            <div className="flex items-center justify-between p-4 text-xs">
              <span className="font-semibold text-slate-500">Street Address</span>
              <span className="font-bold text-slate-900 text-right">
                {location.address_line1 || 'Not specified'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 text-xs">
              <span className="font-semibold text-slate-500">City / State</span>
              <span className="font-bold text-slate-900">{location.city || 'Nigeria'}</span>
            </div>

            <div className="flex items-center justify-between p-4 text-xs">
              <span className="font-semibold text-slate-500">Parent Business</span>
              <span className="font-bold text-slate-900">{business?.name || '—'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Hub */}
        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900">Store Quick Hub</h2>

          <div className="space-y-2.5">
            {business && (
              <>
                <Link
                  href={`/businesses/${business.id}/qr-studio`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-[var(--lime-base)]">
                      <Printer size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">QR Print Studio</p>
                      <p className="text-[10px] text-slate-500 font-medium">Generate shelf tags</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href={`/businesses/${business.id}/catalog-items`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Package size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Catalog Items</p>
                      <p className="text-[10px] text-slate-500 font-medium">Manage prices in ₦</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href={`/s/${business.slug}`}
                  target="_blank"
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <Store size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-900">Live Storefront</p>
                      <p className="text-[10px] text-emerald-700 font-medium">View shopper webview</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}