import { requireBusinessManage } from '@/lib/auth/require-access'
import { getCategoriesForBusiness } from '@/features/categories/queries'
import { CategoryForm } from '@/features/categories/components/category-form'
import { CategoryRow } from '@/features/categories/components/category-row'

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const categories = await getCategoriesForBusiness(businessId, true)

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Categories</h1>
      <div className="mb-6">
        <CategoryForm businessId={businessId} />
      </div>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            businessId={businessId}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
          />
        ))}
      </div>
    </div>
  )
}