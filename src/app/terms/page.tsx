import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Scale, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — Qarty',
  description:
    'Review the terms and conditions for using Qarty digital storefronts, QR menus, and merchant management in Ibadan, Nigeria.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <Image
              src="/logo/logo.png"
              alt="Qarty"
              width={36}
              height={36}
              className="rounded-xl shadow-xs"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Last updated: September 13, 2026 · Qarty Technologies (Ibadan, Oyo State, Nigeria)
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-emerald-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Qarty (the &quot;Platform&quot;), whether as a physical store merchant, pop-up vendor,
              or in-store customer browsing a digital catalog, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please discontinue using the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" />
              2. Description of Service
            </h2>
            <p>
              Qarty provides software tools enabling physical businesses to generate instant QR price tags, digital
              dining menus, and public storefronts. Shoppers access verified item information directly on mobile
              web browsers with zero app installation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-600" />
              3. Merchant Responsibilities &amp; Price Accuracy
            </h2>
            <p>
              Merchants are solely responsible for ensuring that product prices, item descriptions, availability,
              and operating hours published on Qarty are accurate and up-to-date. In V1 of Qarty, all financial
              settlements and product deliveries take place directly between the merchant and the customer (via physical
              cash, bank transfer, PoS, or direct WhatsApp arrangement). Qarty does not process consumer payments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900">
              4. Merchant Subscriptions &amp; Pilot Access
            </h2>
            <p>
              Merchants may access promotional pilot tiers or paid monthly/annual subscriptions. Subscriptions
              grant access to the merchant console, inventory management, unlimited QR code generation, and
              scan analytics. Qarty reserves the right to suspend or archive accounts engaging in fraudulent,
              deceptive, or counterfeit product pricing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900">
              5. Intellectual Property
            </h2>
            <p>
              The Qarty name, logo, software designs, and QR Studio print templates are the proprietary property of
              Qarty Technologies. Merchants retain all ownership of their uploaded logos, food photographs, and catalog
              assets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Scale size={18} className="text-purple-600" />
              6. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Federal Republic of
              Nigeria. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of
              the courts sitting in Oyo State, Nigeria.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-base font-black text-slate-900">
              7. Contact &amp; Legal Inquiries
            </h2>
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs space-y-1.5 font-medium">
              <p className="flex items-center gap-2 text-slate-800">
                <MapPin size={14} className="text-slate-400" />
                <span>Qarty Technologies, Ibadan, Oyo State, Nigeria</span>
              </p>
              <p className="flex items-center gap-2 text-slate-800">
                <Mail size={14} className="text-slate-400" />
                <span>Email: support@qarty.app</span>
              </p>
              <p className="text-slate-500 pl-5">
                WhatsApp Concierge: +234 805 082 6536
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
