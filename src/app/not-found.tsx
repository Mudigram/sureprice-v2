import Link from 'next/link'
import type { Metadata } from 'next'
import { ScanLine, Store, Home, Search, ArrowLeft } from 'lucide-react'
import { NotFoundIllustration } from '@/components/illustrations'

export const metadata: Metadata = {
  title: '404 · Page Not Found — SurePrice',
  description: 'The scanned store, item code, or page could not be found.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-5 py-12 text-slate-900 relative overflow-hidden">
      {/* Subtle ambient backdrop glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--lime-base)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl text-center relative z-10">
        {/* Animated 404 Illustration */}
        <NotFoundIllustration className="w-full h-48 rounded-2xl" />

        {/* 404 Header */}
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 border border-emerald-200">
            404 · Item / Page Not Found
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Unrecognized QR or Page
          </h1>
          <p className="text-xs leading-relaxed text-slate-500 font-medium">
            The product QR code, store link, or page you tried to access doesn&apos;t exist or may have been updated by the store owner.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/scan"
            id="not-found-scan-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3.5 text-xs font-black text-black shadow-md transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
          >
            <ScanLine size={16} />
            <span>Scan Another QR Code</span>
          </Link>

          <Link
            href="/stores"
            id="not-found-stores-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]"
          >
            <Store size={15} />
            <span>Browse Verified Stores</span>
          </Link>

          <Link
            href="/home"
            id="not-found-home-btn"
            className="flex w-full items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors pt-1"
          >
            <Home size={14} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        Powered by <span className="font-bold text-slate-900">SurePrice</span> · Zero App Install
      </div>
    </div>
  )
}

