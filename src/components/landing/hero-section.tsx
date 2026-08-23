'use client'

import { motion } from 'framer-motion'
import { ScanLine, ChevronRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-[90dvh] flex flex-col justify-center px-4 sm:px-6 pt-12 pb-16 text-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-[var(--lime-base)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10 space-y-6">
        {/* Top Pilot Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold text-emerald-800 shadow-sm"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--lime-base)] animate-pulse" />
          <span>Scan it. Know it. · Lagos, Nigeria Pilot</span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-slate-900"
        >
          Know the exact price before you{' '}
          <span className="inline-block text-slate-900 underline decoration-[var(--lime-base)] decoration-4 sm:decoration-8 underline-offset-8">
            reach checkout
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-slate-600 font-medium"
        >
          Digital price tag & menu layer over physical supermarkets, dining cafés, and festival pop-ups across Nigeria. Zero app install required.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <ButtonLink href="/scan" id="hero-scan-cta" size="lg">
            <ScanLine size={18} strokeWidth={2.5} />
            <span>Try Scanning Now</span>
          </ButtonLink>

          <ButtonLink href="/login" id="hero-owner-cta" variant="outline" size="lg">
            <span>Merchant Sign In</span>
            <ChevronRight size={16} />
          </ButtonLink>
        </motion.div>

        {/* Mobile Phone Mockup Interactive Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8"
        >
          <div className="relative mx-auto w-64 sm:w-72">
            <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-slate-900 bg-slate-900 shadow-2xl shadow-slate-900/40">
              {/* Phone Notch */}
              <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-3">
                <div className="h-4 w-24 rounded-full bg-slate-950 border border-slate-800" />
              </div>

              {/* Scanning Laser Beam Overlay */}
              <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[var(--lime-base)] shadow-[0_0_20px_#13ec5b] animate-scan-laser opacity-90 pointer-events-none" />

              <div className="px-5 pb-6 pt-10 text-left bg-slate-900">
                <div className="rounded-2xl border border-[var(--lime-base)]/50 bg-slate-950 p-3.5 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lime-base)]/20 text-[var(--lime-base)]">
                      <ScanLine size={20} />
                    </div>
                    <div>
                      <p className="font-black text-xs text-white">Scanning Shelf QR</p>
                      <p className="text-[10px] text-slate-400 font-medium">Camera Aligned</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <span className="inline-block rounded-full bg-[var(--lime-base)]/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--lime-base)] border border-[var(--lime-base)]/30">
                    ✓ Verified Price
                  </span>
                  <p className="text-sm font-black text-white pt-0.5">Whole Wheat Bread 800g</p>
                  <p className="text-2xl font-black text-white">
                    ₦1,250<span className="ml-1 inline-block h-2 w-2 rounded-full bg-[var(--lime-base)] animate-pulse" />
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 border-t border-slate-900 pt-2">
                    ✓ Verified today at Spar VI, Lagos
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-[var(--lime-base)]/20 blur-3xl pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
