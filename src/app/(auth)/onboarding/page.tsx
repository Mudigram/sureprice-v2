'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ScanLine,
  Zap,
  Store,
  Utensils,
  Coffee,
  Ticket,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Printer,
  Sparkles,
  Smartphone,
  Check,
  QrCode,
  ClipboardList,
} from 'lucide-react'

type OnboardingRole = 'merchant' | 'shopper'
type VenueType = 'retail' | 'restaurant' | 'cafe' | 'popup_vendor'

const VENUE_OPTIONS: {
  id: VenueType
  title: string
  subtitle: string
  icon: typeof Store
  badge: string
  sampleItem: string
  samplePrice: number
  updatedPrice: number
  printTemplate: string
}[] = [
  {
    id: 'restaurant',
    title: 'Restaurant & Dining Lounge',
    subtitle: 'Table A6 tent cards, digital menus, food & drink prices',
    icon: Utensils,
    badge: 'A6 Table Tent Card',
    sampleItem: 'Grilled Tilapia & Jollof Rice',
    samplePrice: 6500,
    updatedPrice: 5800,
    printTemplate: 'A6 Table Standee (105mm x 148mm)',
  },
  {
    id: 'cafe',
    title: 'Café & Bakery',
    subtitle: 'Counter standees, coffee, fresh pastries & breakfast combos',
    icon: Coffee,
    badge: 'Counter Display Standee',
    sampleItem: 'Iced Vanilla Latte & Croissant',
    samplePrice: 3800,
    updatedPrice: 3200,
    printTemplate: 'Counter Acrylic Tag (1.5" x 1.5")',
  },
  {
    id: 'popup_vendor',
    title: 'Pop-Up & Festival Stall',
    subtitle: 'Weekend event passes, WhatsApp menu catalogs, quick setup',
    icon: Ticket,
    badge: 'Fast-Pass Event Tag',
    sampleItem: 'Smokey Suya Special Combo',
    samplePrice: 4500,
    updatedPrice: 4000,
    printTemplate: 'Batch A4 Sheet (12 Tags / Sheet)',
  },
  {
    id: 'retail',
    title: 'Supermarket & Retail Boutique',
    subtitle: 'Shelf tags, barcode items, aisle price verification',
    icon: Store,
    badge: 'Shelf Tag 3.5"x2"',
    sampleItem: 'Whole Wheat Bread 800g',
    samplePrice: 2500,
    updatedPrice: 2200,
    printTemplate: 'Acrylic Shelf Tag (3.5" x 2")',
  },
]

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') as OnboardingRole | null

  const [role, setRole] = useState<OnboardingRole>(roleParam === 'shopper' ? 'shopper' : 'merchant')
  const [step, setStep] = useState<number>(1)
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('restaurant')
  const [merchantName, setMerchantName] = useState<string>('')

  // Interactive Activation Test States
  const [priceUpdated, setPriceUpdated] = useState<boolean>(false)
  const [shopperScanned, setShopperScanned] = useState<boolean>(false)

  const activeVenue = VENUE_OPTIONS.find((v) => v.id === selectedVenue) || VENUE_OPTIONS[0]

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = () => {
    const onboardingData = {
      storeName: merchantName.trim() || activeVenue.title,
      venueType: selectedVenue,
      format: activeVenue.badge,
      timestamp: Date.now(),
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sureprice_onboarding_data', JSON.stringify(onboardingData))
      } catch {
        // Fallback if quota exceeded
      }
    }

    const queryParams = new URLSearchParams()
    if (onboardingData.storeName) queryParams.set('name', onboardingData.storeName)
    if (onboardingData.venueType) queryParams.set('category', onboardingData.venueType)

    if (role === 'merchant') {
      if (selectedVenue === 'popup_vendor') {
        queryParams.set('mode', 'popup')
      }
      // Direct handoff to login / signup with pre-filled state
      router.push(`/login?${queryParams.toString()}`)
    } else {
      router.push('/scan')
    }
  }

  const getProgressPercentage = () => {
    if (step === 1) return '25%'
    if (step === 2) return '65%'
    return '100%'
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Role Switcher Header with ARIA Tab semantics */}
      <div
        role="tablist"
        aria-label="Onboarding Role Switcher"
        className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/90 shadow-sm"
      >
        <button
          type="button"
          role="tab"
          aria-selected={role === 'merchant'}
          id="onboarding-role-merchant"
          onClick={() => {
            setRole('merchant')
            setStep(1)
          }}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all ${
            role === 'merchant'
              ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store size={15} />
          <span>Business Owner / Venue</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={role === 'shopper'}
          id="onboarding-role-shopper"
          onClick={() => {
            setRole('shopper')
            setStep(1)
          }}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all ${
            role === 'shopper'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone size={15} />
          <span>Shopper / Customer</span>
        </button>
      </div>

      {/* Main Wizard Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl shadow-slate-900/10 space-y-6 relative">
        {/* Step Indicator Header with Endowed Progress */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lime-base)] text-xs font-black text-black">
              {step}
            </span>
            <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
              Step {step} of 3 · <span className="text-emerald-700">{getProgressPercentage()} Ready</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-[var(--lime-base)]' : 'bg-slate-200'}`} />
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-[var(--lime-base)]' : 'bg-slate-200'}`} />
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-[var(--lime-base)]' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* ── MERCHANT / VENDOR FLOW ── */}
        {role === 'merchant' && (
          <>
            {/* STEP 1: Personalization Question (Physical Venue Category) */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-2">
                    <Sparkles size={13} className="text-emerald-600" /> Free 14-Day Pilot Setup
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    What type of physical venue do you operate?
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                    SurePrice customizes your live digital storefront, QR tent cards, and mobile catalog tools for your venue.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {VENUE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = selectedVenue === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedVenue(opt.id)}
                        className={`flex flex-col justify-between p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-[var(--lime-base)] text-black' : 'bg-slate-200 text-slate-700'
                          }`}>
                            <Icon size={18} />
                          </div>
                          {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                        </div>
                        <div className="mt-3 space-y-0.5">
                          <p className="text-xs font-black text-slate-900">{opt.title}</p>
                          <p className="text-xs text-slate-600 leading-snug font-medium">{opt.subtitle}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Business Name Field */}
                <div className="space-y-1.5 pt-2">
                  <label htmlFor="onboarding-store-name-input" className="text-xs font-black text-slate-800">
                    Your Business / Store Name
                  </label>
                  <input
                    id="onboarding-store-name-input"
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder={activeVenue.id === 'popup_vendor' ? 'e.g. Suya & Grill Pop-up (Bodija)' : 'e.g. The Palms Bistro (Ring Road)'}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
                >
                  <span>Experience 1-Tap Live Updates</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: Define & Experience Activation Moment */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-2">
                    <Zap size={13} className="text-emerald-600" /> The Activation Moment
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Update your live catalog in 1 tap from your phone
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                    Test updating a menu price or item below. Watch how customer scans on your tables update in sub-seconds.
                  </p>
                </div>

                {/* Interactive Price Sync Playground */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 text-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        {merchantName || activeVenue.title}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">{activeVenue.sampleItem}</p>
                    </div>
                    <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-xs font-extrabold text-[var(--lime-base)] border border-slate-800">
                      Live Cloud Sync
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400">Current Display Price</p>
                      <p className="text-2xl font-black text-white">
                        ₦{(priceUpdated ? activeVenue.updatedPrice : activeVenue.samplePrice).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPriceUpdated((prev) => !prev)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all active:scale-95 ${
                        priceUpdated
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                          : 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/25'
                      }`}
                    >
                      <Zap size={14} />
                      <span>{priceUpdated ? 'Reset Price' : 'Simulate 1-Tap Price Update'}</span>
                    </button>
                  </div>

                  {priceUpdated && (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-3.5 border border-[var(--lime-base)]/40 text-xs text-white">
                      <CheckCircle2 size={16} className="shrink-0 text-[var(--lime-base)]" />
                      <span>
                        <strong>Instant Sync Success!</strong> Customer table scans across {merchantName || 'your store'} updated from ₦{activeVenue.samplePrice.toLocaleString()} to ₦{activeVenue.updatedPrice.toLocaleString()} in 0.2s.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
                  >
                    <span>View Ready-to-Print Hardware Tags</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Meaningful Result & Generated Hardware Tags */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-200 mb-2">
                    <Printer size={13} className="text-slate-700" /> Generated Print Studio Result
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Your physical QR tags are ready to print
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                    Here is the personalized physical hardware template created for <strong>{merchantName || activeVenue.title}</strong>.
                  </p>
                </div>

                {/* Generated Physical Hardware Tag Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-black text-emerald-700">
                      {activeVenue.printTemplate}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                      Print Ready PDF
                    </span>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-900 p-2 text-white">
                      <QrCode size={40} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-900">
                        {merchantName || 'Your Physical Store'}
                      </p>
                      <p className="text-xs font-black text-emerald-600 mt-0.5">
                        ₦{(priceUpdated ? activeVenue.updatedPrice : activeVenue.samplePrice).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Scan with phone camera · Zero app install
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
                  >
                    <Sparkles size={16} />
                    <span>Save Storefront & Start Free Pilot</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── SHOPPER FLOW ── */}
        {role === 'shopper' && (
          <>
            {/* STEP 1: Personalization Question (Shopping Venue Preference) */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Where do you shop or dine most?
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                    SurePrice lets you scan physical QR code tags for instant verified prices in Nigerian Naira (₦).
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {VENUE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = selectedVenue === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedVenue(opt.id)}
                        className={`flex flex-col justify-between p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-[var(--lime-base)] text-black' : 'bg-slate-200 text-slate-700'
                          }`}>
                            <Icon size={18} />
                          </div>
                          {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                        </div>
                        <div className="mt-3 space-y-0.5">
                          <p className="text-xs font-black text-slate-900">{opt.title}</p>
                          <p className="text-xs text-slate-600 leading-snug font-medium">{opt.subtitle}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
                >
                  <span>Test 1-Second Camera Scan</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: Define & Experience Activation Moment for Shopper */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-2">
                    <ScanLine size={13} className="text-emerald-600" /> The Activation Moment
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Scan any tag for an instant price check
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                    Test scanning the interactive shelf tag below to resolve verified Naira prices in sub-seconds.
                  </p>
                </div>

                {/* Interactive Shopper Scan Viewfinder Simulator */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-center">
                  <div className="relative mx-auto w-48 h-48 rounded-2xl border-2 border-dashed border-emerald-500 bg-slate-900 flex flex-col items-center justify-center p-4 shadow-inner overflow-hidden">
                    {/* Laser Scanner animation */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--lime-base)] shadow-[0_0_12px_#13ec5b] animate-scan-laser" />

                    <QrCode size={48} className="text-slate-400 mb-2" />
                    <p className="text-xs font-extrabold text-white">Demo {activeVenue.badge}</p>
                    <p className="text-xs text-slate-400 font-medium">Point camera to test</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShopperScanned(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--lime-base)] py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 active:scale-95"
                  >
                    <ScanLine size={16} />
                    <span>{shopperScanned ? '✓ Price Tag Resolved!' : 'Simulate Scanning Tag'}</span>
                  </button>

                  {shopperScanned && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left space-y-2">
                      <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-black uppercase text-white shadow-sm">
                        ✓ Verified Price
                      </span>
                      <p className="text-sm font-black text-slate-900">{activeVenue.sampleItem}</p>
                      <p className="text-xl font-black text-emerald-700">
                        ₦{activeVenue.samplePrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-600">✓ Verified live in store · Zero app install</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
                  >
                    <span>View Shopping List Result</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Meaningful Result for Shopper (Personal In-Store Price List) */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-200 mb-2">
                    <ClipboardList size={13} className="text-slate-700" /> Personalized In-Store Checklist
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Your In-Store Price List is Ready
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                    Note items as you scan in store, check them off as you pick them up from physical shelves, and export clean lists for WhatsApp sharing.
                  </p>
                </div>

                {/* Generated Shopper Price List Sample */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <p className="text-xs font-black text-slate-900">In-Store Reference List</p>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 border border-slate-200">
                      1 Item Added
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--lime-base)] text-black">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{activeVenue.sampleItem}</p>
                        <p className="text-xs text-slate-500 font-medium">Physical Store Shelf Tag</p>
                      </div>
                    </div>

                    <p className="text-xs font-black text-emerald-700">
                      ₦{activeVenue.samplePrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
                  >
                    <ScanLine size={16} />
                    <span>Start Scanning In-Store</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="text-center text-xs text-slate-500 font-medium">
        Already have pilot credentials?{' '}
        <Link href="/login" className="text-emerald-700 font-extrabold hover:underline">
          Sign in to Merchant Portal
        </Link>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-12 text-slate-900 relative">
      {/* Brand Header */}
      <div className="mb-8 text-center space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-lg shadow-[var(--lime-base)]/20 transition-transform group-hover:scale-105">
            <ScanLine size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            <span className="text-emerald-600 dark:text-[var(--lime-dark)]">Sure</span>Price
          </span>
        </Link>
        <p className="text-xs font-semibold text-slate-500">Interactive Setup & Demo Portal</p>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-400">Loading onboarding experience…</div>}>
        <OnboardingContent />
      </Suspense>
    </div>
  )
}

