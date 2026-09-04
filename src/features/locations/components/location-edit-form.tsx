'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Building2, Globe, AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react'
import { updateLocationSchema, type UpdateLocationInput } from '../schema'
import { updateLocation } from '../actions'
import type { Location } from '../types'

export function LocationEditForm({ location }: { location: Location }) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLocationInput>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      name: location.name,
      address_line1: location.address_line1 ?? '',
      city: location.city ?? '',
    },
  })

  const onSubmit = (data: UpdateLocationInput) => {
    setFormError(null)
    setIsSuccess(false)

    startTransition(async () => {
      try {
        await updateLocation(location.id, location.business_id, data)
        setIsSuccess(true)
      } catch (err: any) {
        if (
          err?.digest?.startsWith('NEXT_REDIRECT') ||
          err?.message === 'NEXT_REDIRECT' ||
          (typeof err === 'object' && err !== null && 'digest' in err && String(err.digest).startsWith('NEXT_REDIRECT'))
        ) {
          return
        }
        console.error('Location update error:', err)
        setFormError(err?.message || 'Failed to update location. Please check your network and try again.')
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
            <p className="font-bold text-rose-900">Unable to Save Changes</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Visual Success Feedback Banner */}
      {isSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>Location updated successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Location Name Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="edit-location-name" className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Building2 size={14} className="text-emerald-700" />
              <span>Location / Branch Name</span>
            </label>
            <span className="text-[10px] font-bold text-slate-400">Required</span>
          </div>
          <input
            {...register('name')}
            id="edit-location-name"
            type="text"
            disabled={isPending}
            placeholder="e.g. Victoria Island Flagship, Ikeja Branch"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-60 transition-all"
          />
          {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name.message}</p>}
          <p className="text-[11px] text-slate-500 font-medium">
            This name appears on printed shelf tags and shopper in-store navigation cards.
          </p>
        </div>

        {/* Street Address Field */}
        <div className="space-y-1.5">
          <label htmlFor="edit-location-address" className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-700" />
            <span>Physical Street Address</span>
          </label>
          <input
            {...register('address_line1')}
            id="edit-location-address"
            type="text"
            disabled={isPending}
            placeholder="e.g. 14 Akin Adesola Street, Victoria Island"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-60 transition-all"
          />
          {errors.address_line1 && (
            <p className="text-xs font-bold text-rose-500">{errors.address_line1.message}</p>
          )}
        </div>

        {/* City Field */}
        <div className="space-y-1.5">
          <label htmlFor="edit-location-city" className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Globe size={14} className="text-emerald-700" />
            <span>City / State</span>
          </label>
          <input
            {...register('city')}
            id="edit-location-city"
            type="text"
            disabled={isPending}
            placeholder="e.g. Lagos, Abuja, Ibadan"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-60 transition-all"
          />
          {errors.city && <p className="text-xs font-bold text-rose-500">{errors.city.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime-base)] py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Location Changes...</span>
              </>
            ) : (
              <>
                <Save size={15} strokeWidth={2.5} />
                <span>Save Changes</span>
              </>
            )}
          </button>

          <a
            href={`/locations/${location.id}`}
            className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}