'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { FolderPlus, Loader2, Plus } from 'lucide-react'
import { createCategorySchema, type CreateCategoryInput } from '../schema'
import { createCategory } from '../actions'

export function CategoryForm({ businessId }: { businessId: string }) {
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { business_id: businessId, name: '' },
  })

  const onSubmit = (data: CreateCategoryInput) => {
    startTransition(async () => {
      await createCategory(data)
      reset({ business_id: businessId, name: '' })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input type="hidden" {...register('business_id')} />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5">
        <div className="flex-1">
          <label htmlFor="new-category-name" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <FolderPlus size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Create New Category</span>
          </label>
          <input
            {...register('name')}
            id="new-category-name"
            placeholder="e.g. Cold Beverages, Signature Soups, Grills & BBQ"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          id="add-category-btn"
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-[var(--lime-base)] px-6 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50 transition-all shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Adding Category…</span>
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={3} />
              <span>Add Category</span>
            </>
          )}
        </button>
      </div>
      {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
    </form>
  )
}