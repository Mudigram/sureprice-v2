'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ScanLine,
  Building2,
  Users,
  LogOut,
  Shield,
  ExternalLink,
  Store,
  Sparkles,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
  signOutAction: () => Promise<void>
}

export function AdminSidebar({ userEmail, signOutAction }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Your Businesses',
      href: '/dashboard',
      icon: Building2,
      active: pathname === '/dashboard' || pathname.startsWith('/businesses'),
    },
    {
      label: 'Team & Roles',
      href: '/dashboard/team',
      icon: Users,
      active: pathname.startsWith('/dashboard/team'),
    },
  ]

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-slate-800/80 bg-slate-950 p-5 min-h-screen sticky top-0 h-screen overflow-y-auto no-scrollbar">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-lg shadow-[var(--lime-base)]/20">
              <ScanLine size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">SurePrice</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Merchant Admin
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[10px] font-bold text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime-base)] animate-pulse" />
            <span>Pilot Partner Access</span>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 pb-1">
            Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-black transition-all ${
                  item.active
                    ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/15'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Quick Tools Section */}
        <div className="space-y-1 pt-2 border-t border-slate-900">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 pb-1">
            Storefront Shortcuts
          </p>

          <Link
            href="/scan"
            target="_blank"
            className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ScanLine size={16} className="text-[var(--lime-base)]" />
              <span>Test Scanner</span>
            </span>
            <ExternalLink size={13} className="text-slate-500" />
          </Link>

          <Link
            href="/stores"
            target="_blank"
            className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store size={16} className="text-blue-400" />
              <span>Browse Stores</span>
            </span>
            <ExternalLink size={13} className="text-slate-500" />
          </Link>
        </div>
      </div>

      {/* Bottom Profile & Sign Out Box */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {userEmail && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900 p-3 border border-slate-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-[var(--lime-base)] font-bold text-xs">
              <Shield size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{userEmail}</p>
              <p className="text-[10px] text-slate-400">Authenticated Merchant</p>
            </div>
          </div>
        )}

        <form action={signOutAction}>
          <button
            type="submit"
            id="sidebar-logout-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
