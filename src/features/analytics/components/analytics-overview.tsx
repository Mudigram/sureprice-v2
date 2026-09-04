'use client'

import { useState } from 'react'
import type { ScanAnalyticsSummary, HourlyScanPoint } from '../types'
import { ScanLine, TrendingUp, Clock, Award, Package, MessageCircle, Tag, Flame, Download, Bell, BellOff } from 'lucide-react'
import { AnalyticsZeroIllustration } from '@/components/illustrations'

// ── Rush period definitions for Ibadan physical merchants ──
const RUSH_PERIODS = [
  { label: 'Morning Rush', emoji: '🌅', startHour: 7, endHour: 10, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  { label: 'Lunch Rush', emoji: '☀️', startHour: 12, endHour: 15, color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
  { label: 'Afternoon Rush', emoji: '🌤️', startHour: 15, endHour: 18, color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  { label: 'Dinner Rush', emoji: '🌙', startHour: 18, endHour: 22, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  { label: 'Late Night', emoji: '🌃', startHour: 22, endHour: 24, color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-600/20' },
  { label: 'Off-Peak Hours', emoji: '😴', startHour: 0, endHour: 7, color: 'text-slate-500', bg: 'bg-slate-800/30 border-slate-700/20' },
]

function getPeakRushPeriods(distribution: HourlyScanPoint[]) {
  // Sum scans per named period
  return RUSH_PERIODS.map((period) => {
    const hours = distribution.filter((h) =>
      period.endHour === 24
        ? h.hour >= period.startHour
        : h.hour >= period.startHour && h.hour < period.endHour
    )
    const totalScans = hours.reduce((acc, h) => acc + h.scanCount, 0)
    return { ...period, totalScans }
  }).sort((a, b) => b.totalScans - a.totalScans)
}

function formatHour(h: number): string {
  if (h === 0) return '12am'
  if (h < 12) return `${h}am`
  if (h === 12) return '12pm'
  return `${h - 12}pm`
}

interface AnalyticsOverviewProps {
  summary: ScanAnalyticsSummary
}

export function AnalyticsOverview({ summary }: AnalyticsOverviewProps) {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('30d')
  const [chimeEnabled, setChimeEnabled] = useState(false)

  const maxScans = summary.topItems[0]?.scanCount ?? 1
  const rushPeriods = getPeakRushPeriods(summary.hourlyScanDistribution)
  const peakRush = rushPeriods[0]
  const maxHourlyScan = Math.max(...summary.hourlyScanDistribution.map((h) => h.scanCount), 1)

  const exportCsvReport = () => {
    const headers = ['Metric', 'Value']
    const rows = [
      ['Total Lifetime Scans', summary.totalScans],
      ['In-Store Scans Today', summary.todayScans],
      ['Estimated WhatsApp Inquiries', summary.whatsappEstimate.estimatedInquiries],
      ['Estimated Prices Noted', summary.whatsappEstimate.estimatedPriceNotes],
      ['Peak Rush Period', peakRush?.label || 'N/A'],
    ]
    summary.topItems.forEach((item) => {
      rows.push([`Top Item: ${item.name}`, item.scanCount])
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `sureprice-scan-analytics-${dateRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 text-slate-900">
      {/* ── Control Toolbar: Date Filter & CSV Export ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">Range:</span>
          {(['today', '7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                dateRange === range
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              chimeEnabled
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {chimeEnabled ? <Bell size={13} className="text-emerald-600 animate-bounce" /> : <BellOff size={13} />}
            <span>{chimeEnabled ? 'Scan Chime Active' : 'Enable Chime'}</span>
          </button>

          <button
            type="button"
            onClick={exportCsvReport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 transition-all"
          >
            <Download size={13} className="text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-black border border-emerald-200">
            <ScanLine size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Lifetime Scans</p>
            <p className="text-3xl font-black text-slate-900">{summary.totalScans.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-black border border-blue-200">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">In-Store Scans Today</p>
            <p className="text-3xl font-black text-slate-900">{summary.todayScans.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── WhatsApp & Price Conversion Estimates ── */}
      {summary.totalScans > 0 && (
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-emerald-700" />
            <h2 className="text-base font-black text-slate-900">Customer Demand Signals</h2>
            <span className="ml-auto text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full px-2.5 py-0.5 border border-emerald-200">
              Estimated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-white p-4 space-y-1 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">WhatsApp Inquiries</p>
              <p className="text-3xl font-black text-slate-900">~{summary.whatsappEstimate.estimatedInquiries.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 leading-snug font-medium">Customers likely messaged via WhatsApp after scanning</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Prices Noted</p>
              <p className="text-3xl font-black text-slate-900">~{summary.whatsappEstimate.estimatedPriceNotes.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 leading-snug font-medium">Customers checked item details & prices</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
            Estimates based on West African informal retail QR scan-to-inquiry conversion benchmarks (~18% inquiry rate, ~42% price-noted rate).
          </p>
        </div>
      )}

      {/* ── Peak Activity Rush Heatmap ── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-amber-600" />
            <h2 className="text-base font-black text-slate-900">Customer Rush Periods</h2>
          </div>
          {peakRush && peakRush.totalScans > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
              <span>{peakRush.emoji}</span>
              <span>Peak: {peakRush.label}</span>
            </div>
          )}
        </div>

        {/* Hour-by-Hour Heatmap (24h bar chart) */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hourly Scan Heatmap — Last 30 Days</p>
          <div className="flex items-end gap-1 h-14 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            {Array.from({ length: 24 }, (_, h) => {
              const point = summary.hourlyScanDistribution.find((p) => p.hour === h)
              const count = point?.scanCount ?? 0
              const heightPct = maxHourlyScan > 0 ? Math.max(6, Math.round((count / maxHourlyScan) * 100)) : 6
              const isLunch = h >= 12 && h < 15
              const isDinner = h >= 18 && h < 22
              const isMorning = h >= 7 && h < 10
              const barColor = isDinner ? 'bg-indigo-600' : isLunch ? 'bg-amber-500' : isMorning ? 'bg-emerald-600' : 'bg-slate-300'
              return (
                <div
                  key={h}
                  title={`${formatHour(h)}: ${count} scan${count !== 1 ? 's' : ''}`}
                  style={{ height: `${heightPct}%` }}
                  className={`flex-1 rounded-sm ${barColor} transition-all duration-300 hover:opacity-100 opacity-85`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 px-1">
            <span>12am</span>
            <span>6am</span>
            <span>12pm</span>
            <span>6pm</span>
            <span>12am</span>
          </div>
        </div>

        {/* Rush Period Breakdown Bars */}
        {summary.totalScans > 0 ? (
          <div className="space-y-2.5">
            {rushPeriods.slice(0, 4).map((period) => {
              const pct = peakRush.totalScans > 0
                ? Math.round((period.totalScans / peakRush.totalScans) * 100)
                : 0
              return (
                <div key={period.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{period.emoji}</span>
                      <span>{period.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({period.startHour}:00–{period.endHour === 24 ? '24:00' : `${period.endHour}:00`})
                      </span>
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {period.totalScans} scan{period.totalScans !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        period.label === peakRush.label
                          ? 'bg-emerald-600'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-2 font-medium">
            Rush data will appear once your items are scanned by customers.
          </p>
        )}
      </div>

      {/* ── Top Scanned Items ── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-emerald-700" />
          <h2 className="text-base font-black text-slate-900">Top Scanned Products</h2>
        </div>

        {summary.topItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 text-xs space-y-3">
            <AnalyticsZeroIllustration className="mx-auto w-56 h-40 rounded-2xl" />
            <p className="font-bold text-slate-800">No item scans logged yet.</p>
            <p className="text-[11px] text-slate-500 font-medium">Print shelf tags from the QR Studio to track customer scans!</p>
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
                      <span className="font-bold text-slate-900 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">
                      {item.scanCount} scan{item.scanCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
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
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            <h2 className="text-base font-black text-slate-900">Recent Customer Scans</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Last 15 scans
          </span>
        </div>

        {summary.recentActivity.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500 text-xs font-medium">
            No recent customer scan events recorded.
          </div>
        ) : (
          <div className="space-y-2">
            {summary.recentActivity.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800 truncate">{event.label}</span>
                </div>
                <span className="font-mono text-slate-500 shrink-0 text-[11px]">
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
