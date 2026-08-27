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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row">
      {/* ── Desktop Sidebar Navigation (md+ screens) ── */}
      <AdminSidebar userEmail={user?.email} signOutAction={handleSignOut} />

      {/* ── Main Dashboard Shell Area ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header (md:hidden) */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:hidden">
          <div className="flex items-center justify-between px-5 py-3.5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black shadow-md">
                <ScanLine size={16} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">SurePrice</span>
            </Link>

            <form action={handleSignOut}>
              <button
                type="submit"
                id="mobile-admin-logout"
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 pb-20 md:pb-8">{children}</main>

        {/* Mobile Bottom Glassmorphism Nav (md:hidden) */}
        <AdminMobileNav userEmail={user?.email} />

        {/* Footer for Desktop */}
        <footer className="hidden md:block border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-500">
          SurePrice Admin Console · Merchant Pilot Launch
        </footer>
      </div>
    </div>
  )
}
