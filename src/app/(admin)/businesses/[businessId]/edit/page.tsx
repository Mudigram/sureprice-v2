import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessById } from '@/features/businesses/queries'
import { getStorefrontByBusinessId } from '@/features/storefront/queries'
import { BusinessEditForm } from '@/features/businesses/components/business-edit-form'
import { StorefrontEditForm } from '@/features/storefront/components/storefront-edit-form'

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const [business, storefront] = await Promise.all([
    getBusinessById(businessId),
    getStorefrontByBusinessId(businessId),
  ])

  if (!business) notFound()

  const theme = (storefront?.theme && typeof storefront.theme === 'object')
    ? (storefront.theme as Record<string, unknown>)
    : {}

  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-foreground">Edit Business & Storefront</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your business details, branding, restaurant logo, cover banner, and public storefront settings.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground">General Information</h2>
        <BusinessEditForm business={business} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground">Storefront Branding & Logo</h2>
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
  )
}
