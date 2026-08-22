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
  title: 'SurePrice — Scan it. Know it.',
  description: 'Scan any in-store product QR code for instant verified prices in Nigerian Naira (₦). Zero app install required.',
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
            className="flex min-w-[260px] max-w-[260px] flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
            </div>
            <div className="mb-2 h-5 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-6 pb-8 bg-[#f9fafb] text-slate-900 selection:bg-[var(--lime-base)] selection:text-black">
      {/* Hero Scanner Card Banner */}
      <section className="relative mx-5 mt-4 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800">
        {/* Decorative background glows */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--lime-base)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold tracking-wide text-white backdrop-blur-md border border-white/10">
              <Zap size={12} className="text-[var(--lime-base)]" />
              Zero App Install
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-base)]/20 px-3 py-1 text-[10px] font-extrabold tracking-wide text-[var(--lime-base)] backdrop-blur-md border border-[var(--lime-base)]/30">
              <ShieldCheck size={12} />
              100% Verified Naira (₦) Prices
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl leading-tight">
              Scan it. Know it.
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 font-medium">
              Point your camera at any in-store product QR tag or dining menu for instant verified prices & details across Nigeria.
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
                <p className="font-black text-sm uppercase tracking-wide text-black">
                  Scan Product QR
                </p>
              </div>
              <p className="text-xs font-semibold opacity-85">Instant Price Check</p>
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
        <div className="grid grid-cols-3 gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm text-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 border border-slate-200">
              <QrCode size={18} />
            </div>
            <span className="text-[11px] font-black tracking-tight text-slate-900">
              1. Scan QR
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 border-x border-slate-100 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles size={18} className="text-[var(--lime-dark)]" />
            </div>
            <span className="text-[11px] font-black tracking-tight text-slate-900">
              2. Check Price
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
              <ShoppingBag size={18} />
            </div>
            <span className="text-[11px] font-black tracking-tight text-slate-900">
              3. Pay In-Store
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
