import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessById } from '@/features/businesses/queries'
import { BusinessEditForm } from '@/features/businesses/components/business-edit-form'

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const business = await getBusinessById(businessId)
  if (!business) notFound()

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Edit Business</h1>
      <BusinessEditForm business={business} />
    </div>
  )
}