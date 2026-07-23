import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ScanLine,
  ChevronRight,
  Zap,
  ShieldCheck,
  QrCode,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import { TickerBanner } from '@/components/storefront/ticker-banner'
import { VenueTypeGrid } from '@/components/storefront/venue-type-grid'
import { HomeStoresSection } from './home-stores-section'
import { RecentStoreUpdates } from './recent-store-updates'
import { getPublishedBusinesses } from '@/features/storefront/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SurePrice — Digital Shelf Tag & Price Lookup',
  description: 'Scan any in-store product QR code for an instant price check and product details.',
}

async function StoresDataSection() {
  let businesses: Awaited<ReturnType<typeof getPublishedBusinesses>> = []
  try {
    businesses = await getPublishedBusinesses()
  } catch {
    // Graceful fallback
  }

  return (
    <div className="space-y-6">
      {/* Promoted Partner Stores with Quick Filters */}
      <HomeStoresSection businesses={businesses} />

      {/* Recent Store Price Updates */}
      <RecentStoreUpdates businesses={businesses} />
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex min-w-[260px] max-w-[260px] flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-zinc-800" />
              <div className="h-4 w-16 rounded bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="mb-2 h-5 w-3/4 rounded bg-slate-100 dark:bg-zinc-800" />
            <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-6 pb-6">
      {/* Hero Card Banner */}
      <section className="relative mx-5 mt-3 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl dark:bg-zinc-900 border border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--lime-base)]/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-md">
              <Zap size={12} className="text-[var(--lime-base)]" />
              Zero App Install
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-base)]/20 px-3 py-1 text-[10px] font-bold tracking-wide text-[var(--lime-base)] backdrop-blur-md">
              <ShieldCheck size={12} />
              100% In-Store Verified
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Know Before You Buy
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Scan product QR codes on physical store shelves & menus for instant price tags, specs & locations.
            </p>
          </div>

          {/* Glowing Scan CTA Button */}
          <Link
            href="/scan"
            id="home-scan-cta"
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[var(--lime-base)] p-4 text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-[var(--lime-base)] shadow-inner">
              <ScanLine size={24} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                <p className="font-extrabold text-sm uppercase tracking-wide text-black">
                  Scan Product QR
                </p>
              </div>
              <p className="text-xs font-semibold opacity-80">Instant Price Check</p>
            </div>

            <ChevronRight size={20} className="text-black transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="px-5">
        <TickerBanner />
      </div>

      {/* Dynamic Stores Data Section: Partner Stores (with filter pills) & Recent Price Updates */}
      <div className="px-5">
        <Suspense fallback={<SectionSkeleton />}>
          <StoresDataSection />
        </Suspense>
      </div>

      {/* Venue Type Explorer Grid */}
      <div className="px-5">
        <VenueTypeGrid />
      </div>

      {/* 3-Step How-It-Works Visual Bar */}
      <section className="px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
              <QrCode size={16} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-800 dark:text-zinc-200">
              1. Scan QR
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 border-x border-gray-100 dark:border-zinc-800 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400">
              <Sparkles size={16} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-800 dark:text-zinc-200">
              2. Check Specs
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              <ShoppingBag size={16} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-800 dark:text-zinc-200">
              3. Pay In-Store
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
