import type { Metadata } from 'next'
import Link from 'next/link'
import { ScanLine, CheckCircle2, Store, Zap, Shield, ChevronRight, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SurePrice — Know Before You Buy',
  description:
    'SurePrice lets shoppers scan any product QR code for instant, verified prices. No app to install. For businesses across Nigeria.',
}

const FEATURES = [
  {
    icon: ScanLine,
    title: 'Scan & Know',
    body: 'Customers scan a QR code on any product with their phone camera — no app install required.',
  },
  {
    icon: Zap,
    title: 'Instant Prices',
    body: 'Prices are verified and updated by the business owner in real time from any device.',
  },
  {
    icon: Shield,
    title: 'Always Accurate',
    body: 'No more price surprises at checkout. The price you scan is the price you pay.',
  },
  {
    icon: Store,
    title: 'Any Business',
    body: 'Retail stores, restaurants, cafés, pop-up vendors — SurePrice works for every physical business.',
  },
]

const STEPS = [
  { step: '01', title: 'Business signs up', body: 'Owner creates an account and adds their products with prices.' },
  { step: '02', title: 'QR codes generated', body: 'SurePrice generates a unique QR code for each product automatically.' },
  { step: '03', title: 'Codes placed on shelves', body: 'Print and stick QR codes next to products in the store.' },
  { step: '04', title: 'Customers scan & shop', body: 'Shoppers scan any code and instantly see the verified price.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lime-base)]">
              <ScanLine size={16} strokeWidth={2.5} className="text-black" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">SurePrice</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse Stores
            </Link>
            <Link
              href="/login"
              id="nav-login"
              className="rounded-xl bg-[var(--lime-base)] px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-5 pb-20 pt-20 text-center">
        <span className="inline-block rounded-full border border-[var(--lime-base)]/40 bg-[var(--lime-base)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--lime-dark)]">
          Zero App Install Required
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
          Know the price before you{' '}
          <span className="text-[var(--lime-dark)]">reach the checkout</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          SurePrice gives Nigerian shoppers instant, verified product prices by scanning a QR code.
          No app. No account. Just scan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/scan"
            id="hero-scan-cta"
            className="flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-7 py-4 text-base font-bold text-black shadow-lg shadow-[var(--lime-base)]/30 transition-all hover:scale-105 hover:opacity-90"
          >
            <ScanLine size={20} />
            Try Scanning Now
          </Link>
          <Link
            href="/login"
            id="hero-owner-cta"
            className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-7 py-4 text-base font-bold text-foreground transition-colors hover:border-[var(--lime-base)]/60"
          >
            I&apos;m a Business Owner
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          {['No app install', 'Free for shoppers', 'Real-time prices', 'Works on any phone'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--lime-dark)]" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Mock phone preview ── */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="relative mx-auto w-64 sm:w-72">
          {/* Phone frame */}
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-foreground/10 bg-card shadow-2xl shadow-black/20">
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-4">
              <div className="h-5 w-24 rounded-full bg-foreground/10" />
            </div>
            <div className="px-5 pb-6 pt-10 text-left">
              {/* Simulated scan card */}
              <div className="rounded-2xl border-2 border-[var(--lime-base)] bg-background p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--lime-base)]/15">
                    <ScanLine size={24} className="text-[var(--lime-dark)]" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Scan Item QR</p>
                    <p className="text-xs text-muted-foreground">Instant Price Check</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                <span className="rounded-full bg-[var(--lime-base)]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--lime-dark)]">✓ Verified Price</span>
                <p className="mt-2 text-base font-extrabold text-foreground">Whole Milk 1L</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">₦850<span className="ml-1 inline-block h-2 w-2 rounded-full bg-[var(--lime-base)]" /></p>
                <p className="mt-1 text-[10px] text-muted-foreground">✓ Updated 2 minutes ago</p>
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-[var(--lime-base)]/10 blur-2xl" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--lime-dark)]">Why SurePrice</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
              Shopping with full information
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lime-base)]/15">
                  <Icon size={22} className="text-[var(--lime-dark)]" />
                </div>
                <h3 className="font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--lime-dark)]">For Business Owners</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            Set up in minutes
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, body }) => (
            <div key={step} className="relative rounded-2xl border border-border bg-card p-5">
              <span className="text-3xl font-extrabold text-[var(--lime-base)]/40">{step}</span>
              <h3 className="mt-2 font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Join Nigerian businesses already using SurePrice to give customers transparent pricing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              id="footer-owner-cta"
              className="flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-7 py-4 text-base font-bold text-black shadow-lg shadow-[var(--lime-base)]/30 transition-all hover:scale-105"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/home"
              id="footer-browse-cta"
              className="flex items-center gap-2 rounded-2xl border border-border px-7 py-4 text-base font-bold text-foreground transition-colors hover:border-[var(--lime-base)]/60"
            >
              Browse Stores
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 <span className="font-semibold text-foreground">SurePrice</span> — Know Before You Buy
        </p>
      </footer>
    </div>
  )
}
