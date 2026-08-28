'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Package, Tag, FolderTree, FileText, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { updateCatalogItemSchema, type UpdateCatalogItemFormValues, type UpdateCatalogItemInput } from '../schema'
import { updateCatalogItem } from '../actions'
import type { Category } from '@/features/categories/types'
import type { CatalogItem } from '../types'

function attributesToArray(attrs: CatalogItem['attributes']): { key: string; value: string }[] {
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    return Object.entries(attrs as Record<string, string>).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  }
  return []
}

export function CatalogItemEditForm({ item, categories }: { item: CatalogItem; categories: Category[] }) {
  const [isPending, startTransition] = useTransition()
  const { register, control, handleSubmit, formState: { errors } } = useForm<UpdateCatalogItemFormValues>({
    resolver: zodResolver(updateCatalogItemSchema),
    defaultValues: {
      category_id: item.category_id,
      name: item.name,
      description: item.description ?? '',
      base_price: item.base_price ?? undefined,
      attributes: attributesToArray(item.attributes),
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' })

  const onSubmit = (data: UpdateCatalogItemFormValues) => {
    startTransition(() => {
      updateCatalogItem(item.id, item.business_id, data as UpdateCatalogItemInput)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-slate-900 dark:text-white">
      {/* Product Title Field */}
      <div className="space-y-1.5">
        <label htmlFor="edit-item-name" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Package size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
          <span>Product / Item Name</span>
        </label>
        <input
          {...register('name')}
          id="edit-item-name"
          type="text"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all"
        />
        {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
      </div>

      {/* Base Price & Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Base Price Input */}
        <div className="space-y-1.5">
          <label htmlFor="edit-item-price" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Tag size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Price (Nigerian Naira)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">
              ₦
            </span>
            <input
              {...register('base_price')}
              id="edit-item-price"
              type="number"
              step="0.01"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 text-xs font-black text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all"
            />
          </div>
          {errors.base_price && <p className="text-xs font-bold text-rose-500">{errors.base_price.message}</p>}
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="edit-item-category" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FolderTree size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Category</span>
          </label>
          <select
            {...register('category_id')}
            id="edit-item-category"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all"
          >
            <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-1.5">
        <label htmlFor="edit-item-description" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <FileText size={14} className="text-slate-400" />
          <span>Description / Key Details</span>
        </label>
        <textarea
          {...register('description')}
          id="edit-item-description"
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all"
        />
      </div>

      {/* Attributes Editor with Quick Presets */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Quick Item Badges & Specials
          </label>
          <p className="text-[11px] text-slate-400">
            Toggle badges to highlight this item on your digital storefront.
          </p>

          {/* Quick Presets Pills */}
          <div className="mt-2 flex flex-wrap gap-2">
            {(() => {
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
                <>
                  <button
                    type="button"
                    onClick={() => togglePreset('special', isSpecial)}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
                      isSpecial
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
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
                </>
              )
            })()}
          </div>
        </div>

        {/* Freeform Key-Value Attributes */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Custom Attributes & Specifications
          </label>
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        id="catalog-edit-submit-btn"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50 transition-all"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Saving Changes…</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>Save Product Changes</span>
          </>
        )}
      </button>
    </form>
  )
}
