'use client'

import { motion } from 'framer-motion'
import {
  ScanStepIllustration,
  SeeStepIllustration,
  ShopConfidentlyIllustration,
  MerchantCTAIllustration,
} from '@/components/illustrations'

const STEPS = [
  {
    title: 'Controlled Pilot Access',
    body: 'Merchant accounts are pre-provisioned for pilot partners with instant sign in.',
    Illustration: ScanStepIllustration,
  },
  {
    title: 'QR Codes Generated',
    body: 'SurePrice generates unique QR codes for products, shelves, or table menus.',
    Illustration: SeeStepIllustration,
  },
  {
    title: 'Placed In Store',
    body: 'Stick QR codes on physical shelf tags, displays, or restaurant table tent cards.',
    Illustration: ShopConfidentlyIllustration,
  },
  {
    title: 'Shoppers Scan & Know',
    body: 'Customers scan any code with zero app download to view verified prices in Naira (₦).',
    Illustration: MerchantCTAIllustration,
  },
]

export function WorkflowSteps() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mb-12 text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Simple 4-Step Pilot Workflow
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
          Zero setup overhead for shoppers, 5-minute hardware placement for store managers.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ title, body, Illustration }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300"
          >
            <div>
              <Illustration className="w-full h-44 rounded-2xl mb-4" />
              <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
              <p className="text-xs leading-relaxed text-slate-600 font-medium mt-1.5">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
