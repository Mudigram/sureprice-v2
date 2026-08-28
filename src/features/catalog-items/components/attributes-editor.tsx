'use client'

import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { Sparkles, Flame, Star, Ticket, Plus, Trash2 } from 'lucide-react'
import type { CreateCatalogItemFormValues } from '../schema'

export function AttributesEditor({
  control,
  register,
}: {
  control: Control<CreateCatalogItemFormValues>
  register: UseFormRegister<CreateCatalogItemFormValues>
}) {
  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' })

  const isSpecial = fields.some((f) => f.key?.toLowerCase() === 'special' && f.value === 'true')
  const isBestseller = fields.some((f) => f.key?.toLowerCase() === 'bestseller' && f.value === 'true')
  const isLimited = fields.some((f) => f.key?.toLowerCase() === 'limited' && f.value === 'true')
  const isSpicy = fields.some((f) => f.key?.toLowerCase() === 'spicy' && f.value === 'true')
  const isVeg = fields.some((f) => (f.key?.toLowerCase() === 'vegetarian' || f.key?.toLowerCase() === 'veg') && f.value === 'true')

  const togglePreset = (keyName: string, active: boolean) => {
    if (active) {
      const idx = fields.findIndex((f) => f.key?.toLowerCase() === keyName.toLowerCase())
      if (idx !== -1) remove(idx)
    } else {
      append({ key: keyName, value: 'true' })
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
          Quick Item Badges & Specials
        </label>
        <p className="text-[11px] text-slate-400">
          Toggle badges to highlight this item on your digital storefront.
        </p>

        {/* Quick Presets Pills */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => togglePreset('special', isSpecial)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
              isSpecial
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Flame size={13} className={isSpecial ? 'text-amber-200' : 'text-rose-500'} />
            <span>🔥 Today&apos;s Special</span>
          </button>

          <button
            type="button"
            onClick={() => togglePreset('bestseller', isBestseller)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
              isBestseller
                ? 'bg-amber-500 text-black border-amber-600 shadow-sm shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Star size={13} className={isBestseller ? 'fill-black text-black' : 'text-amber-500'} />
            <span>⭐ Bestseller</span>
          </button>

          <button
            type="button"
            onClick={() => togglePreset('limited', isLimited)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
              isLimited
                ? 'bg-purple-600 text-white border-purple-700 shadow-sm shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Ticket size={13} className={isLimited ? 'text-white' : 'text-purple-500'} />
            <span>🎪 Limited Drop</span>
          </button>

          <button
            type="button"
            onClick={() => togglePreset('spicy', isSpicy)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
              isSpicy
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm shadow-rose-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>🌶️ Spicy</span>
          </button>

          <button
            type="button"
            onClick={() => togglePreset('vegetarian', isVeg)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
              isVeg
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>🌱 Veg</span>
          </button>
        </div>
      </div>

      {/* Freeform Key-Value Attributes */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
          Custom Attributes & Specifications
        </label>
        <p className="text-[11px] text-slate-400">
          Add custom details like Prep Time, Volume, Size, or Ingredients.
        </p>

        <div className="mt-2 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`attributes.${index}.key` as const)}
                placeholder="Key (e.g. Prep Time, Size)"
                className="w-1/3 h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <input
                {...register(`attributes.${index}.value` as const)}
                placeholder="Value (e.g. 15 mins, 500ml)"
                className="flex-1 h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
                title="Remove Attribute"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ key: '', value: '' })}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-[var(--lime-base)] hover:underline mt-2"
        >
          <Plus size={14} />
          <span>+ Add Custom Attribute</span>
        </button>
      </div>
    </div>
  )
}