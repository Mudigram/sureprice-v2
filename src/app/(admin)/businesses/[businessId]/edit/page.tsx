import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getStorefrontBusinessById, getStorefrontByBusinessId } from '@/features/storefront/queries'
import { BusinessEditForm } from '@/features/businesses/components/business-edit-form'
import { StorefrontEditForm } from '@/features/storefront/components/storefront-edit-form'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Edit Store Settings | SurePrice Admin',
  description: 'Manage store details, branding, restaurant logo, cover banner, and public storefront settings.',
}

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const [business, storefront] = await Promise.all([
    getStorefrontBusinessById(businessId),
    getStorefrontByBusinessId(businessId),
  ])

  if (!business) notFound()

  const theme = (storefront?.theme && typeof storefront.theme === 'object')
    ? (storefront.theme as Record<string, unknown>)
    : {}

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Store Admin Navigation Header */}
      <BusinessAdminNav business={business} currentSection="edit" />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Storefront Studio Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-[var(--lime-base)]/15 to-emerald-500/5 p-5 border border-emerald-500/20 shadow-sm">
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🏪</span>
              <span>Looking to update Store Hours, Status, or Banners?</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Visit the dedicated Storefront Studio tab to manage live opening hours, announcements, cover photos, and WhatsApp order routing.
            </p>
          </div>
          <a
            href={`/businesses/${businessId}/storefront`}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-900"
          >
            <span>Open Storefront Studio →</span>
          </a>
        </div>

        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            General Business Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your store business name, URL slug, and core profile for {business.name}.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Business Details
          </h2>
          <BusinessEditForm business={business} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Storefront Branding & Cover Photo
          </h2>
          <StorefrontEditForm
            businessId={businessId}
            initialData={{
              is_published: storefront?.is_published ?? true,
              logo_url: typeof theme.logo_url === 'string' ? theme.logo_url : null,
              cover_url: typeof theme.cover_url === 'string' ? theme.cover_url : null,
              tagline: typeof theme.tagline === 'string' ? theme.tagline : null,
              primary_color: typeof theme.primary_color === 'string' ? theme.primary_color : '#13ec5b',
              highlights: Array.isArray(theme.highlights) ? (theme.highlights as string[]) : [],
            }}
          />
        </div>
      </div>
    </div>
  )
}