import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, MessageCircle, ArrowRight, Store, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Thank You — Qarty',
  description: 'Thank you for reaching out to Qarty. Our Ibadan onboarding concierge is reviewing your request.',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center">
        {/* Brand Icon */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image
              src="/logo/logo.png"
              alt="Qarty"
              width={40}
              height={40}
              className="rounded-xl shadow-xs transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-black tracking-tight text-slate-900">Qarty</span>
          </Link>
        </div>

        {/* Success Visual */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-sm">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            You&apos;re All Set!
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Thank you for connecting with Qarty. Our field merchant onboarding team in Ibadan, Oyo State
            will follow up with you shortly.
          </p>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
            <span>What happens next?</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside font-medium">
            <li>Our concierge will verify your stall or venue location.</li>
            <li>You will receive your pilot access code on WhatsApp.</li>
            <li>We prepare your printed acrylic table standees.</li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <a
            href="https://wa.me/2348050826536?text=Hello%20Qarty%20Team%2C%20I%20just%20submitted%20my%20request%20and%20want%20to%20connect%20with%20an%20onboarding%20specialist."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-500 py-3 text-xs font-black text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 active:scale-98 transition-all"
          >
            <MessageCircle size={15} />
            <span>Chat with Ibadan Concierge</span>
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <span>Return to Homepage</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
