'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Building2, Globe, AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react'
import { createLocationSchema, type CreateLocationInput } from '../schema'
import { createLocation } from '../actions'

export function LocationForm({ businessId }: { businessId: string }) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLocationInput>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: { business_id: businessId, name: '', address_line1: '', city: '' },
  })

  const onSubmit = (data: CreateLocationInput) => {
    setFormError(null)
    setIsSuccess(false)

    startTransition(async () => {
      try {
        await createLocation(data)
        setIsSuccess(true)
      } catch (err: any) {
        // Next.js redirect throws a special NEXT_REDIRECT error which is expected
        if (
          err?.digest?.startsWith('NEXT_REDIRECT') ||
          err?.message === 'NEXT_REDIRECT' ||
          (typeof err === 'object' && err !== null && 'digest' in err && String(err.digest).startsWith('NEXT_REDIRECT'))
        ) {
          return
        }
        console.error('Location creation error:', err)
        setFormError(err?.message || 'Failed to create location. Please check your network and try again.')
      }
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
      {/* Explicit Error State Banner */}
      {formError && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-900">Unable to Create Location</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Visual Success Feedback Banner */}
      {isSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>Location created successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('business_id')} />

        {/* Location Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="location-name-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <Building2 size={14} className="text-emerald-700" />
            <span>Location / Branch Name</span>
          </label>
          <input
            {...register('name')}
            id="location-name-input"
            type="text"
            disabled={isPending}
            placeholder="e.g. Victoria Island Flagship, Ikeja City Mall Branch"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-60 transition-all"
          />
          {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
        </div>

        {/* Street Address Field */}
        <div className="space-y-1.5">
          <label htmlFor="location-address-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-700" />
            <span>Street Address</span>
          </label>
          <input
            {...register('address_line1')}
            id="location-address-input"
            type="text"
            disabled={isPending}
            placeholder="e.g. 14 Akin Adesola Street"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-60 transition-all"
          />
          {errors.address_line1 && (
            <p className="text-xs font-bold text-rose-500">{errors.address_line1.message}</p>
          )}
        </div>

        {/* City Field */}
        <div className="space-y-1.5">
          <label htmlFor="location-city-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <Globe size={14} className="text-emerald-700" />
            <span>City / Region</span>
          </label>
          <input
            {...register('city')}
            id="location-city-input"
            type="text"
            disabled={isPending}
            placeholder="e.g. Lagos, Abuja, Port Harcourt"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-60 transition-all"
          />
          {errors.city && <p className="text-xs font-bold text-rose-500">{errors.city.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 transition-all mt-2"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving Location...</span>
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={3} className="text-[var(--lime-base)]" />
              <span>Create Location</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}