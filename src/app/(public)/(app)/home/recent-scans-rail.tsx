'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ChevronRight, Store as StoreIcon } from 'lucide-react'
import { getHistory, type HistoryItem } from '@/lib/storefront/local-storage'
import { getCategorySvgIcon } from '@/components/icons'

export function RecentScansHomeRail() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setHistory(getHistory().slice(0, 6))
    setMounted(true)
  }, [])

  if (!mounted || history.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-500" />
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            Recently Viewed by You
          </h2>
        </div>
        <Link
          href="/history"
          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-0.5"
        >
          <span>History</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {history.map((item) => (
          <Link
            key={`recent-${item.id}-${item.viewedAt}`}
            href={`/s/${item.businessSlug}/${item.id}`}
            className="group flex w-[170px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/90 dark:bg-slate-900/90"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="170px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-950 dark:text-slate-500">
                  {getCategorySvgIcon(item.name, { size: 28 })}
                </div>
              )}
            </div>

            <div className="p-2.5 flex flex-col justify-between flex-1">
              <div>
                <p className="line-clamp-1 text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors">
                  {item.name}
                </p>
                <p className="line-clamp-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {item.businessName}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Ask Price'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-[var(--lime-base)]">
                  Re-check
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
