import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getBusinessById } from '@/features/businesses/queries'
import { getScanAnalyticsSummary } from '@/features/analytics/queries'
import { AnalyticsOverview } from '@/features/analytics/components/analytics-overview'

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

  const business = await getBusinessById(businessId)
  if (!business) notFound()

  const summary = await getScanAnalyticsSummary(businessId)

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-6">
      <div>
        <Link
          href={`/businesses/${businessId}`}
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to {business.name}</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black">
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">In-Store Scan Analytics</h1>
            <p className="text-xs text-slate-400">
              Customer price tag scans and product traction for {business.name}.
            </p>
          </div>
        </div>
      </div>

      <AnalyticsOverview summary={summary} />
    </div>
  )
}
