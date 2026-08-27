import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getStorefrontBusinessById } from '@/features/storefront/queries'
import { getCategoriesForBusiness } from '@/features/categories/queries'
import { CatalogItemForm } from '@/features/catalog-items/components/catalog-item-form'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Add New Catalog Item | SurePrice Admin',
  description: 'Create a new product or food menu dish for your store.',
}

export default async function NewCatalogItemPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const [business, categories] = await Promise.all([
    getStorefrontBusinessById(businessId),
    getCategoriesForBusiness(businessId),
  ])

  if (!business) notFound()

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Business Admin Navigation Bar */}
      <BusinessAdminNav business={business} currentSection="catalog" />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Back Navigation Breadcrumb */}
        <div>
          <Link
            href={`/businesses/${businessId}/catalog-items`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Catalog Items</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-sm">
              <PackagePlus size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Add New Catalog Item
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register a new product or dining dish for {business.name}.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CatalogItemForm businessId={businessId} categories={categories} />
        </div>
      </div>
    </div>
  )
}