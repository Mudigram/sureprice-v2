'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, Utensils, Ticket, ShoppingBag, ChevronDown, ScanLine } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

const VENUES = [
  {
    id: 'dining',
    icon: Utensils,
    title: 'Restaurants & Dining Cafés',
    description:
      'A6 table tent cards & QR stickers. Customers scan from dining tables in Bodija, Ring Road, or Victoria Island to view full digital menus with dish photos, dietary badges, and live prices without downloading an app.',
    tag: 'Dining Suite',
    metric: 'Zero App Download',
  },
  {
    id: 'popups',
    icon: Ticket,
    title: 'Pop-Up Vendors & Festival Stalls',
    description:
      'Instant digital catalogs for weekend pop-up markets, food festivals, and exhibition booths across Ibadan, Lagos, and Abuja. Customers scan your booth standee and share items straight to WhatsApp.',
    tag: 'Event Pass',
    metric: '2-Min Setup',
  },
  {
    id: 'retail',
    icon: Store,
    title: 'Supermarkets & Grocery Retail',
    description:
      'Durable acrylic shelf-edge tags displaying real-time prices in Naira (₦). Eliminates shelf-to-register price mismatches and speeds up customer shelf checkout.',
    tag: 'Retail Suite',
    metric: '99.8% Accuracy',
  },
  {
    id: 'boutique',
    icon: ShoppingBag,
    title: 'Boutique Fashion & Lifestyle',
    description:
      'Elegant clothing tag stickers & glass counter standees. Show full size availability, color options, and verified Naira prices in 1 camera tap.',
    tag: 'Fashion Suite',
    metric: 'Instant View',
  },
]

export function VenueAccordion() {
  const [activeId, setActiveId] = useState('dining')

  return (
    <section className="bg-[#031d14] text-white py-20 sm:py-28 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--lime-base)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-[var(--lime-base)]">
            <ScanLine size={14} /> Built for Every Physical Venue
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Tailored For Physical Venues Across Nigeria
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Whether running a bustling restaurant in Ibadan, a weekend food festival booth, or a 500-item supermarket, SurePrice adapts to your physical workflow in minutes.
          </p>
        </div>

        {/* Grid: Left Visual Card + Right Accordion */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Left: Glowing Glass Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-950/80 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Card Badge */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[var(--lime-base)]/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[var(--lime-base)] border border-[var(--lime-base)]/30">
                  {VENUES.find((v) => v.id === activeId)?.tag}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {VENUES.find((v) => v.id === activeId)?.metric}
                </span>
              </div>

              {/* Price Tag Graphic */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Product Tag #SP-9482</span>
                  <span className="text-[var(--lime-base)]">✓ Verified</span>
                </div>

                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-black text-white">
                    {activeId === 'retail' && 'Whole Wheat Bread 800g'}
                    {activeId === 'dining' && 'Jollof Rice & Grilled Tilapia'}
                    {activeId === 'popups' && 'Smokey Suya Special Combo'}
                    {activeId === 'boutique' && 'Vintage Oversized Blazer'}
                  </p>
                  <p className="text-3xl font-black text-[var(--lime-base)]">
                    {activeId === 'retail' && '₦2,500'}
                    {activeId === 'dining' && '₦6,500'}
                    {activeId === 'popups' && '₦4,500'}
                    {activeId === 'boutique' && '₦25,000'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Updated via Merchant App</span>
                  <span className="font-mono text-emerald-400">0.4s camera load</span>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <ButtonLink href="/onboarding" id="venue-section-cta" size="md" className="w-full">
                <span>Start Free Storefront Pilot</span>
              </ButtonLink>
            </div>
          </div>

          {/* Right: Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
            {VENUES.map((venue) => {
              const isOpen = venue.id === activeId
              const Icon = venue.icon

              return (
                <div
                  key={venue.id}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-emerald-500/50 bg-emerald-950/40 shadow-lg'
                      : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(isOpen ? '' : venue.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isOpen
                            ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/20'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        <Icon size={18} strokeWidth={2.5} />
                      </div>

                      <span className="font-black text-base sm:text-lg text-white">
                        {venue.title}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[var(--lime-base)]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-300 font-medium border-t border-emerald-500/20 mt-1">
                          {venue.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
