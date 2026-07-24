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
} from 'lucide-react'
import { login } from '@/features/auth/actions'

function LoginContent() {
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode')
  const errorParam = searchParams.get('error')

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
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
      {/* Pilot Notice */}
      <div className="flex items-start gap-3 rounded-2xl bg-blue-950/50 p-3.5 border border-blue-900/60 text-xs">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-400" />
        <p className="text-blue-200 leading-relaxed">
          <strong>Pilot Phase:</strong> Public self-signup is disabled. Sign in with your pre-provisioned pilot credentials or request a Pop-Up Vendor Pass.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
        <button
          type="button"
          id="tab-signin"
          onClick={() => setActiveTab('signin')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
            activeTab === 'signin'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock size={14} />
          <span>Pilot Sign In</span>
        </button>

        <button
          type="button"
          id="tab-popup"
          onClick={() => setActiveTab('popup')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
            activeTab === 'popup'
              ? 'bg-purple-950 text-purple-200 border border-purple-800/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ticket size={14} className="text-purple-400" />
          <span>Pop-Up Pass</span>
        </button>
      </div>

      {/* Error message */}
      {errorParam === 'invalid_credentials' && (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-3 text-xs font-bold text-red-300">
          Invalid email or password. Please check your pilot credentials or contact support.
        </div>
      )}

      {/* TAB 1: PILOT BUSINESS OWNER SIGN IN */}
      {activeTab === 'signin' && (
        <form action={login} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">Email Address</label>
            <input
              name="email"
              type="email"
              required
              id="login-email-input"
              placeholder="merchant@store.ng"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[var(--lime-base)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">Password</label>
            <input
              name="password"
              type="password"
              required
              id="login-password-input"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[var(--lime-base)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-4 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95 mt-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {/* TAB 2: POP-UP EVENT VENDOR FAST-PASS ACCESS */}
      {activeTab === 'popup' && (
        <div>
          {popupSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-900/60 text-purple-300 border border-purple-700">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-base font-black text-white">Event Vendor Pass Requested!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Your temporary vendor pass for <strong>{popupForm.eventName || 'Event'}</strong> is being activated. Our event team will send your QR pass link to <strong>{popupForm.phone || 'your phone'}</strong> via WhatsApp.
              </p>

              <button
                onClick={() => {
                  setPopupSubmitted(false)
                  setActiveTab('signin')
                }}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--lime-base)] underline"
              >
                Return to Merchant Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handlePopupSubmit} className="space-y-4">
              <div className="rounded-2xl bg-purple-950/40 p-3 border border-purple-900/50 text-[11px] text-purple-200 leading-relaxed">
                🎪 Testing a temporary event stall? Submit below for a 1-minute <strong>Fast-Pass QR Storefront</strong> with active event timers.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-300">Vendor / Brand Name</label>
                <input
                  type="text"
                  required
                  value={popupForm.name}
                  onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })}
                  placeholder="e.g. Suya & Grill Pop-up"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-300">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={popupForm.phone}
                  onChange={(e) => setPopupForm({ ...popupForm, phone: e.target.value })}
                  placeholder="0801 234 5678"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300">Event Name</label>
                  <input
                    type="text"
                    required
                    value={popupForm.eventName}
                    onChange={(e) => setPopupForm({ ...popupForm, eventName: e.target.value })}
                    placeholder="e.g. Eko Food Fest"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300">Event Duration</label>
                  <select
                    value={popupForm.durationHours}
                    onChange={(e) => setPopupForm({ ...popupForm, durationHours: e.target.value })}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs font-semibold text-white focus:border-purple-500 focus:outline-none"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3.5 text-xs font-black text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500 active:scale-95"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-5 py-12 text-slate-100 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--lime-base)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-lg shadow-[var(--lime-base)]/25">
            <ScanLine size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">SurePrice</span>
        </Link>
        <p className="text-xs text-slate-400">Merchant & Event Vendor Access Portal</p>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-400">Loading access portal…</div>}>
        <LoginContent />
      </Suspense>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500">
        Need assistance? Contact <span className="text-white font-bold">support@sureprice.ng</span>
      </div>
    </div>
  )
}