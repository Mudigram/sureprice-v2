'use client'

import { Camera, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import type { StorefrontBusiness } from '@/features/storefront/types'

interface ConciergeOnboardingCardProps {
  business: StorefrontBusiness
  className?: string
}

export function ConciergeOnboardingCard({
  business,
  className = '',
}: ConciergeOnboardingCardProps) {
  const handleOpenWhatsAppConcierge = () => {
    const text = `Hello SurePrice Team, I want to set up my digital catalog for ${business.name} (Business ID: ${business.id}). Here is a photo/file of our paper menu & prices:`
    // Support Nigerian onboarding direct line / fallback
    const supportPhone = '2348000000000'
    const waUrl = `https://wa.me/${supportPhone}?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-emerald-50/80 p-5 sm:p-6 text-slate-900 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white font-black shadow-sm">
            <Camera size={22} />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300/80">
              <Sparkles size={13} className="text-emerald-700" />
              <span>Free Merchant Onboarding Concierge</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              Don&apos;t have time to type your full menu or catalog?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
              Snap a photo of your paper menu, price sheet, or shelf tags and send it on WhatsApp. Our onboarding team will set up and format your full catalog for free.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenWhatsAppConcierge}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          <MessageCircle size={16} className="text-emerald-400" />
          <span>Snap & Send Menu on WhatsApp</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
