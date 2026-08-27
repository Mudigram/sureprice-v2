import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getStorefrontBusinessById } from '@/features/storefront/queries'
import { getCategoriesForBusiness } from '@/features/categories/queries'
import { CategoryForm } from '@/features/categories/components/category-form'
import { CategoryRow } from '@/features/categories/components/category-row'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Categories Studio | SurePrice Admin',
  description: 'Organize store catalog categories and drag-and-drop sort order.',
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const business = await getStorefrontBusinessById(businessId)
  if (!business) notFound()

  const categories = await getCategoriesForBusiness(businessId, true)

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Business Admin Navigation Bar */}
      <BusinessAdminNav business={business} currentSection="categories" />

      {/* Main Categories Card Wrapper */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Category Management ({categories.length})
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Create catalog categories and manage display order for {business.name}.
          </p>
        </div>

        {/* Add Category Form */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <CategoryForm businessId={businessId} />
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
              No categories created yet. Use the form above to add your first category.
            </p>
          ) : (
            categories.map((category, index) => (
              <CategoryRow
                key={category.id}
                category={category}
                businessId={businessId}
                isFirst={index === 0}
                isLast={index === categories.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}