'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ScanLine,
  Lock,
  Ticket,
  ArrowRight,
  CheckCircle2,
  Info,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { login } from '@/features/auth/actions'

function LoginContent() {
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode')
  const errorParam = searchParams.get('error')
  const nameParam = searchParams.get('name')

  const [activeTab, setActiveTab] = useState<'signin' | 'popup'>(
    modeParam === 'popup' ? 'popup' : 'signin'
  )
  const [popupSubmitted, setPopupSubmitted] = useState(false)
  const [popupForm, setPopupForm] = useState({
    name: '',
    phone: '',
    eventName: '',
    durationHours: '24',
  })

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPopupSubmitted(true)
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl shadow-slate-900/10 space-y-6 relative z-10">
      {/* Onboarding Completion Banner */}
      {nameParam ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs font-bold text-slate-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>
            Onboarding setup recorded for <strong className="text-emerald-700">{nameParam}</strong>. Sign in below to enter your store dashboard.
          </span>
        </div>
      ) : (
        /* Interactive Onboarding Banner */
        <Link
          href="/onboarding"
          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs transition-all hover:border-emerald-500/50 hover:bg-white active:scale-[0.99] group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black transition-transform group-hover:scale-105 shadow-sm">
              <Zap size={16} />
            </div>
            <div>
              <p className="font-black text-slate-900">New to SurePrice?</p>
              <p className="text-xs text-slate-500 font-medium">Try 1-Tap Interactive Setup</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-emerald-600 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* Pilot Notice */}
      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
        <Info size={16} className="mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-slate-600 leading-relaxed font-medium">
          <strong className="text-slate-900">Pilot Phase:</strong> Public self-signup is restricted. Sign in with your pre-provisioned pilot credentials or request a temporary Event Vendor Pass.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/80">
        <button
          type="button"
          id="tab-signin"
          onClick={() => setActiveTab('signin')}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all ${
            activeTab === 'signin'
              ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock size={14} />
          <span>Merchant Sign In</span>
        </button>

        <button
          type="button"
          id="tab-popup"
          onClick={() => setActiveTab('popup')}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all ${
            activeTab === 'popup'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket size={14} className={activeTab === 'popup' ? 'text-[var(--lime-base)]' : ''} />
          <span>Pop-Up Pass</span>
        </button>
      </div>

      {/* Error message */}
      {errorParam === 'invalid_credentials' && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700">
          Invalid email or password. Please check your pilot credentials or contact support.
        </div>
      )}

      {/* TAB 1: PILOT BUSINESS OWNER SIGN IN */}
      {activeTab === 'signin' && (
        <form action={login} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email-input" className="text-xs font-black text-slate-800">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              id="login-email-input"
              placeholder="merchant@store.ng"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password-input" className="text-xs font-black text-slate-800">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              id="login-password-input"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98] mt-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <div className="text-center pt-2 text-xs text-slate-500 font-medium">
            New store owner with pilot code?{' '}
            <Link href="/register" className="text-emerald-700 font-black hover:underline">
              Register here
            </Link>
          </div>
        </form>
      )}

      {/* TAB 2: POP-UP EVENT VENDOR FAST-PASS ACCESS */}
      {activeTab === 'popup' && (
        <div>
          {popupSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-base font-black text-slate-900">Event Vendor Pass Requested!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed font-medium">
                Your temporary vendor pass for <strong>{popupForm.eventName || 'Event'}</strong> is being activated. Our event team will send your QR pass link to <strong>{popupForm.phone || 'your phone'}</strong> via WhatsApp.
              </p>

              <button
                type="button"
                onClick={() => {
                  setPopupSubmitted(false)
                  setActiveTab('signin')
                }}
                className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700 hover:underline"
              >
                Return to Merchant Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handlePopupSubmit} className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                🎪 Testing a temporary event stall? Submit below for a 1-minute <strong>Fast-Pass QR Storefront</strong> with active event timers.
              </div>

              <div className="space-y-1.5">
                <label htmlFor="popup-vendor-name" className="text-xs font-black text-slate-800">
                  Vendor / Brand Name
                </label>
                <input
                  id="popup-vendor-name"
                  type="text"
                  required
                  value={popupForm.name}
                  onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })}
                  placeholder="e.g. Suya & Grill Pop-up"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="popup-phone-input" className="text-xs font-black text-slate-800">
                  Phone / WhatsApp Number
                </label>
                <input
                  id="popup-phone-input"
                  type="tel"
                  required
                  value={popupForm.phone}
                  onChange={(e) => setPopupForm({ ...popupForm, phone: e.target.value })}
                  placeholder="0801 234 5678"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="popup-event-name" className="text-xs font-black text-slate-800">
                    Event Name
                  </label>
                  <input
                    id="popup-event-name"
                    type="text"
                    required
                    value={popupForm.eventName}
                    onChange={(e) => setPopupForm({ ...popupForm, eventName: e.target.value })}
                    placeholder="e.g. Eko Food Fest"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="popup-duration-select" className="text-xs font-black text-slate-800">
                    Event Duration
                  </label>
                  <select
                    id="popup-duration-select"
                    value={popupForm.durationHours}
                    onChange={(e) => setPopupForm({ ...popupForm, durationHours: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="12">12 Hours (1 Day)</option>
                    <option value="24">24 Hours (Weekend)</option>
                    <option value="72">3 Days (Exhibition)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                id="popup-pass-submit-btn"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98] mt-2"
              >
                <Sparkles size={16} />
                <span>Request Event Vendor Pass</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
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
        <p className="text-xs font-semibold text-slate-500">Merchant & Event Vendor Access Portal</p>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-400">Loading access portal…</div>}>
        <LoginContent />
      </Suspense>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500">
        Need assistance? Contact <span className="text-slate-900 font-extrabold">support@sureprice.ng</span>
      </div>
    </div>
  )
}