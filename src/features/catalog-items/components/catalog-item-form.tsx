'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Package, Tag, FolderTree, FileText, Plus, Loader2 } from 'lucide-react'
import { createCatalogItemSchema, type CreateCatalogItemFormValues, type CreateCatalogItemInput } from '../schema'
import { createCatalogItem } from '../actions'
import { AttributesEditor } from './attributes-editor'
import type { Category } from '@/features/categories/types'

export function CatalogItemForm({ businessId, categories }: { businessId: string; categories: Category[] }) {
  const [isPending, startTransition] = useTransition()
  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateCatalogItemFormValues>({
    resolver: zodResolver(createCatalogItemSchema),
    defaultValues: { business_id: businessId, attributes: [] },
  })

  const onSubmit = (data: CreateCatalogItemFormValues) => {
    startTransition(() => {
      createCatalogItem(data as CreateCatalogItemInput)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-slate-900 dark:text-white">
      <input type="hidden" {...register('business_id')} />

      {/* Product Title Field */}
      <div className="space-y-1.5">
        <label htmlFor="item-name" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Package size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
          <span>Product / Item Name</span>
        </label>
        <input
          {...register('name')}
          id="item-name"
          type="text"
          placeholder="e.g. Smoky Jollof Rice with Fried Chicken, 500g Golden Penny Pasta"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition-all"
        />
        {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
      </div>

      {/* Base Price & Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Base Price Input */}
        <div className="space-y-1.5">
          <label htmlFor="item-price" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Tag size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Price (Nigerian Naira)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">
              ₦
            </span>
            <input
              {...register('base_price')}
              id="item-price"
              type="number"
              step="0.01"
              placeholder="4500"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 text-xs font-black text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all"
            />
          </div>
          {errors.base_price && <p className="text-xs font-bold text-rose-500">{errors.base_price.message}</p>}
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="item-category" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FolderTree size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Category</span>
          </label>
          <select
            {...register('category_id')}
            id="item-category"
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
        <label htmlFor="item-description" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <FileText size={14} className="text-slate-400" />
          <span>Description / Key Details</span>
        </label>
        <textarea
          {...register('description')}
          id="item-description"
          rows={3}
          placeholder="Detailed ingredients, portion size, features, or preparation notes..."
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition-all"
        />
      </div>

      {/* JSONB Key-Value Attributes Editor */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <AttributesEditor control={control} register={register} />
      </div>

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={isPending}
        id="catalog-create-submit-btn"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50 transition-all"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Creating Product Item…</span>
          </>
        ) : (
          <>
            <Plus size={16} strokeWidth={3} />
            <span>Create Product Item</span>
          </>
        )}
      </button>
    </form>
  )
}