'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const TABS = [
  {
    id: 'scan',
    number: '01',
    title: 'Zero-Friction Camera Scan',
    shortBody: 'Shoppers point native iOS/Android camera at shelf tag — instant verified price display.',
    badge: 'Sub-Second Load',
    badgeTone: 'emerald',
    stat: '0.4s',
    statLabel: 'Average scan load speed',
    imageSrc: '/images/zero_webview_friction.jpg',
    imageAlt: 'Zero Friction Mobile Scan Interface showing product details in Naira',
    highlights: ['No App Store Download', 'Works on any smartphone camera', 'Verified Naira (₦) Pricing'],
  },
  {
    id: 'sync',
    number: '02',
    title: '1-Tap Cloud Price Sync',
    shortBody: 'Business owners update item prices across multiple store locations instantly from mobile.',
    badge: 'Real-Time Sync',
    badgeTone: 'blue',
    stat: '100%',
    statLabel: 'Price accuracy across shelves',
    imageSrc: '/images/instant_price_update.jpg',
    imageAlt: 'Instant Real-Time Price Update on Merchant Mobile App',
    highlights: ['Instant 1-Tap Price Updates', 'Multi-Store Network Sync', 'Eliminates Checkout Disputes'],
  },
  {
    id: 'hardware',
    number: '03',
    title: 'Durable Waterproof Hardware',
    shortBody: 'Heavy-duty acrylic shelf tags and A6 restaurant tent cards built for high-traffic Nigerian stores.',
    badge: 'Localized Hardware',
    badgeTone: 'amber',
    stat: '₦0',
    statLabel: 'Maintenance fee for tags',
    imageSrc: '/images/waterproof_qr_tags_naira.jpg',
    imageAlt: 'Durable Waterproof QR Tags displaying prices in Nigerian Naira',
    highlights: ['High-Traffic Acrylic Shelf Tags', 'A6 Restaurant Table Standees', 'Outdoor Festival Stall Passes'],
  },
]

export function FeatureTabs() {
  const [activeId, setActiveId] = useState('scan')
  const activeTab = TABS.find((t) => t.id === activeId) ?? TABS[0]

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          How SurePrice Powers Physical Stores
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Combining durable physical QR hardware tags with lightning-fast cloud price synchronization across Nigeria.
        </p>
      </div>

      {/* Grid: Left Tab Navigation + Right Visual Card */}
      <div className="grid gap-8 lg:grid-cols-12 items-center">
        {/* Left: Tab Selectors */}
        <div className="lg:col-span-5 space-y-3">
          {TABS.map((tab) => {
            const isActive = tab.id === activeId
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={`w-full text-left rounded-2xl p-5 transition-all duration-300 relative border ${
                  isActive
                    ? 'bg-white border-slate-300 shadow-xl scale-[1.01]'
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--lime-base)] rounded-l-2xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-start gap-4">
                  <span className={`text-xl font-black ${isActive ? 'text-[var(--lime-dark)]' : 'text-slate-400'}`}>
                    {tab.number}
                  </span>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {tab.title}
                      </h3>
                      <Badge tone={tab.badgeTone as 'emerald' | 'blue' | 'amber'}>{tab.badge}</Badge>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {tab.shortBody}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: Active Visual Card Showcase */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl space-y-6"
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                <Image
                  src={activeTab.imageSrc}
                  alt={activeTab.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                {/* Floating Metric Callout Pill */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white shadow-xl flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black font-black text-lg shadow-md shadow-[var(--lime-base)]/25">
                    {activeTab.stat}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">{activeTab.statLabel}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={12} /> Verified across Lagos stores
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Highlights List */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Key Capabilities
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeTab.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 text-xs font-bold text-slate-800"
                    >
                      <CheckCircle2 size={14} className="text-[var(--lime-dark)] shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
