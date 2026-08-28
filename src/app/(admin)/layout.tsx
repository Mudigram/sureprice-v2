import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ScanLine, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminMobileNav } from '@/components/admin/admin-mobile-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const handleSignOut = async () => {
    'use server'
    const s = await createClient()
    await s.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row font-sans">
      {/* ── Desktop Sidebar Navigation (md+ screens) ── */}
      <AdminSidebar userEmail={user?.email} signOutAction={handleSignOut} />

      {/* ── Main Dashboard Shell Area ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header (md:hidden) */}
        <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md md:hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black shadow-sm">
                <ScanLine size={16} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                <span className="text-emerald-700">Sure</span>Price
              </span>
            </Link>

            <form action={handleSignOut}>
              <button
                type="submit"
                id="mobile-admin-logout"
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 pb-20 md:pb-8">{children}</main>

        {/* Mobile Bottom Navigation (md:hidden) */}
        <AdminMobileNav userEmail={user?.email} />

        {/* Footer for Desktop */}
        <footer className="hidden md:block border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 font-medium bg-white">
          SurePrice Enterprise Console · Pilot Partner Environment · Lagos, Nigeria
        </footer>
      </div>
    </div>
  )
}

