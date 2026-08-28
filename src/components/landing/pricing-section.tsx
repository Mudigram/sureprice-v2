'use client'

import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

const TIERS = [
  {
    name: 'Free Storefront Pilot',
    description: 'Perfect for testing at your restaurant, cafe, pop-up stall, or boutique in Ibadan or nationwide.',
    price: '₦0',
    frequency: '14 days free trial',
    badge: 'Zero Risk',
    popular: false,
    cta: 'Start Free 14-Day Pilot',
    ctaHref: '/onboarding',
    features: [
      '1 Physical Venue / Location',
      'Up to 50 Menu or Shelf Items',
      'Instant Mobile QR Code Scanner',
      'Print-Ready PDF Tag Templates',
      'Direct WhatsApp Menu Sharing',
      'Zero App Download for Customers',
    ],
  },
  {
    name: 'Standard Venue',
    description: 'For active restaurants, dining cafes, retail shops, and frequent event vendors.',
    price: '₦7,500',
    frequency: 'per venue / month',
    badge: 'Most Popular',
    popular: true,
    cta: 'Launch Standard Venue',
    ctaHref: '/onboarding',
    features: [
      '1 Physical Location (Unlimited Items)',
      '1-Tap Price & Availability Sync',
      'A6 Table Standees & Shelf Tag Layouts',
      'Custom Brand Colors & Category Tabs',
      'Customer Scan View Count Analytics',
      'Priority WhatsApp Support',
    ],
  },
  {
    name: 'Multi-Outlet Pro',
    description: 'For restaurant chains, multi-branch supermarkets, or retail networks across Nigeria.',
    price: '₦18,000',
    frequency: 'per month (up to 3 outlets)',
    badge: 'Best for Chains',
    popular: false,
    cta: 'Launch Multi-Outlet',
    ctaHref: '/onboarding',
    features: [
      'Up to 3 Branches (Ibadan, Lagos, etc.)',
      'Centralized Catalog & Price Manager',
      'Multi-Staff Role Permissions (Managers / Floor)',
      'Custom QR Tag Studio Export & Batch Print',
      'Location-Specific Item Availability',
      'Dedicated Account Onboarding Specialist',
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#f8fafc] border-t border-slate-200/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-800">
            <Zap size={14} className="text-emerald-600" /> Transparent Pricing
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Simple Plans for Every Physical Business
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            No expensive POS integration. No mandatory hardware lock-in. Print on your own paper or use acrylic standees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 relative ${
                tier.popular
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 ring-2 ring-[var(--lime-base)]'
                  : 'bg-white text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    tier.popular
                      ? 'bg-[var(--lime-base)] text-black'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tier.badge}
                </span>

                {tier.popular && (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-[var(--lime-base)]">
                    <Sparkles size={13} /> Recommended
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-black">{tier.name}</h3>
                <p
                  className={`text-xs font-medium leading-relaxed ${
                    tier.popular ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="my-6 border-y py-4 border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black">{tier.price}</span>
                  <span
                    className={`text-xs font-semibold ${
                      tier.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    / {tier.frequency}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-xs font-medium">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                        tier.popular
                          ? 'bg-[var(--lime-base)] text-black'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className={tier.popular ? 'text-slate-200' : 'text-slate-700'}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <ButtonLink
                href={tier.ctaHref}
                variant={tier.popular ? 'primary' : 'outline'}
                size="md"
                className="w-full text-xs font-black"
              >
                <span>{tier.cta}</span>
              </ButtonLink>
            </div>
          ))}
        </div>

        {/* Risk Reversal Callout Footer */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center text-xs text-emerald-950 font-semibold flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
          <span>
            <strong>100% Risk-Free Guarantee:</strong> Start your 14-day free pilot with zero credit card. Cancel anytime with 1 tap.
          </span>
        </div>
      </div>
    </section>
  )
}
