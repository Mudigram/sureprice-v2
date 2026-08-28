'use client'

import { BarChart3, TrendingUp, Sparkles } from 'lucide-react'
import type { DailyScanTrendPoint } from '../types'

interface ScanTrendChartProps {
  trend: DailyScanTrendPoint[]
  totalScans: number
  scansToday: number
}

export function ScanTrendChart({ trend, totalScans, scansToday }: ScanTrendChartProps) {
  const maxScans = Math.max(...trend.map((t) => t.scanCount), 1)

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              In-Store Scan Activity
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                <Sparkles size={10} className="text-emerald-600" /> Live
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Customer QR scan frequency (Last 7 Days)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
            <span className="text-slate-500 block text-[10px] font-bold">Scans Today</span>
            <span className="font-black text-emerald-700 text-sm">{scansToday}</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
            <span className="text-slate-500 block text-[10px] font-bold">7-Day Total</span>
            <span className="font-black text-slate-900 text-sm">
              {trend.reduce((acc, t) => acc + t.scanCount, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Bar Histogram */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36 pt-4 px-2">
        {trend.map((point) => {
          const heightPercent = Math.max(Math.round((point.scanCount / maxScans) * 100), 8)
          const isToday = point.dayLabel === 'Today'

          return (
            <div key={point.date} className="flex flex-col items-center gap-2 group h-full justify-end relative">
              {/* Scan Count Badge */}
              <span className={`text-[10px] font-bold transition-all ${
                isToday ? 'text-emerald-800 scale-110 font-black' : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                {point.scanCount}
              </span>

              {/* Bar Container */}
              <div className="w-full max-w-[36px] bg-slate-100 rounded-xl overflow-hidden flex items-end p-1 border border-slate-200/80 h-full">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isToday
                      ? 'bg-emerald-600 shadow-sm'
                      : 'bg-slate-300 group-hover:bg-slate-400'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span className={`text-[11px] font-bold ${
                isToday ? 'text-emerald-800 font-black' : 'text-slate-500'
              }`}>
                {point.dayLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer Insight */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs text-slate-600 font-medium">
        <TrendingUp size={14} className="text-emerald-600 shrink-0" />
        <p>
          QR scans update instantly as physical store customers & pop-up visitors scan product tags.
        </p>
      </div>
    </div>
  )
}

