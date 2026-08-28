'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'

const CARDS = [
  {
    title: 'Instant Price Updates in Real Time',
    badge: '1-Tap Cloud Sync',
    badgeTone: 'blue' as const,
    description:
      'Update item prices across your entire store network from any smartphone. Change a price from ₦2,500 to ₦2,200 and customer scans update instantly.',
    imageSrc: '/images/instant_price_update.jpg',
    imageAlt: 'Instant Real-Time Price Update on Merchant Mobile App',
  },
  {
    title: 'Durable Waterproof QR Tags & Standees',
    badge: 'Localized Naira (₦) Pricing',
    badgeTone: 'emerald' as const,
    description:
      'Heavy-duty acrylic shelf tags and A6 restaurant tent cards built for high-traffic supermarket shelves, dining tables, and outdoor festival stalls.',
    imageSrc: '/images/waterproof_qr_tags_naira.jpg',
    imageAlt: 'Durable Waterproof QR Tags displaying prices in Nigerian Naira',
  },
  {
    title: 'Zero Web-View Friction (No App Install)',
    badge: 'Sub-Second Camera Scan',
    badgeTone: 'purple' as const,
    description:
      'Customers point their native iOS or Android camera at any tag. Mobile storefront loads instantly in browser without app downloads.',
    imageSrc: '/images/zero_webview_friction.jpg',
    imageAlt: 'Zero Friction Mobile Scan Interface showing product details in Naira',
  },
]

export function BentoShowcase() {
  const [feature, ...rest] = CARDS

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mb-12 text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Built for Nigerian Stores, Dining & Events
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
          Durable physical QR hardware combined with lightning-fast cloud price synchronization.
        </p>
      </div>

      {/* Asymmetric bento: wide feature tile + two stacked tiles */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Wide feature card: image and body side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="group lg:col-span-3 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl flex flex-col sm:flex-row"
        >
          <div className="relative h-64 sm:h-auto sm:w-1/2 overflow-hidden bg-slate-100">
            <Image
              src={feature.imageSrc}
              alt={feature.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="sm:w-1/2 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <Badge tone={feature.badgeTone}>{feature.badge}</Badge>
              <CardTitle className="leading-snug text-slate-900">{feature.title}</CardTitle>
              <p className="text-xs leading-relaxed text-slate-600 font-medium">
                {feature.description}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
              <span>Verified Feature</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-[var(--lime-dark)]" />
            </div>
          </div>
        </motion.div>

        {/* Two stacked tiles */}
        <div className="lg:col-span-2 grid gap-6">
          {rest.map((card, i) => {
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
              >
                <Card className="group h-full p-6 shadow-sm transition-all duration-300 border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xl flex gap-5">
                  <div className="relative w-28 sm:w-36 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2.5 min-w-0">
                    <Badge tone={card.badgeTone}>{card.badge}</Badge>
                    <CardTitle className="text-sm leading-snug text-slate-900">{card.title}</CardTitle>
                    <p className="text-xs leading-relaxed text-slate-600 font-medium line-clamp-3">
                      {card.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


