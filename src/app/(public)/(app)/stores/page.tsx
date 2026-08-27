import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getPublishedBusinesses } from '@/features/storefront/queries'
import { StoresClient } from './stores-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Stores & Menus — SurePrice',
  description: 'Browse verified physical stores, restaurants, cafés and pop-up locations on SurePrice.',
}

function StoresSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-14 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-28 rounded-full bg-slate-100 dark:bg-zinc-800 animate-pulse shrink-0" />
        ))}
      </div>
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default async function StoresPage() {
  const businesses = await getPublishedBusinesses()

  return (
    <div className="min-h-screen px-5 pt-3">
      {/* Directory Title Block */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-base)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--lime-base)] border border-[var(--lime-base)]/20">
          Verified Directory
        </span>
        <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Stores & Digital Menus
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Browse verified physical supermarkets, dining venues, cafés, and live pop-up locations.
        </p>
      </div>

      <Suspense fallback={<StoresSkeleton />}>
        <StoresClient businesses={businesses} />
      </Suspense>
    </div>
  )
}
