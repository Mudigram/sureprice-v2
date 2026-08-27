import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrendingUp } from 'lucide-react'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getStorefrontBusinessById } from '@/features/storefront/queries'
import { getScanAnalyticsSummary } from '@/features/analytics/queries'
import { AnalyticsOverview } from '@/features/analytics/components/analytics-overview'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'In-Store Scan Analytics — SurePrice Admin',
  description: 'View customer scan metrics, top scanned products, and live scan logs.',
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessView(businessId)

  const business = await getStorefrontBusinessById(businessId)
  if (!business) notFound()

  const summary = await getScanAnalyticsSummary(businessId)

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Business Admin Header */}
      <BusinessAdminNav business={business} currentSection="analytics" />

      {/* Analytics Page Title Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          <TrendingUp size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            In-Store Scan Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customer price tag scan velocity and top scanned products for {business.name}.
          </p>
        </div>
      </div>

      <AnalyticsOverview summary={summary} />
    </div>
  )
}
