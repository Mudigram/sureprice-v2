'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ScanLine,
  KeyRound,
  Store,
  Utensils,
  Coffee,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { registerMerchantOwner } from '@/features/auth/actions'

const VENUE_TYPES = [
  { id: 'retail', label: 'Supermarket / Retail', icon: Store },
  { id: 'restaurant', label: 'Restaurant / Dining', icon: Utensils },
  { id: 'cafe', label: 'Café / Bakery', icon: Coffee },
  { id: 'popup_vendor', label: 'Pop-Up / Stall', icon: Ticket },
]

function RegisterContent() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const defaultType = searchParams.get('category') || 'retail'

  const [selectedType, setSelectedType] = useState(defaultType)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const getErrorMessage = (error: string | null) => {
    if (!error) return null
    if (error === 'invalid_passcode') {
      return 'Invalid Pilot Access Code. Please verify your private invitation code.'
    }
    if (error === 'missing_fields') {
      return 'Please fill in all required fields.'
    }
    if (error === 'user_exists') {
      return 'An account with this email already exists. Please sign in.'
    }
    return decodeURIComponent(error)
  }

  const errorMessage = getErrorMessage(errorParam)

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl shadow-slate-900/10 space-y-6 relative z-10">
      {/* Header */}
      <div className="space-y-1 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1">
          <Sparkles size={13} className="text-emerald-600" /> Instant Pilot Onboarding
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Register New Store Owner
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Create your merchant organization and start generating physical QR price tags in seconds.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        action={registerMerchantOwner}
        onSubmit={() => setLoading(true)}
        className="space-y-4"
      >
        {/* Store Name */}
        <div className="space-y-1.5">
          <label htmlFor="storeName" className="text-xs font-black text-slate-800">
            Business / Store Name
          </label>
          <input
            id="storeName"
            name="storeName"
            type="text"
            required
            placeholder="e.g. Palms Supermarket (Lekki)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Venue Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800">
            Venue Category
          </label>
          <input type="hidden" name="businessType" value={selectedType} />
          <div className="grid grid-cols-2 gap-2">
            {VENUE_TYPES.map((t) => {
              const Icon = t.icon
              const isSelected = selectedType === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-emerald-700' : 'text-slate-500'} />
                  <span className="text-[11px] truncate">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Owner Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-black text-slate-800">
            Owner Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="owner@store.ng"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-black text-slate-800">
            Set Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Min. 6 characters"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Pilot Passcode Box */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label htmlFor="passcode" className="text-xs font-black text-slate-800 flex items-center gap-1">
              <KeyRound size={13} className="text-emerald-700" />
              <span>Pilot Access Code</span>
            </label>
            <span className="text-[10px] font-bold text-slate-400">Required for Pilot</span>
          </div>
          <input
            id="passcode"
            name="passcode"
            type="text"
            required
            placeholder="Input your pilot access code here"
            className="w-full rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/30 px-4 py-3 text-xs font-black tracking-wider text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors uppercase font-mono"
          />
          <p className="text-[10px] text-slate-500 font-medium">
            Input your pilot access code here. Your store owner will receive an email with this code.
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3.5 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98] mt-2 disabled:opacity-60"
        >
          {loading ? (
            <span>Setting up your store…</span>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Register &amp; Open Store Dashboard</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Footer link to sign in */}
      <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-700 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-12 text-slate-900 relative">
      {/* Brand Header */}
      <div className="mb-6 text-center space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-lg shadow-[var(--lime-base)]/20 transition-transform group-hover:scale-105">
            <ScanLine size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            <span className="text-emerald-600 dark:text-[var(--lime-dark)]">Sure</span>Price
          </span>
        </Link>
        <p className="text-xs font-semibold text-slate-500">Field Merchant Self-Onboarding</p>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-400">Loading registration…</div>}>
        <RegisterContent />
      </Suspense>
    </div>
  )
}
