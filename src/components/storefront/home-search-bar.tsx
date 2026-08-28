'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

const NEIGHBORHOODS = [
  { name: 'All Ibadan', value: 'all' },
  { name: 'Bodija', value: 'bodija' },
  { name: 'Ring Road', value: 'ring_road' },
  { name: 'Samonda', value: 'samonda' },
  { name: 'UI / Agbowo', value: 'ui' },
  { name: 'Jericho', value: 'jericho' },
] as const

export function HomeSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeArea, setActiveArea] = useState<string>('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() && activeArea === 'all') return
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (activeArea !== 'all') params.set('area', activeArea)
    router.push(`/stores?${params.toString()}`)
  }

  const handleAreaClick = (areaValue: string) => {
    setActiveArea(areaValue)
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (areaValue !== 'all') params.set('area', areaValue)
    router.push(`/stores?${params.toString()}`)
  }

  return (
    <div className="space-y-2.5">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes, items, or stores (e.g. Suya, Jollof, Bistro)..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-24 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          Search
        </button>
      </form>

      {/* Neighborhood Location Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0 pl-0.5 pr-1">
          <MapPin size={12} className="text-emerald-600 dark:text-[var(--lime-base)]" /> Areas:
        </span>
        {NEIGHBORHOODS.map((area) => {
          const isSelected = activeArea === area.value
          return (
            <button
              key={area.value}
              type="button"
              onClick={() => handleAreaClick(area.value)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}
            >
              {area.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
