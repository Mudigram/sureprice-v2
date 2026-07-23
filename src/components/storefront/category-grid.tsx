'use client'

import { Milk, Beef, Pill, Coffee, Baby, ShoppingBag } from 'lucide-react'

const DEFAULT_CATEGORIES = [
  { name: 'Dairy', icon: Milk, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
  { name: 'Proteins', icon: Beef, color: 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400' },
  { name: 'Beverages', icon: Coffee, color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400' },
  { name: 'Pharmacy', icon: Pill, color: 'bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400' },
  { name: 'Baby Care', icon: Baby, color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
]

interface CategoryGridProps {
  onSelectCategory?: (categoryName: string) => void
  selectedCategory?: string
}

export function CategoryGrid({ onSelectCategory, selectedCategory }: CategoryGridProps) {
  return (
    <section className="w-full py-2">
      <h2 className="mb-3 px-1 text-sm font-bold text-slate-900 dark:text-zinc-100">
        Shop by Category
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {DEFAULT_CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isSelected = selectedCategory === cat.name
          return (
            <button
              key={cat.name}
              id={`cat-grid-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory?.(isSelected ? 'All' : cat.name)}
              className="flex min-w-[68px] flex-col items-center gap-2"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform active:scale-90 ${cat.color} ${
                  isSelected ? 'ring-2 ring-[var(--lime-dark)] ring-offset-2' : ''
                }`}
              >
                <Icon size={26} />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
