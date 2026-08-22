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
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime-base)]/10 text-[var(--lime-base)] border border-[var(--lime-base)]/20">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              In-Store Scan Activity
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                <Sparkles size={10} /> Live
              </span>
            </h3>
            <p className="text-xs text-slate-400">Customer QR scan frequency (Last 7 Days)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
            <span className="text-slate-400 block text-[10px]">Scans Today</span>
            <span className="font-black text-[var(--lime-base)] text-sm">{scansToday}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
            <span className="text-slate-400 block text-[10px]">7-Day Total</span>
            <span className="font-black text-white text-sm">
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
                isToday ? 'text-[var(--lime-base)] scale-110 font-black' : 'text-slate-400 group-hover:text-white'
              }`}>
                {point.scanCount}
              </span>

              {/* Bar Container */}
              <div className="w-full max-w-[36px] bg-slate-950 rounded-xl overflow-hidden flex items-end p-1 border border-slate-800/60 h-full">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isToday
                      ? 'bg-gradient-to-t from-[var(--lime-dark)] to-[var(--lime-base)] shadow-md shadow-[var(--lime-base)]/20'
                      : 'bg-gradient-to-t from-slate-800 to-slate-700 group-hover:from-slate-700 group-hover:to-slate-600'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span className={`text-[11px] font-bold ${
                isToday ? 'text-[var(--lime-base)] font-black' : 'text-slate-400'
              }`}>
                {point.dayLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer Insight */}
      <div className="flex items-center gap-2 rounded-2xl bg-slate-950/80 p-3 border border-slate-800 text-xs text-slate-300">
        <TrendingUp size={14} className="text-[var(--lime-base)] shrink-0" />
        <p>
          QR scans update instantly as physical store customers & pop-up visitors scan product tags.
        </p>
      </div>
    </div>
  )
}
