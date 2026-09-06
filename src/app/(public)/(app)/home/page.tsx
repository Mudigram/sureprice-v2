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
  Store,
  Tag,
  Utensils,
} from 'lucide-react'
import { MerchantGrowthCard } from '@/components/storefront/merchant-growth-card'
import { RecentScansHomeRail } from './recent-scans-rail'
import { RestaurantsListSection } from './restaurants-list-section'
import { getPublishedBusinesses } from '@/features/storefront/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SurePrice — Scan it. Know it.',
  description: 'Scan any in-store product QR code or dining table standee for instant verified prices in Nigerian Naira (₦). Zero app install required.',
}

async function DynamicHomepageContent() {
  let businesses: Awaited<ReturnType<typeof getPublishedBusinesses>> = []

  try {
    businesses = await getPublishedBusinesses()
  } catch {
    // Graceful fallback
  }

  return (
    <div className="space-y-6">
      {/* MVP Flat Discovery: Live Partner Restaurants in Ibadan */}
      <RestaurantsListSection businesses={businesses} />

      {/* In-App Merchant Onboarding / Inquiry Card */}
      <MerchantGrowthCard />
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-48 rounded-xl bg-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse space-y-3"
          >
            <div className="aspect-[16/9] w-full rounded-2xl bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-5 pb-8 bg-slate-50 text-slate-900 selection:bg-[var(--lime-base)] selection:text-black">
      {/* Hero Scanner Card Banner */}
      <section className="relative mx-5 mt-4 overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-xl border border-slate-800">
        {/* Decorative background glows */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--lime-base)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white backdrop-blur-md border border-white/10">
              <Zap size={11} className="text-[var(--lime-base)]" />
              Zero App Install
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-base)]/20 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-[var(--lime-base)] backdrop-blur-md border border-[var(--lime-base)]/30">
              <ShieldCheck size={11} />
              100% Verified Naira (₦)
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl leading-tight">
              Scan it. Know it.
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-300 font-medium">
              Point camera at any in-store product shelf tag or table standee for instant verified prices.
            </p>
          </div>

          {/* Glowing Scan CTA Button */}
          <Link
            href="/scan"
            id="home-scan-cta"
            className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-[var(--lime-base)] p-3.5 text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-[var(--lime-base)] shadow-inner">
              <ScanLine size={22} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                <p className="font-black text-xs sm:text-sm uppercase tracking-wide text-black truncate">
                  Scan Product QR Tag
                </p>
              </div>
              <p className="text-[11px] font-semibold opacity-85">Instant Camera Price Check</p>
            </div>

            <ChevronRight size={18} className="text-black transition-transform group-hover:translate-x-1 shrink-0" />
          </Link>
        </div>
      </section>

      {/* Dynamic Stores & Items Data Section */}
      <div className="px-5 space-y-6">
        <RecentScansHomeRail />
        <Suspense fallback={<SectionSkeleton />}>
          <DynamicHomepageContent />
        </Suspense>
      </div>

      {/* 3-Step How-It-Works Visual Bar (Differentiating Shelf Tag vs Table Standee) */}
      <section className="px-5 pt-2">
        <div className="grid grid-cols-3 gap-2 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm text-center">
          {/* Step 1A: Shelf Tag */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 border border-slate-200">
              <Tag size={16} />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-tight text-slate-900 block">
                1. Shelf Tag
              </span>
              <span className="text-[9px] text-slate-500 font-medium block">
                Instant single price
              </span>
            </div>
          </div>

          {/* Step 1B: Table Standee */}
          <div className="flex flex-col items-center gap-1.5 border-x border-slate-100 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
              <Utensils size={16} className="text-amber-700" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-tight text-slate-900 block">
                2. Table Standee
              </span>
              <span className="text-[9px] text-slate-500 font-medium block">
                Browse full menu
              </span>
            </div>
          </div>

          {/* Step 2: Pay in-Store */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShoppingBag size={16} className="text-emerald-700" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-tight text-slate-900 block">
                3. Pay In-Store
              </span>
              <span className="text-[9px] text-slate-500 font-medium block">
                Show price list
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
