'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, RefreshCw, ChevronRight, Store as StoreIcon, CheckCircle2 } from 'lucide-react'
import type { StorefrontBusiness } from '@/features/storefront/types'

interface RecentStoreUpdatesProps {
  businesses: StorefrontBusiness[]
}

export function RecentStoreUpdates({ businesses }: RecentStoreUpdatesProps) {
  if (!businesses || businesses.length === 0) return null

  // Take up to 4 recent stores
  const recentStores = businesses.slice(0, 4)

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="text-emerald-600 dark:text-[var(--lime-base)] animate-spin-slow" />
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            Recent Price Updates
          </h2>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-full px-2.5 py-0.5 dark:text-emerald-300">
          Live Activity
        </span>
      </div>

      <div className="space-y-2.5">
        {recentStores.map((biz) => {
          const logoUrl = biz.storefront?.logo_url
          const locationText = biz.locations?.[0]?.address_text ?? biz.locations?.[0]?.name ?? 'Nigeria'
          const formattedDate = new Date(biz.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })

          return (
            <Link
              key={biz.id}
              href={`/s/${biz.slug}`}
              id={`recent-update-${biz.id}`}
              className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Store Logo */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={biz.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                    <StoreIcon size={18} />
                  </div>
                )}
              </div>

              {/* Store Info & Activity Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-xs font-black text-slate-900 dark:text-white">
                    {biz.name}
                  </h3>
                  <span className="shrink-0 inline-flex items-center gap-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 size={10} />
                    Verified
                  </span>
                </div>

                <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {locationText}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <Clock size={11} />
                  <span>Prices updated {formattedDate}</span>
                </div>
              </div>

              <ChevronRight size={18} className="shrink-0 text-slate-400 dark:text-slate-500" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
