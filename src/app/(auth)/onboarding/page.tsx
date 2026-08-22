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
    id: 'retail',
    title: 'Supermarket & Retail Store',
    subtitle: 'Shelf tags, barcode items, aisle price verification',
    icon: Store,
    badge: 'Shelf Tag 3.5"x2"',
    sampleItem: 'Whole Wheat Bread 800g',
    samplePrice: 2500,
    updatedPrice: 2200,
    printTemplate: 'Acrylic Shelf Tag (3.5" x 2")',
  },
  {
    id: 'restaurant',
    title: 'Restaurant & Dining',
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
    subtitle: 'Counter standees, coffee, fresh pastries & breakfast',
    icon: Coffee,
    badge: 'Counter Display Tag',
    sampleItem: 'Iced Vanilla Latte & Croissant',
    samplePrice: 3800,
    updatedPrice: 3200,
    printTemplate: 'Counter Sticker Tag (1.5" x 1.5")',
  },
  {
    id: 'popup_vendor',
    title: 'Pop-Up & Festival Stall',
    subtitle: 'Temporary event passes, fast-pass QR, instant timers',
    icon: Ticket,
    badge: 'Fast-Pass Event Tag',
    sampleItem: 'Smokey Suya Special Combo',
    samplePrice: 4500,
    updatedPrice: 4000,
    printTemplate: 'Batch A4 Sheet (12 Tags / Sheet)',
  },
]

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') as OnboardingRole | null

  const [role, setRole] = useState<OnboardingRole>(roleParam === 'shopper' ? 'shopper' : 'merchant')
  const [step, setStep] = useState<number>(1)
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('retail')
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
      router.push(`/login?${queryParams.toString()}`)
    } else {
      router.push('/scan')
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Role Switcher Header with ARIA Tab semantics */}
      <div
        role="tablist"
        aria-label="Onboarding Role Switcher"
        className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-950 p-1.5 border border-slate-800 shadow-xl"
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
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store size={15} />
          <span>Business Owner & Vendor</span>
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
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone size={15} />
          <span>Shopper / Customer</span>
        </button>
      </div>

      {/* Main Wizard Card */}
      <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 shadow-2xl shadow-black/70 space-y-6 relative">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lime-base)] text-xs font-black text-black">
              {step}
            </span>
            <span className="text-xs font-black text-white tracking-wider uppercase">
              Step {step} of 3
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-[var(--lime-base)]' : 'bg-slate-800'}`} />
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-[var(--lime-base)]' : 'bg-slate-800'}`} />
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-[var(--lime-base)]' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* ── MERCHANT / VENDOR FLOW ── */}
        {role === 'merchant' && (
          <>
            {/* STEP 1: Personalization Question (Physical Venue Category) */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    What type of physical venue do you run?
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                    SurePrice customizes your store setup, QR tag formats, and price management tools for your venue.
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
                            ? 'border-[var(--lime-base)] bg-slate-950 shadow-md shadow-[var(--lime-base)]/10'
                            : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-[var(--lime-base)] text-black' : 'bg-slate-800 text-slate-300'
                          }`}>
                            <Icon size={18} />
                          </div>
                          {isSelected && <CheckCircle2 size={16} className="text-[var(--lime-base)]" />}
                        </div>
                        <div className="mt-3 space-y-0.5">
                          <p className="text-xs font-black text-white">{opt.title}</p>
                          <p className="text-xs text-slate-400 leading-snug font-medium">{opt.subtitle}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Business Name Field */}
                <div className="space-y-1.5 pt-2">
                  <label htmlFor="onboarding-store-name-input" className="text-xs font-extrabold text-slate-300">
                    Your Business / Store Name
                  </label>
                  <input
                    id="onboarding-store-name-input"
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder={activeVenue.id === 'popup_vendor' ? 'e.g. Suya & Grill Pop-up' : 'e.g. Spar Supermarket VI'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-xs font-semibold text-white placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
                >
                  <span>Experience 1-Tap Activation</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: Define & Experience Activation Moment */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lime-base)]/10 px-3 py-1 text-xs font-extrabold text-[var(--lime-base)] border border-[var(--lime-base)]/20 mb-2">
                    <Zap size={13} /> The Activation Moment
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Update a price in 1 tap from your phone
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                    Test changing a price below. Watch how shopper scans in your store update in sub-seconds.
                  </p>
                </div>

                {/* Interactive Price Sync Playground */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        {merchantName || activeVenue.title}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">{activeVenue.sampleItem}</p>
                    </div>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-extrabold text-[var(--lime-base)] border border-slate-800">
                      Live Cloud Sync
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400">Current Shelf Price</p>
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
                    <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-3.5 border border-[var(--lime-base)]/40 text-xs text-white">
                      <CheckCircle2 size={16} className="shrink-0 text-[var(--lime-base)]" />
                      <span>
                        <strong>Instant Sync Success!</strong> Customer scans across {merchantName || 'your store'} updated from ₦{activeVenue.samplePrice.toLocaleString()} to ₦{activeVenue.updatedPrice.toLocaleString()} in 0.2s.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
                  >
                    <span>View Generated Hardware Tags</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Meaningful Result & Generated Hardware Tags */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-xs font-extrabold text-[var(--lime-base)] border border-slate-800 mb-2">
                    <Printer size={13} /> Generated Print Studio Result
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Your physical QR tags are ready to print
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                    Here is the personalized physical hardware template created for <strong>{merchantName || activeVenue.title}</strong>.
                  </p>
                </div>

                {/* Generated Physical Hardware Tag Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs font-black text-[var(--lime-base)]">
                      {activeVenue.printTemplate}
                    </span>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-slate-300 border border-slate-800">
                      Print Ready PDF
                    </span>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                      <QrCode size={40} className="text-slate-900" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {merchantName || 'Your Physical Store'}
                      </p>
                      <p className="text-xs font-bold text-[var(--lime-base)] mt-0.5">
                        ₦{(priceUpdated ? activeVenue.updatedPrice : activeVenue.samplePrice).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        Scan with phone camera · Zero app install
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
                  >
                    <span>Launch Merchant Dashboard</span>
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
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Where do you shop or dine most?
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
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
                            ? 'border-[var(--lime-base)] bg-slate-950 shadow-md shadow-[var(--lime-base)]/10'
                            : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-[var(--lime-base)] text-black' : 'bg-slate-800 text-slate-300'
                          }`}>
                            <Icon size={18} />
                          </div>
                          {isSelected && <CheckCircle2 size={16} className="text-[var(--lime-base)]" />}
                        </div>
                        <div className="mt-3 space-y-0.5">
                          <p className="text-xs font-black text-white">{opt.title}</p>
                          <p className="text-xs text-slate-400 leading-snug font-medium">{opt.subtitle}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
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
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lime-base)]/10 px-3 py-1 text-xs font-extrabold text-[var(--lime-base)] border border-[var(--lime-base)]/20 mb-2">
                    <ScanLine size={13} /> The Activation Moment
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Scan any tag for an instant price check
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                    Test scanning the interactive shelf tag below to resolve verified Naira prices in sub-seconds.
                  </p>
                </div>

                {/* Interactive Shopper Scan Viewfinder Simulator */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 text-center">
                  <div className="relative mx-auto w-48 h-48 rounded-2xl border-2 border-dashed border-[var(--lime-base)]/60 bg-black flex flex-col items-center justify-center p-4 shadow-inner overflow-hidden">
                    {/* Laser Scanner animation */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--lime-base)] shadow-[0_0_12px_#13ec5b] animate-scan-laser" />

                    <QrCode size={48} className="text-slate-600 mb-2" />
                    <p className="text-xs font-extrabold text-slate-300">Demo {activeVenue.badge}</p>
                    <p className="text-xs text-slate-500 font-medium">Point camera to test</p>
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
                    <div className="rounded-xl border border-[var(--lime-base)]/30 bg-slate-900 p-4 text-left space-y-2">
                      <span className="rounded-full bg-[var(--lime-base)]/20 px-2.5 py-0.5 text-xs font-extrabold uppercase text-[var(--lime-base)] border border-[var(--lime-base)]/30">
                        ✓ Verified Price
                      </span>
                      <p className="text-sm font-black text-white">{activeVenue.sampleItem}</p>
                      <p className="text-xl font-black text-[var(--lime-base)]">
                        ₦{activeVenue.samplePrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-300">✓ Updated today in Lagos · Zero app install</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
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
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-xs font-extrabold text-[var(--lime-base)] border border-slate-800 mb-2">
                    <ClipboardList size={13} /> Personalized In-Store Checklist
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Your In-Store Price List is Ready
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                    Note items as you scan in store, check them off as you pick them up from physical shelves, and export clean lists for WhatsApp sharing.
                  </p>
                </div>

                {/* Generated Shopper Price List Sample */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <p className="text-xs font-black text-white">In-Store Reference List</p>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-extrabold text-[var(--lime-base)] border border-slate-800">
                      1 Item Added
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--lime-base)] text-black">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white">{activeVenue.sampleItem}</p>
                        <p className="text-xs text-slate-400 font-medium">Physical Store Shelf Tag</p>
                      </div>
                    </div>

                    <p className="text-xs font-black text-[var(--lime-base)]">
                      ₦{activeVenue.samplePrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95"
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
      <div className="text-center text-xs text-slate-500">
        Already have pilot credentials?{' '}
        <Link href="/login" className="text-[var(--lime-base)] font-extrabold hover:underline">
          Sign in to Merchant Portal
        </Link>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#020617] px-4 py-12 text-slate-100 relative">
      {/* Brand Header */}
      <div className="mb-8 text-center space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-lg shadow-[var(--lime-base)]/20 transition-transform group-hover:scale-105">
            <ScanLine size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">SurePrice</span>
        </Link>
        <p className="text-xs font-medium text-slate-400">Interactive Setup & Demo Portal</p>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-400">Loading onboarding experience…</div>}>
        <OnboardingContent />
      </Suspense>
    </div>
  )
}
