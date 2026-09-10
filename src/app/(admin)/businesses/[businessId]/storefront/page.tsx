import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import {
  getStorefrontBusinessById,
  getStorefrontByBusinessId,
} from '@/features/storefront/queries'
import { StorefrontStudioForm } from '@/features/storefront/components/storefront-studio-form'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'
import type { WeeklyOperatingHours, StatusOverride, PopupEventConfig } from '@/features/storefront/types'

export const metadata: Metadata = {
  title: 'Storefront Studio | SurePrice Admin',
  description: 'Manage your public digital menu, operating hours, live status, banners, and WhatsApp order routing.',
}

export default async function StorefrontStudioPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const [business, storefront] = await Promise.all([
    getStorefrontBusinessById(businessId),
    getStorefrontByBusinessId(businessId),
  ])

  if (!business) notFound()

  const theme = (storefront?.theme && typeof storefront.theme === 'object')
    ? (storefront.theme as Record<string, unknown>)
    : {}

  const statusOverride = (theme.status_override && typeof theme.status_override === 'object')
    ? (theme.status_override as StatusOverride)
    : null

  const operatingHours = (theme.operating_hours && typeof theme.operating_hours === 'object')
    ? (theme.operating_hours as WeeklyOperatingHours)
    : null

  const announcement = (theme.announcement && typeof theme.announcement === 'object')
    ? (theme.announcement as { enabled?: boolean; text?: string })
    : typeof theme.announcement === 'string'
    ? { enabled: true, text: theme.announcement }
    : null

  const ordering = (theme.ordering && typeof theme.ordering === 'object')
    ? (theme.ordering as { whatsapp_phone?: string })
    : null

  const eventConfig = (theme.event && typeof theme.event === 'object')
    ? (theme.event as PopupEventConfig)
    : null

  const bankDetails = (theme.bank_details && typeof theme.bank_details === 'object')
    ? (theme.bank_details as { enabled?: boolean; bank_name?: string; account_number?: string; account_name?: string })
    : null

  const socials = (theme.socials && typeof theme.socials === 'object')
    ? (theme.socials as { instagram?: string; tiktok?: string; twitter?: string; facebook?: string; website?: string })
    : null

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900">
      {/* Unified Store Admin Navigation Header */}
      <BusinessAdminNav business={business} currentSection="storefront" />

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Storefront Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control your live opening hours, status banners, branding, and customer WhatsApp routing for {business.name}.
          </p>
        </div>

        <StorefrontStudioForm
          businessId={businessId}
          businessSlug={business.slug}
          businessType={business.business_type}
          initialData={{
            is_published: storefront?.is_published ?? true,
            status_mode: statusOverride?.mode ?? 'auto',
            status_notice: statusOverride?.notice ?? '',
            operating_hours: operatingHours,
            event: eventConfig,
            logo_url: typeof theme.logo_url === 'string' ? theme.logo_url : null,
            cover_url: typeof theme.cover_url === 'string' ? theme.cover_url : null,
            tagline: typeof theme.tagline === 'string' ? theme.tagline : null,
            description: typeof theme.description === 'string' ? theme.description : null,
            primary_color: typeof theme.primary_color === 'string' ? theme.primary_color : '#13ec5b',
            announcement_enabled: announcement?.enabled ?? false,
            announcement_text: announcement?.text ?? '',
            whatsapp_phone: ordering?.whatsapp_phone ?? business.locations?.[0]?.phone ?? '',
            stall_number: typeof theme.stall_number === 'string' ? theme.stall_number : null,
            location_zone: typeof theme.location_zone === 'string' ? theme.location_zone : null,
            directions_landmark: typeof theme.directions_landmark === 'string' ? theme.directions_landmark : null,
            bank_enabled: bankDetails?.enabled ?? false,
            bank_name: bankDetails?.bank_name ?? '',
            account_number: bankDetails?.account_number ?? '',
            account_name: bankDetails?.account_name ?? '',
            social_instagram: socials?.instagram ?? '',
            social_tiktok: socials?.tiktok ?? '',
            social_twitter: socials?.twitter ?? '',
            social_facebook: socials?.facebook ?? '',
            social_website: socials?.website ?? '',
            payments: Array.isArray(theme.payments) ? (theme.payments as string[]) : ['Cash', 'Bank Transfer', 'POS Card'],
            highlights: Array.isArray(theme.highlights) ? (theme.highlights as string[]) : [],
          }}
        />
      </div>
    </div>
  )
}
