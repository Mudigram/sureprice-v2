import Link from 'next/link'
import type { Metadata } from 'next'
import { ShieldAlert, Building2, LogOut, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Access Pending — SurePrice',
  description: 'Your account does not currently have an assigned business role.',
}

export default function NoAccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
          <ShieldAlert size={32} />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            Access Pending
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
            Your account is verified, but you have not been assigned a role or business scope yet.
          </p>
        </div>

        {/* Instructions Box */}
        <div className="rounded-2xl bg-blue-50/70 p-4 text-left border border-blue-200/80 dark:bg-blue-950/30 dark:border-blue-900/50 space-y-2">
          <p className="text-xs font-bold text-blue-950 dark:text-blue-200">
            How to get access:
          </p>
          <ul className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300 space-y-1 list-disc pl-4">
            <li>
              <strong>Team Members (Admin / Manager):</strong> Ask your Organization Owner or Business Admin to invite your email address via <em>Manage Team</em>.
            </li>
            <li>
              <strong>New Business Owners:</strong> Click below to register your business and organization.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 transition-transform active:scale-95"
          >
            <Building2 size={16} />
            <span>Register Store Organization (Pilot Access)</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-slate-600 dark:border-zinc-800 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
          >
            <LogOut size={15} />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
