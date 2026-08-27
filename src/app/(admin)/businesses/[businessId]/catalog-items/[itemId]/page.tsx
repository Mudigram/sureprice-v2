import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit3, Image as ImageIcon, ScanLine, AlertOctagon } from 'lucide-react'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getStorefrontBusinessById } from '@/features/storefront/queries'
import { getCatalogItemById } from '@/features/catalog-items/queries'
import { getCategoriesForBusiness } from '@/features/categories/queries'
import { getMediaForTarget } from '@/features/media/queries'
import { CatalogItemEditForm } from '@/features/catalog-items/components/catalog-item-edit-form'
import { ImageUploader } from '@/features/catalog-items/components/image-uploader'
import { QrPanel } from '@/features/qr-codes/components/qr-panel'
import { DeleteItemButton } from '@/features/catalog-items/components/delete-item-button'
import { getActiveQrCodeForTarget } from '@/features/qr-codes/queries'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Edit Catalog Item | SurePrice Admin',
  description: 'Edit product details, images, price, categories, and QR tags.',
}

export default async function CatalogItemDetailPage({
  params,
}: {
  params: Promise<{ businessId: string; itemId: string }>
}) {
  const { businessId, itemId } = await params
  await requireBusinessView(businessId)

  const [business, item, categories, images, qrCode] = await Promise.all([
    getStorefrontBusinessById(businessId),
    getCatalogItemById(itemId),
    getCategoriesForBusiness(businessId),
    getMediaForTarget('catalog_item', itemId),
    getActiveQrCodeForTarget('catalog_item', itemId).catch(() => null),
  ])

  if (!business || !item || item.business_id !== businessId) notFound()

  // Derive base URL for QR panel
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Store Admin Navigation Header */}
      <BusinessAdminNav business={business} currentSection="catalog" />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back Navigation Breadcrumb */}
        <div>
          <Link
            href={`/businesses/${businessId}/catalog-items`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Catalog Items</span>
          </Link>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-[var(--lime-base)] border border-emerald-200 dark:border-emerald-800">
                <Edit3 size={22} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Edit {item.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update main product details, photos, category, and physical QR tag.
                </p>
              </div>
            </div>

            <Link
              href={`/s/${business.slug}/${item.id}`}
              target="_blank"
              className="text-xs font-bold text-emerald-700 dark:text-[var(--lime-base)] hover:underline shrink-0"
            >
              Preview Item ↗
            </Link>
          </div>
        </div>

        {/* ── SECTION 1: MAIN PRODUCT DETAILS FORM (FIRST) ── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              1. Main Product & Price Details
            </h2>
          </div>
          <CatalogItemEditForm item={item} categories={categories} />
        </section>

        {/* ── SECTION 2: PRODUCT IMAGE GALLERY UPLOADER (BELOW MAIN DETAILS) ── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-emerald-600 dark:text-[var(--lime-base)]" />
              <span>2. Product Photo Gallery (Max 2 Photos)</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">
              {images.length}/2 Uploaded
            </span>
          </div>
          <ImageUploader businessId={businessId} itemId={itemId} images={images} />
        </section>

        {/* ── SECTION 3: QR CODE TAG PANEL ── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ScanLine size={18} className="text-emerald-600 dark:text-[var(--lime-base)]" />
              <span>3. Product QR Tag & Print Code</span>
            </h2>
          </div>
          <QrPanel
            itemId={itemId}
            businessId={businessId}
            initialQrCode={qrCode}
            baseUrl={baseUrl}
          />
        </section>

        {/* ── SECTION 4: DANGER ZONE / DELETE PRODUCT ── */}
        <section className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <AlertOctagon size={16} />
              <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
              Archive and remove this product item from your active store catalog and QR tags.
            </p>
          </div>

          <DeleteItemButton itemId={itemId} businessId={businessId} itemName={item.name} />
        </section>
      </div>
    </div>
  )
}