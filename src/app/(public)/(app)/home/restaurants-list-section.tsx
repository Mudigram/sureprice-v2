'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Utensils, MapPin, CheckCircle2, Check, Clock, ChevronRight } from 'lucide-react'
import type { StorefrontBusiness, WeeklyOperatingHours, StatusOverride } from '@/features/storefront/types'
import { computeIsOpen } from '@/features/storefront/types'
import { getBrandFallbackSvgIcon } from '@/components/icons'

interface Props {
  businesses: StorefrontBusiness[]
}

export function RestaurantsListSection({ businesses }: Props) {
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

  // Filter for active restaurants & cafes
  const restaurants = businesses.filter(
    (b) => b.business_type === 'restaurant' || b.business_type === 'cafe' || b.storefront?.is_published
  )

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
            <Utensils size={15} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900">
              Restaurants on SurePrice
            </h2>
            <p className="text-[11px] font-medium text-slate-500">
              Verified dining menus across Ibadan · Zero hidden prices
            </p>
          </div>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-700">No restaurants live yet.</p>
          <p className="mt-1 text-xs text-slate-400">Check back soon as we onboard Ibadan partner dining spots.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {restaurants.map((business) => {
            const primaryLocation = business.locations?.[0]
            const addressText = primaryLocation?.address_text ?? primaryLocation?.name ?? 'Ibadan, Oyo'

            const themeConfig = (business.storefront?.theme && typeof business.storefront.theme === 'object')
              ? (business.storefront.theme as Record<string, unknown>)
              : {}

            const rawLogoUrl =
              (typeof (business.storefront as Record<string, unknown>)?.logo_url === 'string' &&
                ((business.storefront as Record<string, unknown>).logo_url as string)) ||
              (typeof themeConfig.logo_url === 'string' && themeConfig.logo_url) ||
              (typeof themeConfig.logoUrl === 'string' && themeConfig.logoUrl) ||
              null

            const rawCoverUrl =
              (typeof (business.storefront as Record<string, unknown>)?.cover_url === 'string' &&
                ((business.storefront as Record<string, unknown>).cover_url as string)) ||
              (typeof themeConfig.cover_url === 'string' && themeConfig.cover_url) ||
              (typeof themeConfig.coverUrl === 'string' && themeConfig.coverUrl) ||
              null

            const logoUrl = rawLogoUrl ? resolveUrl(rawLogoUrl) : null
            const coverUrl = rawCoverUrl ? resolveUrl(rawCoverUrl) : null

            const themeHours = themeConfig.operating_hours as WeeklyOperatingHours | undefined
            const themeStatusOverride = themeConfig.status_override as StatusOverride | undefined
            const { isOpen, text: statusText } = computeIsOpen(
              themeHours || primaryLocation?.location_hours,
              themeStatusOverride
            )

            const tagline = typeof themeConfig.tagline === 'string' ? themeConfig.tagline : null

            return (
              <Link
                key={business.id}
                href={`/s/${business.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
              >
                {/* 16:9 Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={business.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 380px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-900/10 via-slate-100 to-amber-900/20 text-amber-700">
                      {getBrandFallbackSvgIcon(business.business_type, { size: 40 })}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top-Left: Verified Seal Sticker */}
                  <div className="absolute left-3 top-3 z-10">
                    <div
                      title="Verified by SurePrice"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/75 backdrop-blur-md border border-white/25 shadow-lg text-[var(--lime-base)]"
                    >
                      <Check size={14} strokeWidth={3.5} />
                    </div>
                  </div>

                  <div className="absolute right-3 top-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md border border-white/20">
                      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      {statusText}
                    </span>
                  </div>

                  {/* Store Logo (Bottom-Left) */}
                  <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-2">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={business.name}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-700">
                          {getBrandFallbackSvgIcon(business.business_type, { size: 18 })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body details */}
                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {business.name}
                      </h3>
                      <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>

                    {tagline && (
                      <p className="mt-0.5 text-[11px] text-slate-500 font-medium line-clamp-1 italic">
                        &ldquo;{tagline}&rdquo;
                      </p>
                    )}

                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">{addressText}</span>
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">
                      {business.business_type === 'cafe' ? '☕ Café & Bakery' : '🍲 Dining & Grill'}
                    </span>
                    <span className="text-[11px] font-black text-emerald-700 group-hover:text-emerald-800">
                      View Menu →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
