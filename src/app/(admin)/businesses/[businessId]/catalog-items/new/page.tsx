import { requireBusinessManage } from '@/lib/auth/require-access'
import { getCategoriesForBusiness } from '@/features/categories/queries'
import { CatalogItemForm } from '@/features/catalog-items/components/catalog-item-form'

export default async function NewCatalogItemPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const categories = await getCategoriesForBusiness(businessId)

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">New Catalog Item</h1>
      <CatalogItemForm businessId={businessId} categories={categories} />
    </div>
  )
}