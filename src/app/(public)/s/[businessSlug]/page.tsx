import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStorefrontBusiness, getStorefrontItems } from '@/features/storefront/queries'
import type { StorefrontItem } from '@/features/storefront/types'

export const revalidate = 60

interface Props {
  params: Promise<{ businessSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessSlug } = await params
  const business = await getStorefrontBusiness(businessSlug)
  if (!business) return {}
  return {
    title: business.name,
    description: `Browse products and prices at ${business.name}.`,
  }
}

export default async function StorefrontPage({ params }: Props) {
  const { businessSlug } = await params
  const business = await getStorefrontBusiness(businessSlug)

  if (!business) notFound()

  // Gate: unpublished storefront
  if (!business.storefront || !business.storefront.is_published) {
    return <StorefrontComingSoon name={business.name} />
  }

  const items = await getStorefrontItems(business.id)

  // Group items by category
  const categoryMap = new Map<string, { name: string; items: StorefrontItem[] }>()
  const uncategorised: StorefrontItem[] = []

  for (const item of items) {
    if (item.category) {
      const key = item.category.id
      if (!categoryMap.has(key)) {
        categoryMap.set(key, { name: item.category.name, items: [] })
      }
      categoryMap.get(key)!.items.push(item)
    } else {
      uncategorised.push(item)
    }
  }

  const groups = [
    ...Array.from(categoryMap.entries()).map(([, v]) => v),
    ...(uncategorised.length > 0 ? [{ name: 'Other', items: uncategorised }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Store header */}
      <header className="border-b border-border bg-card px-5 py-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--lime-base)]">
            {business.business_type.replace('_', ' ')}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {business.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Scan any product QR code to see full details and pricing.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-4xl">🛍️</span>
            <p className="mt-4 font-medium text-foreground">No items yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon — this store is setting up its catalog.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.name}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.name}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {group.items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      businessSlug={businessSlug}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <StorefrontFooter />
    </div>
  )
}

function ItemCard({
  item,
  businessSlug,
}: {
  item: StorefrontItem
  businessSlug: string
}) {
  return (
    <Link
      href={`/s/${businessSlug}/${item.id}`}
      id={`item-${item.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-muted-foreground">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-card-foreground">
          {item.name}
        </p>
        {item.base_price !== null ? (
          <p className="mt-1.5 text-sm font-semibold text-[var(--lime-dark)]">
            ₦{item.base_price.toLocaleString()}
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">Price on request</p>
        )}
      </div>
    </Link>
  )
}

function StorefrontComingSoon({ name }: { name: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="text-5xl">🔒</span>
      <h1 className="mt-6 text-2xl font-bold text-foreground">{name}</h1>
      <p className="mt-3 max-w-xs text-muted-foreground">
        This store isn&apos;t available yet. Check back soon.
      </p>
    </div>
  )
}

function StorefrontFooter() {
  return (
    <footer className="border-t border-border py-6 text-center">
      <p className="text-xs text-muted-foreground">
        Powered by{' '}
        <span className="font-semibold text-foreground">SurePrice</span>
      </p>
    </footer>
  )
}
