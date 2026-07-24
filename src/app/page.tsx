import type { Metadata } from 'next'
import Link from 'next/link'
import { ScanLine, CheckCircle2, Store, Zap, Shield, ChevronRight, ArrowRight, Ticket, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SurePrice — Know Before You Buy',
  description:
    'SurePrice lets shoppers scan any product QR code for instant, verified prices. No app to install. For physical businesses, restaurants, and event pop-ups across Nigeria.',
}

const FEATURES = [
  {
    icon: ScanLine,
    title: 'Scan & Know',
    body: 'Customers scan a QR code on any product or menu with their phone camera — no app install required.',
  },
  {
    icon: Zap,
    title: 'Instant Verified Prices',
    body: 'Prices are verified and updated by the business owner in real time from any device.',
  },
  {
    icon: Shield,
    title: 'Always Accurate',
    body: 'No more price surprises at checkout or dining tables. What you scan is what you pay.',
  },
  {
    icon: Store,
    title: 'Any Physical Business',
    body: 'Supermarkets, restaurants, cafés, and temporary pop-up vendors — SurePrice fits every venue.',
  },
]

const STEPS = [
  { step: '01', title: 'Controlled Pilot Access', body: 'Merchant accounts are pre-provisioned for pilot partners with instant sign in.' },
  { step: '02', title: 'QR Codes Generated', body: 'SurePrice generates unique QR codes for products, shelves, or table menus.' },
  { step: '03', title: 'Placed In Store', body: 'Stick QR codes on physical shelf tags, displays, or restaurant tables.' },
  { step: '04', title: 'Shoppers Scan & Know', body: 'Customers scan any code with zero app download to view verified prices.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Top Bar ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime-base)] shadow-md shadow-[var(--lime-base)]/20">
              <ScanLine size={18} strokeWidth={2.5} className="text-black" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">SurePrice</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/stores"
              className="text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Browse Stores
            </Link>
            <Link
              href="/login"
              id="nav-login"
              className="flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-4 py-2 text-xs font-black text-black transition-all hover:bg-[var(--lime-dark)] active:scale-95"
            >
              <Lock size={13} />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/50 px-4 py-1.5 text-xs font-bold text-blue-300">
          <span className="h-2 w-2 rounded-full bg-[var(--lime-base)] animate-pulse" />
          <span>Controlled Pilot Launch · Lagos, Nigeria</span>
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
          Know the exact price before you{' '}
          <span className="text-[var(--lime-base)]">reach checkout</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400">
          Digital price tag & menu layer over physical retail, dining, and event pop-ups. Zero app download required.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/scan"
            id="hero-scan-cta"
            className="flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-7 py-4 text-sm font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
          >
            <ScanLine size={18} />
            <span>Try Scanning Now</span>
          </Link>

          <Link
            href="/login"
            id="hero-owner-cta"
            className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-7 py-4 text-sm font-bold text-white transition-all hover:border-slate-700 active:scale-95"
          >
            <span>I&apos;m a Business Owner</span>
            <ChevronRight size={16} />
          </Link>

          <Link
            href="/login?mode=popup"
            id="hero-popup-cta"
            className="flex items-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-950/40 px-6 py-4 text-sm font-bold text-purple-200 transition-all hover:border-purple-500 active:scale-95"
          >
            <Ticket size={16} className="text-purple-400" />
            <span>Pop-Up Event Vendor Pass</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-400">
          {['Zero App Install', 'Free for Shoppers', 'Real-Time In-Store Prices', 'Pilot Partner Access'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--lime-base)]" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Mock Phone Preview ── */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="relative mx-auto w-64 sm:w-72">
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-slate-800 bg-slate-900 shadow-2xl shadow-black/80">
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-4">
              <div className="h-5 w-24 rounded-full bg-slate-800" />
            </div>
            <div className="px-5 pb-6 pt-10 text-left">
              <div className="rounded-2xl border border-[var(--lime-base)] bg-slate-950 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lime-base)]/20 text-[var(--lime-base)]">
                    <ScanLine size={22} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">Scan Shelf QR</p>
                    <p className="text-[10px] text-slate-400">Instant Price Check</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="rounded-full bg-[var(--lime-base)]/20 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[var(--lime-base)]">
                  ✓ Verified Price
                </span>
                <p className="mt-2 text-sm font-black text-white">Whole Wheat Bread 800g</p>
                <p className="mt-1 text-2xl font-black text-white">
                  ₦1,250<span className="ml-1 inline-block h-2 w-2 rounded-full bg-[var(--lime-base)]" />
                </p>
                <p className="mt-1 text-[10px] font-medium text-slate-400">✓ Updated today at Spar VI</p>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-[var(--lime-base)]/10 blur-2xl" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-y border-slate-900 bg-slate-900/50 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-12 text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--lime-base)]">
              Core Platform
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Full Information Shopping & Dining
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)]/15 text-[var(--lime-base)]">
                  <Icon size={20} />
                </div>
                <h3 className="font-extrabold text-sm text-white">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="mb-12 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--lime-base)]">
            How Pilot Partners Work
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Simple 4-Step Pilot Workflow
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, body }) => (
            <div key={step} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
              <span className="text-2xl font-black text-[var(--lime-base)]">{step}</span>
              <h3 className="font-extrabold text-sm text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        © 2026 <span className="font-extrabold text-white">SurePrice</span> — Know Before You Buy
      </footer>
    </div>
  )
}
