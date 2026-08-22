import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  TrendingUp,
  MapPin,
  Package,
  Plus,
  ScanLine,
  Users,
  FolderTree,
  Edit,
  ArrowRight,
} from 'lucide-react'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getBusinessById } from '@/features/businesses/queries'
import { getLocationsForBusiness } from '@/features/locations/queries'
import { getCatalogItemsForBusiness } from '@/features/catalog-items/queries'
import { FirstCatalogItemIllustration, FirstLocationIllustration } from '@/components/illustrations'

export const metadata: Metadata = {
  title: 'Business Overview — SurePrice Admin',
  description: 'View and manage store locations, catalog items, QR codes, and team members.',
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

  const [locations, items] = await Promise.all([
    getLocationsForBusiness(businessId),
    getCatalogItemsForBusiness(businessId),
  ])

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-8">
      {/* ── Business Header & Action Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">{business.name}</h1>
            <Link
              href={`/businesses/${businessId}/edit`}
              className="text-slate-400 hover:text-white transition-colors"
              title="Edit Business"
            >
              <Edit size={16} />
            </Link>
          </div>

          <p className="mt-1 text-xs capitalize text-slate-400">
            {business.business_type.replace(/_/g, ' ')} • {locations.length} Location{locations.length !== 1 ? 's' : ''} • {items.length} Product{items.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/businesses/${businessId}/catalog-items/new`}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-3.5 py-2 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
          >
            <Plus size={14} />
            <span>New Item</span>
          </Link>

          <Link
            href={`/businesses/${businessId}/analytics`}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3.5 py-2 text-xs font-black text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
          >
            <TrendingUp size={14} />
            <span>Scan Analytics</span>
          </Link>

          <Link
            href={`/businesses/${businessId}/qr-studio`}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--lime-base)]/40 bg-[var(--lime-base)]/10 px-3.5 py-2 text-xs font-black text-[var(--lime-base)] hover:bg-[var(--lime-base)] hover:text-black transition-all"
          >
            <ScanLine size={14} />
            <span>Print Studio</span>
          </Link>

          <Link
            href={`/businesses/${businessId}/qr-codes`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <ScanLine size={14} className="text-slate-400" />
            <span>QR Directory</span>
          </Link>

          <Link
            href={`/businesses/${businessId}/categories`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <FolderTree size={14} />
            <span>Categories</span>
          </Link>

          <Link
            href={`/businesses/${businessId}/team`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Users size={14} />
            <span>Team</span>
          </Link>
        </div>
      </div>

      {/* ── Catalog Items Section (Where QR Codes Are Printed) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[var(--lime-base)]" />
            <h2 className="text-base font-black text-white">Catalog Items & QR Tags</h2>
          </div>

          <Link
            href={`/businesses/${businessId}/catalog-items/new`}
            className="text-xs font-bold text-[var(--lime-base)] hover:underline"
          >
            + Add Product Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center bg-slate-900/40 space-y-4">
            <FirstCatalogItemIllustration className="mx-auto w-56 h-40 rounded-2xl" />
            <div>
              <p className="text-sm font-bold text-white">No catalog items created yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Add products or menu items to automatically generate physical QR tags.
              </p>
            </div>
            <Link
              href={`/businesses/${businessId}/catalog-items/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-4 py-2.5 text-xs font-black text-black shadow-md"
            >
              <Plus size={14} />
              <span>Add First Catalog Item</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/businesses/${businessId}/catalog-items/${item.id}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-slate-700 active:scale-98"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-sm text-white group-hover:text-[var(--lime-base)] transition-colors truncate">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 font-mono">
                    {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-extrabold text-slate-300 border border-slate-800">
                    <ScanLine size={12} className="text-[var(--lime-base)]" />
                    <span>View QR Tag</span>
                  </span>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Locations Section ── */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-blue-400" />
            <h2 className="text-base font-black text-white">Store Locations</h2>
          </div>

          <Link
            href={`/locations/new?business_id=${businessId}`}
            className="text-xs font-bold text-blue-400 hover:underline"
          >
            + Add Location
          </Link>
        </div>

        {locations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 p-6 text-center bg-slate-900/40 space-y-3">
            <FirstLocationIllustration className="mx-auto w-48 h-36 rounded-2xl" />
            <p className="text-xs font-bold text-slate-300">No physical locations added yet.</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Add store locations or pop-up event stalls to generate location-scoped QR tags.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-slate-700"
              >
                <div>
                  <p className="font-extrabold text-sm text-white">{loc.name}</p>
                  {(loc.address_line1 || loc.city) && (
                    <p className="mt-0.5 text-xs text-slate-400 truncate max-w-xs">
                      {loc.address_line1 ?? loc.city}
                    </p>
                  )}
                </div>
                <ArrowRight size={14} className="text-slate-500" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}