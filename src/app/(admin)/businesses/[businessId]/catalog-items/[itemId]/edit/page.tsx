import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getCatalogItemById } from '@/features/catalog-items/queries'
import { getCategoriesForBusiness } from '@/features/categories/queries'
import { CatalogItemEditForm } from '@/features/catalog-items/components/catalog-item-edit-form'

export default async function EditCatalogItemPage({
  params,
}: {
  params: Promise<{ businessId: string; itemId: string }>
}) {
  const { businessId, itemId } = await params
  await requireBusinessManage(businessId)

  const item = await getCatalogItemById(itemId)
  if (!item || item.business_id !== businessId) notFound()

  const categories = await getCategoriesForBusiness(businessId, true)

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Edit Catalog Item</h1>
      <CatalogItemEditForm item={item} categories={categories} />
    </div>
  )
}