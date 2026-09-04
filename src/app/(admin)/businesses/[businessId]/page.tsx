import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
  Printer,
  ChevronRight,
} from 'lucide-react'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getStorefrontBusinessById } from '@/features/storefront/queries'
import { getLocationsForBusiness } from '@/features/locations/queries'
import { getCatalogItemsForBusiness } from '@/features/catalog-items/queries'
import { FirstCatalogItemIllustration, FirstLocationIllustration } from '@/components/illustrations'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'
import { getCategorySvgIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Business Command Center — SurePrice Admin',
  description: 'View and manage store locations, catalog items, QR codes, and team members.',
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessView(businessId)

  const business = await getStorefrontBusinessById(businessId)
  if (!business) notFound()

  const [locations, items] = await Promise.all([
    getLocationsForBusiness(businessId),
    getCatalogItemsForBusiness(businessId),
  ])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const resolveUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    if (cleanPath.startsWith('storage/v1/object/public/')) {
      return `${supabaseUrl}/${cleanPath}`
    }
    return `${supabaseUrl}/storage/v1/object/public/catalog-media/${cleanPath}`
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Business Admin Header Bar */}
      <BusinessAdminNav business={business} currentSection="overview" />

      {/* ── Store QR Placement Banner ── */}
      <div className="rounded-3xl border border-emerald-200/90 bg-emerald-50/70 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <ScanLine size={22} className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  {business.business_type === 'restaurant' || business.business_type === 'cafe'
                    ? '1-Scan Storefront Menu QR Code'
                    : 'Master Storefront & Physical Tags'}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Ready to Print
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5 max-w-2xl leading-relaxed">
                {business.business_type === 'restaurant' || business.business_type === 'cafe' || business.business_type === 'popup_vendor'
                  ? 'Place 1 master QR standee on dining tables, checkout counters, or event banners. Customers scan to view your full live menu with zero app download.'
                  : 'Place 1 master Store QR at your entrance or checkout counter so shoppers can browse full inventory on their phones, alongside individual item shelf price tags.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href={`/businesses/${businessId}/qr-studio?preset=storefront_master`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              <Printer size={15} className="text-emerald-400" />
              <span>Print Store Standee (A5)</span>
            </Link>

            <Link
              href={`/businesses/${businessId}/qr-studio?preset=shelf_tag`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <span>Batch Print Item Tags</span>
              <ChevronRight size={14} className="text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Catalog Items Section (Where QR Codes Are Printed) ── */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package size={18} className="text-emerald-600 dark:text-[var(--lime-base)]" />
              <span>Catalog & Menu Items ({items.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active digitized price tags linked to this store's QR code network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/businesses/${businessId}/catalog-items`}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              View All ({items.length})
            </Link>
            <Link
              href={`/businesses/${businessId}/catalog-items/new`}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--lime-base)] px-3.5 py-1.5 text-xs font-black text-black shadow-sm"
            >
              <Plus size={13} strokeWidth={3} />
              <span>New Item</span>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50 dark:border-slate-800 dark:bg-slate-950 space-y-3">
            <FirstCatalogItemIllustration className="mx-auto w-48 h-32 rounded-xl" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">No catalog items created yet</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Add products or menu dishes to generate in-store physical QR tags.
              </p>
            </div>
            <Link
              href={`/businesses/${businessId}/catalog-items/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-4 py-2 text-xs font-black text-black shadow-sm"
            >
              <Plus size={14} />
              <span>Add First Item</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.slice(0, 6).map((item) => {
              const imageUrl = item.image_url ? resolveUrl(item.image_url) : null

              return (
                <div
                  key={item.id}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          {getCategorySvgIcon(item.name, { size: 20 })}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs font-black text-emerald-700 dark:text-[var(--lime-base)]">
                        {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/businesses/${businessId}/catalog-items/${item.id}`}
                    className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    title="Edit Item"
                  >
                    <Edit size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Locations Section ── */}
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              <span>Store Locations ({locations.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Physical branches, food trucks, and event stalls.
            </p>
          </div>

          <Link
            href={`/locations/new?business_id=${businessId}`}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Location
          </Link>
        </div>

        {locations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center bg-slate-50 dark:border-slate-800 dark:bg-slate-950 space-y-3">
            <FirstLocationIllustration className="mx-auto w-48 h-32 rounded-xl" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No physical locations added yet.</p>
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
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">{loc.name}</p>
                  {(loc.address_line1 || loc.city) && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {loc.address_line1 ?? loc.city}
                    </p>
                  )}
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}