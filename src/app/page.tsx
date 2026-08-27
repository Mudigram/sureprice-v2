import type { Metadata } from 'next'
import Link from 'next/link'
import { ScanLine, Lock } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { HeroSection } from '@/components/landing/hero-section'
import { FeatureTabs } from '@/components/landing/feature-tabs'
import { BentoShowcase } from '@/components/landing/bento-showcase'
import { VenueAccordion } from '@/components/landing/venue-accordion'
import { WorkflowSteps } from '@/components/landing/workflow-steps'
import { FloatingScanPrompt } from '@/components/landing/floating-scan-prompt'

export const metadata: Metadata = {
  title: 'SurePrice. Scan it. Know it.',
  description:
    'SurePrice lets shoppers scan any physical shelf QR tag or menu for instant, verified prices in Naira (₦). Zero app install required. Built for supermarkets, dining cafés, and pop-up vendors across Nigeria.',
}

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] text-slate-900 selection:bg-[var(--lime-base)] selection:text-black relative">
      {/* ── Fixed Mobile Floating Action Prompt ── */}
      <FloatingScanPrompt />

      {/* ── Sticky Navigation Bar ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f9fafb]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime-base)] shadow-md shadow-[var(--lime-base)]/25 transition-transform group-hover:scale-105">
              <ScanLine size={18} strokeWidth={2.5} className="text-black" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">SurePrice</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/stores"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1.5"
            >
              Browse Stores
            </Link>
            <ButtonLink href="/login" id="nav-login" size="sm">
              <Lock size={13} />
              <span>Merchant Sign In</span>
            </ButtonLink>
          </div>
        </div>
      </nav>

      {/* ── 1. Hero Section ── */}
      <HeroSection />

      {/* ── 2. Interactive Feature Tabs ── */}
      <FeatureTabs />

      {/* ── 3. Merchant Hardware & Software Suite Showcase ── */}
      <BentoShowcase />

      {/* ── 4. Deep Forest Dark Interlude Section ── */}
      <VenueAccordion />

      {/* ── 5. Kinetic 4-Step Pilot Workflow ── */}
      <WorkflowSteps />

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/80 py-12 text-center text-xs text-slate-500 bg-white">
        <div className="mx-auto max-w-5xl px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-black text-sm text-slate-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--lime-base)] text-black">
              <ScanLine size={14} strokeWidth={2.5} />
            </div>
            <span>SurePrice</span>
          </div>
          <p>© 2026 SurePrice. Scan it. Know it. · Lagos, Nigeria</p>
        </div>
      </footer>
    </div>
  )
}
