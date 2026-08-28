'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

const FAQS = [
  {
    question: 'Do my customers need to download any app from Google Play or App Store?',
    answer:
      'Zero app download required. Customers simply point their iPhone or Android camera at your QR table standee or shelf tag. The live digital menu or price tag opens instantly in sub-seconds in their native mobile browser.',
  },
  {
    question: 'How do I print the QR tags and A6 table tent cards?',
    answer:
      'SurePrice includes a built-in Print Studio. You can instantly export print-ready PDFs sized for standard A4 paper, A6 table standees, or adhesive shelf stickers using any regular office printer. You can also slip them into affordable acrylic display stands.',
  },
  {
    question: 'Can I use this for a weekend pop-up stall or food festival in Ibadan?',
    answer:
      'Absolutely! Pop-up and festival vendors can create a digital catalog in under 2 minutes. Place a QR standee on your booth, let attendees browse your food combos or craft products, and allow them to share items directly to WhatsApp.',
  },
  {
    question: 'What happens if mobile network or WiFi fluctuates in my store?',
    answer:
      'SurePrice is engineered with ultra-lightweight client assets and aggressive browser caching. Even on standard 3G/4G Nigerian mobile connections, pages load in under 0.4 seconds with minimal data consumption.',
  },
  {
    question: 'Can I change my prices or mark an item sold-out in real-time?',
    answer:
      'Yes. When your kitchen runs out of a special dish or a supplier price changes, you simply open your SurePrice merchant portal on your phone, toggle the item or update the price in 1 tap, and every customer scan reflects the change immediately.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-extrabold text-slate-800">
            <HelpCircle size={14} className="text-slate-600" /> Got Questions?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Everything you need to know about setting up live digital menus and QR tags in your store.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? 'border-emerald-500/40 bg-emerald-50/30 shadow-sm'
                    : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4"
                >
                  <span className="font-black text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium border-t border-slate-200/60 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner Call to Action */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900 p-8 text-center text-white shadow-xl space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">
            Ready to upgrade your venue experience?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium leading-relaxed">
            Join physical businesses across Ibadan and Nigeria setting up interactive QR menus and digital storefronts in under 2 minutes.
          </p>
          <div className="pt-2">
            <ButtonLink href="/onboarding" size="lg" className="font-black text-xs">
              <Sparkles size={16} />
              <span>Start Free Storefront Pilot</span>
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
