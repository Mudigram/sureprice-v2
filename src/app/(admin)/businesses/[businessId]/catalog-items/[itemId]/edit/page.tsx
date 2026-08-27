import { redirect } from 'next/navigation'

export default async function EditCatalogItemPage({
  params,
}: {
  params: Promise<{ businessId: string; itemId: string }>
}) {
  const { businessId, itemId } = await params
  redirect(`/businesses/${businessId}/catalog-items/${itemId}`)
}