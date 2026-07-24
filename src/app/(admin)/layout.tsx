import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ScanLine, Building2, Users, LogOut, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Admin Shell Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black shadow-md">
                <ScanLine size={16} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tight text-white">SurePrice</span>
            </Link>

            {/* Admin Nav */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Building2 size={14} />
                <span>Businesses</span>
              </Link>

              <Link
                href="/dashboard/team"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Users size={14} />
                <span>Manage Team</span>
              </Link>
            </nav>
          </div>

          {/* User Badge & Sign Out */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300 border border-slate-800">
                <Shield size={12} className="text-[var(--lime-base)]" />
                <span>{user.email}</span>
              </span>
            )}

            <form
              action={async () => {
                'use server'
                const s = await createClient()
                await s.auth.signOut()
                redirect('/login')
              }}
            >
              <button
                type="submit"
                id="admin-logout-btn"
                title="Sign Out"
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Admin Shell Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        SurePrice Admin Console · Merchant Pilot Launch
      </footer>
    </div>
  )
}
