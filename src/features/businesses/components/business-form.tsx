'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store, Zap, Sparkles, MapPin, ArrowRight, Loader2, Link2, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createBusinessSchema, type CreateBusinessInput } from '../schema'
import { createBusiness } from '../actions'
import { BUSINESS_TYPES } from '../types'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function BusinessForm({ organizationId }: { organizationId: string }) {
  const [isPending, startTransition] = useTransition()
  const [isCustomSlug, setIsCustomSlug] = useState(false)
  const [onboardingNotice, setOnboardingNotice] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBusinessInput>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      organization_id: organizationId,
      name: '',
      slug: '',
      business_type: 'retail',
    },
  })

  const watchedName = watch('name')
  const watchedSlug = watch('slug')

  // Pre-fill form from onboarding localStorage or URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sureprice_onboarding_data')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.storeName) {
            setValue('name', parsed.storeName)
            setValue('slug', slugify(parsed.storeName))
            if (parsed.venueType && BUSINESS_TYPES.includes(parsed.venueType)) {
              setValue('business_type', parsed.venueType)
            }
            setOnboardingNotice(`Pre-filled from your onboarding setup for "${parsed.storeName}".`)
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, [setValue])

  // Real-time slug auto-generation unless user customizes it
  useEffect(() => {
    if (!isCustomSlug && watchedName) {
      setValue('slug', slugify(watchedName), { shouldValidate: true })
    }
  }, [watchedName, isCustomSlug, setValue])

  const onSubmit = (data: CreateBusinessInput) => {
    setFormError(null)
    setIsSuccess(false)

    startTransition(async () => {
      try {
        await createBusiness(data)
        setIsSuccess(true)
      } catch (err: any) {
        console.error('Business creation error:', err)
        setFormError(err?.message || 'Failed to create store business. Please check your slug or network and try again.')
      }
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
      {/* Explicit Error State Banner */}
      {formError && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-900">Unable to Register Store</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Visual Success Feedback Banner */}
      {isSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>Business store created successfully! Redirecting...</span>
        </div>
      )}

      {onboardingNotice && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Sparkles size={16} className="shrink-0 text-emerald-600" />
          <span>{onboardingNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('organization_id')} />

        {/* Business Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="biz-name-input" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Store / Business Name</span>
          </label>
          <input
            {...register('name')}
            id="biz-name-input"
            type="text"
            placeholder="e.g. Spar Supermarket VI, Cilantro Dining Ikeja"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-950 dark:text-white transition-all"
          />
          {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
        </div>

        {/* Store URL Slug Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="biz-slug-input" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Link2 size={13} className="text-emerald-600 dark:text-[var(--lime-base)]" />
              <span>Store Web Scan Slug</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCustomSlug((prev) => !prev)}
              className="text-[11px] font-bold text-emerald-700 dark:text-[var(--lime-base)] hover:underline"
            >
              {isCustomSlug ? 'Auto-generate' : 'Edit URL manually'}
            </button>
          </div>

          <input
            {...register('slug')}
            id="biz-slug-input"
            type="text"
            readOnly={!isCustomSlug}
            placeholder="e.g. spar-supermarket-vi"
            onChange={(e) => {
              setIsCustomSlug(true)
              register('slug').onChange(e)
            }}
            className={`h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-mono text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-950 dark:text-white transition-all ${
              !isCustomSlug ? 'opacity-80 cursor-default bg-slate-50 dark:bg-slate-950/60' : ''
            }`}
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Customer scan address: <span className="font-mono text-slate-800 dark:text-slate-200">sureprice.ng/s/{watchedSlug || 'your-slug'}</span>
          </p>
          {errors.slug && <p className="text-xs font-bold text-rose-500">{errors.slug.message}</p>}
        </div>

        {/* Business Type Field */}
        <div className="space-y-1.5">
          <label htmlFor="biz-type-select" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Store size={14} className="text-emerald-600 dark:text-[var(--lime-base)]" />
            <span>Physical Venue Category</span>
          </label>
          <select
            {...register('business_type')}
            id="biz-type-select"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-900 shadow-sm focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] dark:border-slate-800 dark:bg-slate-950 dark:text-white capitalize transition-all"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          {errors.business_type && (
            <p className="text-xs font-bold text-rose-500">{errors.business_type.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          id="create-business-submit-btn"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-5 py-4 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50 mt-2"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Registering Business Store…</span>
            </>
          ) : (
            <>
              <Store size={16} />
              <span>Create Business Store</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}