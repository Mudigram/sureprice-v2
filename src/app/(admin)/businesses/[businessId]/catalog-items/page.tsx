import Link from 'next/link'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getCatalogItemsForBusiness } from '@/features/catalog-items/queries'

export default async function CatalogItemsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessView(businessId)

  const items = await getCatalogItemsForBusiness(businessId)

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Catalog Items</h1>
        <Link href={`/businesses/${businessId}/catalog-items/new`} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No catalog items yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} href={`/businesses/${businessId}/catalog-items/${item.id}`} className="rounded-xl border border-border bg-card p-4 hover:border-ring">
              <p className="font-medium text-card-foreground">{item.name}</p>
              {item.base_price !== null && <p className="text-sm text-muted-foreground">₦{item.base_price}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}