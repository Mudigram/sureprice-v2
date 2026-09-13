import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Qarty',
  description:
    'Learn how Qarty protects your privacy. We offer zero app-download QR price tags and digital menus with privacy-first analytics in Ibadan, Nigeria.',
}

export default function PrivacyPage() {
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
                Privacy Policy
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
              <ShieldCheck size={18} className="text-emerald-600" />
              1. Our Privacy-First Commitment
            </h2>
            <p>
              Qarty is a digital menu, physical price verification, and storefront SaaS designed for
              physical businesses, pop-up stalls, dining venues, and retailers across Nigeria.
              We believe consumer physical shopping should remain private: shoppers do not need to download an
              app, create an account, or disclose personal details simply to inspect product prices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Eye size={18} className="text-blue-600" />
              2. Information We Collect
            </h2>
            <div className="space-y-3 pl-2 border-l-2 border-slate-200">
              <div>
                <p className="font-bold text-slate-900">A. For In-Store Shoppers (Consumers)</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  When you point your camera at a Qarty QR standee or shelf tag, we log strictly anonymous,
                  aggregated metrics (e.g. scan timestamp, item viewed, and button interactions such as
                  tapping &quot;Order via WhatsApp&quot;). We do not track your precise GPS coordinates, personal identity,
                  or phone number during scans.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900">B. For Store Merchants &amp; Business Owners</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  When you register a store or subscribe to Qarty, we collect your business name, contact phone
                  number, account email, physical location/stall details, and product catalog data. This data is
                  used exclusively to administer your digital storefront and provide analytics.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Lock size={18} className="text-amber-600" />
              3. Data Protection &amp; Security
            </h2>
            <p>
              All merchant and operational records are stored in secure cloud infrastructure protected by
              PostgreSQL Row-Level Security (RLS) policies. Only authenticated store staff and administrators
              can access or modify store inventories and analytics. We comply with the Nigeria Data Protection
              Act (NDPA).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900">
              4. WhatsApp &amp; Third-Party Services
            </h2>
            <p>
              When a shopper clicks &quot;Order via WhatsApp&quot; or &quot;Chat on WhatsApp&quot;, Qarty opens an external link
              directly into WhatsApp (owned by Meta). Communications inside WhatsApp take place directly
              between the shopper and merchant according to Meta&apos;s privacy practices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-900">
              5. Cookies &amp; Local Storage
            </h2>
            <p>
              We use lightweight browser <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">localStorage</code> to
              remember your in-store saved items (&quot;Noted Prices&quot;) and recent scan history on your own device. We do
              not sell your browsing history to third-party ad exchanges.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-base font-black text-slate-900">
              6. Contact Our Data Privacy Officer
            </h2>
            <p>
              If you have any questions or requests regarding your data, reach out to our team in Ibadan:
            </p>
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
