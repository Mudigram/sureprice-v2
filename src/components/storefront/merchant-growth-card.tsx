'use client'

import { Store, Sparkles, ArrowRight, CheckCircle2, Mail, MessageCircle } from 'lucide-react'

export function MerchantGrowthCard() {
  const onboardingEmail = 'onboarding@sureprice.app'
  const emailSubject = encodeURIComponent('Merchant Onboarding Inquiry — Ibadan Pilot')
  const emailBody = encodeURIComponent('Hello SurePrice Team,\n\nI own a restaurant/store in Ibadan and would like to list my venue on SurePrice.\n\nBusiness Name:\nNeighborhood (Bodija, Ring Road, etc.):\nPhone Number:')
  const mailtoUrl = `mailto:${onboardingEmail}?subject=${emailSubject}&body=${emailBody}`

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 text-white shadow-xl relative">
      {/* Background glow */}
      <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-[var(--lime-base)]/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-base)]/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--lime-base)] border border-[var(--lime-base)]/30">
            <Sparkles size={11} /> For Ibadan Restaurant Owners
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">Pilot Cohort Open</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black tracking-tight text-white sm:text-lg">
            Run a restaurant, café, or grill in Ibadan?
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Digitize your dining menu with verified Naira prices and print-ready QR table standees. Get onboarded directly with our local team.
          </p>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300 pt-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[var(--lime-base)] shrink-0" /> Zero POS Lock-In
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[var(--lime-base)] shrink-0" /> Table QR Standees
          </span>
        </div>

        {/* Manual Onboarding Contact Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <a
            href={mailtoUrl}
            id="home-merchant-contact-cta"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3 px-4 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
          >
            <Mail size={15} />
            <span>Request Restaurant Onboarding</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
