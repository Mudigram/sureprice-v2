'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Store as StoreIcon,
  Utensils,
  Ticket,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { computeIsOpen, type StorefrontBusiness } from '@/features/storefront/types'
import { getBrandFallbackSvgIcon } from '@/components/icons'

interface StoreCardProps {
  business: StorefrontBusiness
  className?: string
}

export function StoreCard({ business, className }: StoreCardProps) {
  const storefrontTheme =
    business.storefront?.theme && typeof business.storefront.theme === 'object'
      ? (business.storefront.theme as Record<string, unknown>)
      : {}

  const rawLogoUrl =
    (typeof (business.storefront as Record<string, unknown>)?.logo_url === 'string' &&
      ((business.storefront as Record<string, unknown>).logo_url as string)) ||
    (typeof storefrontTheme.logo_url === 'string' && storefrontTheme.logo_url) ||
    (typeof storefrontTheme.logoUrl === 'string' && storefrontTheme.logoUrl) ||
    null

  const rawCoverUrl =
    (typeof (business.storefront as Record<string, unknown>)?.cover_url === 'string' && ((business.storefront as Record<string, unknown>).cover_url as string)) ||
    (typeof storefrontTheme.cover_url === 'string' && storefrontTheme.cover_url) ||
    (typeof storefrontTheme.coverUrl === 'string' && storefrontTheme.coverUrl) ||
    (typeof storefrontTheme.banner_url === 'string' && storefrontTheme.banner_url) ||
    (typeof storefrontTheme.bannerUrl === 'string' && storefrontTheme.bannerUrl) ||
    (Array.isArray((business as unknown as { media?: Array<{ target_type?: string; storage_path?: string }> }).media) &&
      (business as unknown as { media?: Array<{ target_type?: string; storage_path?: string }> }).media?.find(
        (m) => (m.target_type === 'business' || m.target_type === 'storefront') && typeof m.storage_path === 'string'
      )?.storage_path) ||
    null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const resolveUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    if (cleanPath.startsWith('storage/v1/object/public/')) {
      return `${supabaseUrl}/${cleanPath}`
    }
    return `${supabaseUrl}/storage/v1/object/public/catalog-media/${cleanPath}`
  }

  const logoUrl = rawLogoUrl ? resolveUrl(rawLogoUrl) : null
  const coverUrl = rawCoverUrl ? resolveUrl(rawCoverUrl) : null

  const primaryLocation = business.locations?.[0]
  const addressText = primaryLocation?.address_text ?? primaryLocation?.name ?? 'Nigeria'

  const hours = primaryLocation?.location_hours
  const { isOpen, text: statusText } = computeIsOpen(hours)

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  // Dynamic visual themes per business type
  const theme = isRestaurant
    ? {
        bannerGradient: 'from-amber-500/20 via-amber-500/10 to-slate-900/40',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
        typeLabel: business.business_type === 'cafe' ? 'Café' : 'Restaurant',
        icon: Utensils,
        tagline: 'Digital Menu',
        cta: 'View Menu',
        ctaColor: 'text-amber-700 dark:text-amber-400',
      }
    : isEvent
    ? {
        bannerGradient: 'from-purple-500/20 via-purple-500/10 to-slate-900/40',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900',
        typeLabel: 'Event Stall',
        icon: Ticket,
        tagline: 'Stall QR',
        cta: 'View Stall',
        ctaColor: 'text-purple-700 dark:text-purple-400',
      }
    : {
        bannerGradient: 'from-emerald-500/20 via-emerald-500/10 to-slate-900/40',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
        typeLabel: 'Retail',
        icon: ShoppingBag,
        tagline: 'Shelf Tags',
        cta: 'Browse Tags',
        ctaColor: 'text-emerald-700 dark:text-[var(--lime-base)]',
      }

  const TypeIcon = theme.icon
  const itemCount = business.itemCount ?? 0
  const displayImage = coverUrl || logoUrl

  return (
    <Link
      href={`/s/${business.slug}`}
      id={`store-card-${business.id}`}
      className={`group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-md backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-300 active:scale-[0.98] dark:border-slate-800/90 dark:bg-slate-900/90 dark:hover:border-slate-700/90 ${
        className || 'w-full'
      }`}
    >
      {/* Left Image Thumbnail Container */}
      <div className="relative h-28 w-28 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 dark:bg-slate-950 dark:border-slate-800">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={business.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 112px, 144px"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${theme.bannerGradient}`}>
            {getBrandFallbackSvgIcon(business.business_type, { size: 36 })}
          </div>
        )}

        {/* Venue Type Badge Overlay */}
        <div className="absolute left-1.5 top-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${theme.badgeBg}`}
          >
            <TypeIcon size={9} />
            {theme.typeLabel}
          </span>
        </div>

        {/* Store Logo Avatar Accent (if cover is main display) */}
        {coverUrl && logoUrl && (
          <div className="absolute bottom-1.5 left-1.5 z-10 h-7 w-7 overflow-hidden rounded-lg border border-white/80 bg-slate-900 shadow-md">
            <Image src={logoUrl} alt={business.name} fill className="object-cover" sizes="28px" />
          </div>
        )}
      </div>

      {/* Right Content Info Column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Top Line: Name & Open/Closed Status */}
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="truncate text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors">
              {business.name}
            </h3>

            <span
              className={`inline-flex items-center gap-1 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                isOpen
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900'
                  : 'bg-rose-100 text-rose-900 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {statusText}
            </span>
          </div>

          {/* Catalog Density Signal */}
          <div className="mt-1 flex items-center gap-2">
            {itemCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <ShoppingBag size={12} className="text-emerald-600 dark:text-[var(--lime-base)]" />
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'} Listed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-600 dark:text-[var(--lime-base)]" />
                Verified QR Tag
              </span>
            )}
          </div>

          {/* Location Address */}
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
            <MapPin size={12} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{addressText}</span>
          </p>
        </div>

        {/* Bottom CTA Action Line */}
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {theme.tagline}
          </span>

          <span className={`flex items-center gap-0.5 text-xs font-black ${theme.ctaColor}`}>
            <span>{theme.cta}</span>
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

