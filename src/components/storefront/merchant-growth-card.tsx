'use client'

import Link from 'next/link'
import { Store, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

export function MerchantGrowthCard() {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 text-white shadow-xl relative">
      {/* Background glow */}
      <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-[var(--lime-base)]/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-base)]/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--lime-base)] border border-[var(--lime-base)]/30">
            <Sparkles size={11} /> For Venue Owners
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">14-Day Free Pilot</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black tracking-tight text-white sm:text-lg">
            Run a restaurant, café, or shop in Ibadan?
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Turn your physical store into a live digital storefront with print-ready QR table standees & WhatsApp catalogs in 2 minutes.
          </p>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300 pt-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[var(--lime-base)] shrink-0" /> Zero POS Lock-In
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[var(--lime-base)] shrink-0" /> Ready-to-Print Tags
          </span>
        </div>

        {/* CTA button */}
        <div className="pt-2">
          <Link
            href="/onboarding"
            id="home-merchant-pilot-cta"
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[var(--lime-base)] py-3 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
          >
            <Store size={15} />
            <span>Launch Your Free Storefront Pilot</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
