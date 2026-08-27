'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Building2, Link2, Store, Save, Loader2 } from 'lucide-react'
import { updateBusinessSchema, type UpdateBusinessInput } from '../schema'
import { updateBusiness } from '../actions'
import { BUSINESS_TYPES, type Business } from '../types'

export function BusinessEditForm({ business }: { business: Business }) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBusinessInput>({
    resolver: zodResolver(updateBusinessSchema),
    defaultValues: {
      name: business.name,
      slug: business.slug,
      business_type: business.business_type,
    },
  })

  const onSubmit = (data: UpdateBusinessInput) => {
    startTransition(() => {
      updateBusiness(business.id, data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-slate-900 dark:text-white">
      {/* Business Name Field */}
      <div className="space-y-1.5">
        <label htmlFor="edit-biz-name" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Building2 size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
          <span>Business Name</span>
        </label>
        <input
          {...register('name')}
          id="edit-biz-name"
          type="text"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-950 dark:text-white transition-all"
        />
        {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
      </div>

      {/* Business Slug Field */}
      <div className="space-y-1.5">
        <label htmlFor="edit-biz-slug" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Link2 size={13} className="text-emerald-600 dark:text-[var(--lime-base)]" />
          <span>Store Web Slug</span>
        </label>
        <input
          {...register('slug')}
          id="edit-biz-slug"
          type="text"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-mono text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-950 dark:text-white transition-all"
        />
        {errors.slug && <p className="text-xs font-bold text-rose-500">{errors.slug.message}</p>}
      </div>

      {/* Business Type Field */}
      <div className="space-y-1.5">
        <label htmlFor="edit-biz-type" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Store size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
          <span>Venue Category</span>
        </label>
        <select
          {...register('business_type')}
          id="edit-biz-type"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-950 dark:text-white capitalize transition-all"
        >
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {errors.business_type && <p className="text-xs font-bold text-rose-500">{errors.business_type.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        id="edit-business-submit-btn"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50 transition-all mt-2"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Saving Changes…</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>Save Store Details</span>
          </>
        )}
      </button>
    </form>
  )
}