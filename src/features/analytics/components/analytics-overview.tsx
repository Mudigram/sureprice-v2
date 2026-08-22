import type { ScanAnalyticsSummary } from '../types'
import { ScanLine, TrendingUp, Clock, Award, Package } from 'lucide-react'
import { AnalyticsZeroIllustration } from '@/components/illustrations'

interface AnalyticsOverviewProps {
  summary: ScanAnalyticsSummary
}

export function AnalyticsOverview({ summary }: AnalyticsOverviewProps) {
  const maxScans = summary.topItems[0]?.scanCount ?? 1

  return (
    <div className="space-y-6">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black font-black shadow-md">
            <ScanLine size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Total Lifetime Scans</p>
            <p className="text-3xl font-black text-white">{summary.totalScans.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 font-black border border-blue-500/30">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">In-Store Scans Today</p>
            <p className="text-3xl font-black text-white">{summary.todayScans.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── Top Scanned Items ── */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-[var(--lime-base)]" />
          <h2 className="text-base font-black text-white">Top Scanned Products</h2>
        </div>

        {summary.topItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 text-xs space-y-3">
            <AnalyticsZeroIllustration className="mx-auto w-56 h-40 rounded-2xl" />
            <p className="font-bold text-slate-300">No item scans logged yet.</p>
            <p className="text-[11px] text-slate-500">Print shelf tags from the QR Studio to track customer scans!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {summary.topItems.map((item) => {
              const percentage = Math.min(100, Math.round((item.scanCount / maxScans) * 100))

              return (
                <div key={item.catalogItemId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Package size={14} className="text-slate-400 shrink-0" />
                      <span className="font-extrabold text-white truncate">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[var(--lime-base)]">
                      {item.scanCount} scan{item.scanCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--lime-base)] to-emerald-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Recent Activity Log ── */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-blue-400" />
            <h2 className="text-base font-black text-white">Recent Customer Scans</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Last 15 scans
          </span>
        </div>

        {summary.recentActivity.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-400 text-xs">
            No recent customer scan events recorded.
          </div>
        ) : (
          <div className="space-y-2">
            {summary.recentActivity.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950 px-4 py-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-[var(--lime-base)] shrink-0" />
                  <span className="font-bold text-slate-200 truncate">{event.label}</span>
                </div>
                <span className="font-mono text-slate-400 shrink-0 text-[11px]">
                  {formatRelativeTime(event.scannedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
