'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Printer, Zap, Smartphone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

const CARDS = [
  {
    title: 'Durable Waterproof QR Tags & Standees',
    badge: 'Localized Naira (₦) Pricing',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description:
      'Heavy-duty acrylic shelf tags and A6 restaurant tent cards built for high-traffic supermarket shelves, dining tables, and outdoor festival stalls across Nigeria.',
    imageSrc: '/images/waterproof_qr_tags_naira.jpg',
    imageAlt: 'Durable Waterproof QR Tags displaying prices in Nigerian Naira',
    icon: Printer,
  },
  {
    title: 'Instant Price Updates in Real Time',
    badge: '1-Tap Cloud Sync',
    badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
    description:
      'Update item prices across your entire store network from any smartphone. Change a price from ₦2,500 to ₦2,200 and customer scans update instantly.',
    imageSrc: '/images/instant_price_update.jpg',
    imageAlt: 'Instant Real-Time Price Update on Merchant Mobile App',
    icon: Zap,
  },
  {
    title: 'Zero Web-View Friction (No App Install)',
    badge: 'Sub-Second Camera Scan',
    badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
    description:
      'Customers point their native iOS or Android camera at any tag. Mobile storefront loads instantly in browser without requiring app downloads.',
    imageSrc: '/images/zero_webview_friction.jpg',
    imageAlt: 'Zero Friction Mobile Scan Interface showing product details in Naira',
    icon: Smartphone,
  },
]

export function BentoShowcase() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mb-12 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-200">
          <Sparkles size={14} className="text-[var(--lime-dark)]" /> Merchant Hardware & Software Suite
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Built for Nigerian Stores, Dining & Events
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
          Durable physical QR hardware combined with lightning-fast cloud price synchronization.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
            >
              {/* Card Image Header */}
              <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200 shrink-0">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 font-medium">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-900">
                  <span>Verified Feature</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-[var(--lime-dark)]" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
