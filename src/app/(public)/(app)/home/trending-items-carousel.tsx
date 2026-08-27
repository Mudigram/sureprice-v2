'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Tag, Sparkles, ChevronRight, Store as StoreIcon, CheckCircle2 } from 'lucide-react'
import type { StorefrontItem } from '@/features/storefront/types'
import { getCategorySvgIcon } from '@/components/icons'

interface FeaturedItem extends StorefrontItem {
  businessSlug: string
  businessName: string
}

interface TrendingItemsCarouselProps {
  items: FeaturedItem[]
}

export function TrendingItemsCarousel({ items }: TrendingItemsCarouselProps) {
  if (!items || items.length === 0) return null

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

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--lime-dark)] dark:text-[var(--lime-base)]" />
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            Trending Price Tags & Dishes
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Verified Prices
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {items.map((item) => {
          const imageUrl = item.image_url ? resolveUrl(item.image_url) : null

          return (
            <Link
              key={item.id}
              href={`/s/${item.businessSlug}/${item.id}`}
              id={`trending-item-${item.id}`}
              className="group flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Item Photo Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="220px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/15 via-slate-900/40 to-slate-950 text-[var(--lime-base)]">
                    {getCategorySvgIcon(item.name, { size: 36 })}
                  </div>
                )}

                {/* Parent Store Badge */}
                <div className="absolute left-2 top-2 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-extrabold text-white border border-white/20 shadow-sm">
                    <StoreIcon size={10} className="text-[var(--lime-base)]" />
                    <span className="truncate max-w-[110px]">{item.businessName}</span>
                  </span>
                </div>
              </div>

              {/* Info Area */}
              <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <h3 className="line-clamp-1 text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors">
                    {item.name}
                  </h3>
                  {item.description ? (
                    <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Verified Tag
                    </p>
                  )}
                </div>

                {/* Price & Action Row */}
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Ask Price'}
                  </span>

                  <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-[var(--lime-base)]">
                    <span>View</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
