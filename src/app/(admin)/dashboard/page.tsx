import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Store,
  MapPin,
  Package,
  QrCode as QrIcon,
  Users,
  Plus,
  ArrowRight,
  Printer,
  BarChart2,
  Sparkles,
  Utensils,
  Coffee,
  ShoppingBag,
  Ticket,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOwnerOrganizationId } from '@/features/organizations/queries'
import { getBusinessesForOrg } from '@/features/businesses/queries'
import { getOrgDashboardMetrics } from '@/features/analytics/queries'
import { ScanTrendChart } from '@/features/analytics/components/scan-trend-chart'

export const metadata: Metadata = {
  title: 'Merchant Dashboard | SurePrice',
  description: 'Manage your physical retail stores, restaurants, cafes, and pop-up event stalls.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const orgId = await getOwnerOrganizationId(user.id)
  if (!orgId) redirect('/no-access')

  const businesses = await getBusinessesForOrg(orgId)
  const businessIds = businesses.map((b) => b.id)

  const metrics = await getOrgDashboardMetrics(businessIds)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8 text-slate-900">
      {/* EXECUTIVE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <Store size={14} className="text-emerald-700" />
            <span>Enterprise Command Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Merchant Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Signed in as <span className="font-bold text-slate-800">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <Users size={14} />
            <span>Manage Team</span>
          </Link>
          <Link
            href={`/businesses/new?organization_id=${orgId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            <Plus size={16} strokeWidth={3} className="text-[var(--lime-base)]" />
            <span>New Business</span>
          </Link>
        </div>
      </div>

      {/* METRICS RIBBON */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Active Businesses */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Businesses</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <Store size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{businesses.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">Registered merchant stores</p>
        </div>

        {/* Locations & Stalls */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Locations & Stalls</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <MapPin size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalLocations}</p>
          <p className="text-[11px] text-slate-500 font-medium">Physical branches & stalls</p>
        </div>

        {/* Catalog Items */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Catalog Products</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <Package size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalItems}</p>
          <p className="text-[11px] text-slate-500 font-medium">Digitized price tags</p>
        </div>

        {/* Total In-Store Scans */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">In-Store Scans</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <QrIcon size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">{metrics.totalOrgScans}</p>
          <p className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <Sparkles size={11} className="text-emerald-600" /> {metrics.scansToday} scans today
          </p>
        </div>
      </div>

      {/* IN-STORE SCAN ACTIVITY TREND VISUALIZER */}
      {businesses.length > 0 && (
        <ScanTrendChart
          trend={metrics.last7DaysTrend}
          totalScans={metrics.totalOrgScans}
          scansToday={metrics.scansToday}
        />
      )}

      {/* POP-UP EVENT VENDOR QUICK LAUNCH BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-300 border border-slate-700">
              <Ticket size={12} className="text-[var(--lime-base)]" /> Pop-Up & Event Vendor Fast-Pass
            </div>
            <h3 className="text-lg font-black text-white">Running a temporary festival stall or weekend pop-up?</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Generate batch QR shelf tags & tent cards in 1 click. Zero app downloads for buyers — customers scan tags with native camera to view live pricing.
            </p>
          </div>

          {businesses.length > 0 && (
            <Link
              href={`/businesses/${businesses[0].id}/qr-studio`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--lime-base)] px-5 py-3 text-xs font-black text-black shadow-md transition-all hover:bg-[var(--lime-dark)] active:scale-[0.98]"
            >
              <Printer size={16} />
              <span>Launch Print Studio</span>
            </Link>
          )}
        </div>
      </div>

      {/* BUSINESSES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>Your Managed Stores</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 font-bold border border-slate-200">
              {businesses.length}
            </span>
          </h2>

          <Link
            href={`/businesses/new?organization_id=${orgId}`}
            className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Add Store</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {businesses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200">
              <Store size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">No Stores Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Create your first physical retail store, restaurant, or pop-up stall to start generating digital price tags.
              </p>
            </div>
            <Link
              href={`/businesses/new?organization_id=${orgId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
            >
              <Plus size={16} strokeWidth={3} className="text-[var(--lime-base)]" />
              <span>Create First Store</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {businesses.map((b) => {
              const bStats = metrics.businessStatsMap[b.id] ?? {
                locationCount: 0,
                itemCount: 0,
                scanCount: 0,
              }

              const isPopup = b.business_type === 'popup_vendor'
              const isRestaurant = b.business_type === 'restaurant'
              const isCafe = b.business_type === 'cafe'

              const TypeIcon = isPopup
                ? Ticket
                : isRestaurant
                ? Utensils
                : isCafe
                ? Coffee
                : ShoppingBag

              const badgeText = isPopup
                ? 'Event Stall Fast-Pass'
                : isRestaurant
                ? 'Table Menu Digital QR'
                : isCafe
                ? 'Counter Digital Price Tag'
                : 'SKU Tag Storefront'

              return (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Name & Type Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800">
                          <TypeIcon size={22} />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight">{b.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {b.business_type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700">
                        {badgeText}
                      </span>
                    </div>

                    {/* Stats Ribbon */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Locations</span>
                        <span className="text-sm font-black text-slate-900">{bStats.locationCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Products</span>
                        <span className="text-sm font-black text-slate-900">{bStats.itemCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Scans</span>
                        <span className="text-sm font-black text-emerald-700">{bStats.scanCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct 1-Tap Actions */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/businesses/${b.id}/catalog-items/new`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <Plus size={12} />
                        <span>Add Item</span>
                      </Link>

                      <Link
                        href={`/businesses/${b.id}/qr-studio`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <Printer size={12} />
                        <span>QR Studio</span>
                      </Link>

                      <Link
                        href={`/businesses/${b.id}/analytics`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <BarChart2 size={12} />
                        <span>Analytics</span>
                      </Link>
                    </div>

                    <Link
                      href={`/businesses/${b.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                      <span>Manage Store Dashboard</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}