'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Upload,
  X,
  Check,
  Sparkles,
  Store,
  Clock,
  Radio,
  Megaphone,
  Phone,
  Tag,
  Loader2,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  updateStorefrontStudioSchema,
  HIGHLIGHT_OPTIONS,
  type UpdateStorefrontStudioInput,
} from '../schema'
import { updateStorefrontStudio } from '../actions'
import type { WeeklyOperatingHours, DayHours, PopupEventConfig } from '../types'

const COLOR_SWATCHES = [
  { name: 'Lime (Default)', hex: '#13ec5b' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Crimson Red', hex: '#e11d48' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Royal Indigo', hex: '#6366f1' },
  { name: 'Dark Slate', hex: '#18181b' },
]

const DEFAULT_WEEKLY_HOURS: WeeklyOperatingHours = {
  monday: { open: '08:00', close: '21:00', closed: false },
  tuesday: { open: '08:00', close: '21:00', closed: false },
  wednesday: { open: '08:00', close: '21:00', closed: false },
  thursday: { open: '08:00', close: '21:00', closed: false },
  friday: { open: '08:00', close: '22:00', closed: false },
  saturday: { open: '09:00', close: '22:00', closed: false },
  sunday: { open: '10:00', close: '20:00', closed: false },
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const

interface Props {
  businessId: string
  businessSlug: string
  businessType: string
  initialData: {
    is_published?: boolean
    status_mode?: 'auto' | 'force_open' | 'force_closed'
    status_notice?: string | null
    operating_hours?: WeeklyOperatingHours | null
    event?: PopupEventConfig | null
    logo_url?: string | null
    cover_url?: string | null
    tagline?: string | null
    description?: string | null
    primary_color?: string | null
    announcement_enabled?: boolean
    announcement_text?: string | null
    whatsapp_phone?: string | null
    stall_number?: string | null
    location_zone?: string | null
    directions_landmark?: string | null
    bank_enabled?: boolean
    bank_name?: string | null
    account_number?: string | null
    account_name?: string | null
    social_instagram?: string | null
    social_tiktok?: string | null
    social_twitter?: string | null
    social_facebook?: string | null
    social_website?: string | null
    payments?: string[]
    highlights?: string[]
  }
}

export function StorefrontStudioForm({
  businessId,
  businessSlug,
  businessType,
  initialData,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const defaultHours = initialData.operating_hours || DEFAULT_WEEKLY_HOURS

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateStorefrontStudioInput>({
    resolver: zodResolver(updateStorefrontStudioSchema),
    defaultValues: {
      is_published: initialData.is_published ?? true,
      status_mode: initialData.status_mode ?? 'auto',
      status_notice: initialData.status_notice ?? '',
      operating_hours: defaultHours,
      event: {
        mode: initialData.event?.mode ?? (businessType === 'popup_vendor' ? 'one_time' : 'recurring'),
        startDate: initialData.event?.startDate ?? '',
        endDate: initialData.event?.endDate ?? '',
        liveNotice: initialData.event?.liveNotice ?? '',
        endedNotice: initialData.event?.endedNotice ?? '',
      },
      logo_url: initialData.logo_url ?? null,
      cover_url: initialData.cover_url ?? null,
      tagline: initialData.tagline ?? '',
      description: initialData.description ?? '',
      primary_color: initialData.primary_color ?? '#13ec5b',
      announcement_enabled: initialData.announcement_enabled ?? false,
      announcement_text: initialData.announcement_text ?? '',
      whatsapp_phone: initialData.whatsapp_phone ?? '',
      stall_number: initialData.stall_number ?? '',
      location_zone: initialData.location_zone ?? '',
      directions_landmark: initialData.directions_landmark ?? '',
      bank_enabled: initialData.bank_enabled ?? false,
      bank_name: initialData.bank_name ?? '',
      account_number: initialData.account_number ?? '',
      account_name: initialData.account_name ?? '',
      social_instagram: initialData.social_instagram ?? '',
      social_tiktok: initialData.social_tiktok ?? '',
      social_twitter: initialData.social_twitter ?? '',
      social_facebook: initialData.social_facebook ?? '',
      social_website: initialData.social_website ?? '',
      payments: initialData.payments ?? ['Cash', 'Bank Transfer', 'POS Card'],
      highlights: initialData.highlights ?? [],
    },
  })

  const isPublished = watch('is_published')
  const statusMode = watch('status_mode')
  const eventMode = watch('event.mode') ?? 'recurring'
  const logoUrl = watch('logo_url')
  const coverUrl = watch('cover_url')
  const selectedColor = watch('primary_color')
  const announcementEnabled = watch('announcement_enabled')
  const announcementText = watch('announcement_text') ?? ''
  const selectedHighlights = watch('highlights') ?? []
  const currentHours = (watch('operating_hours') || defaultHours) as WeeklyOperatingHours

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const resolveUrl = (path: string | null | undefined) => {
    if (!path) return null
    return path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/catalog-media/${path}`
  }

  // Handle direct file upload for Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const storagePath = `${businessId}/logo-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('catalog-media')
        .upload(storagePath, file, { contentType: file.type })

      if (uploadError) throw uploadError
      setValue('logo_url', storagePath)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Logo upload failed')
    } finally {
      setUploadingLogo(false)
    }
  }

  // Handle direct file upload for Header Cover
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const storagePath = `${businessId}/cover-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('catalog-media')
        .upload(storagePath, file, { contentType: file.type })

      if (uploadError) throw uploadError
      setValue('cover_url', storagePath)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Cover photo upload failed')
    } finally {
      setUploadingCover(false)
    }
  }

  const toggleHighlight = (id: string) => {
    const current = selectedHighlights
    const next = current.includes(id) ? current.filter((h) => h !== id) : [...current, id]
    setValue('highlights', next)
  }

  const copyMondayToAllWeekdays = () => {
    const mon = currentHours.monday || { open: '08:00', close: '21:00', closed: false }
    const updated: WeeklyOperatingHours = {
      ...currentHours,
      tuesday: { ...mon },
      wednesday: { ...mon },
      thursday: { ...mon },
      friday: { ...mon },
    }
    setValue('operating_hours', updated)
  }

  const onSubmit = (data: UpdateStorefrontStudioInput) => {
    setErrorMsg(null)
    setSaveSuccess(false)
    startTransition(async () => {
      try {
        await updateStorefrontStudio(businessId, data)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 4000)
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to save storefront settings')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-36 md:pb-24 text-slate-900">
      {errorMsg && (
        <div className="rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-800 border border-rose-200 flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-900 border border-emerald-200">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600 shrink-0" />
            <span>Storefront Studio settings saved and published successfully!</span>
          </div>
          <a
            href={`/s/${businessSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-800 hover:underline pt-1 sm:pt-0"
          >
            <span>View Public Store</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* ─── CARD 1: LIVE STATUS & PUBLISH TOGGLE ──────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              1. Live Store Status &amp; Visibility
            </h2>
          </div>
          <a
            href={`/s/${businessSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
          >
            <span>Preview</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Public Storefront Master Switch */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 sm:p-4 border border-slate-200/80">
          <div className="pr-3">
            <p className="text-xs sm:text-sm font-black text-slate-900">Publish Storefront</p>
            <p className="text-[11px] text-slate-500 font-medium leading-snug">
              When published, customers can scan QR codes and browse your live catalog.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center shrink-0 min-h-[44px]">
            <input
              type="checkbox"
              {...register('is_published')}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-[var(--lime-base)] peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-focus:outline-none" />
          </label>
        </div>

        {/* Status Override Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-black text-slate-900 block">
            Current Operating Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'auto',
                label: 'Auto (Follow Schedule)',
                desc: 'Opens & closes automatically by hours',
                badge: '🟢 Schedule',
              },
              {
                id: 'force_open',
                label: 'Force Open Now',
                desc: 'Shows Open regardless of hours',
                badge: '⚡ Live Now',
              },
              {
                id: 'force_closed',
                label: 'Temporarily Closed',
                desc: 'Sold out, kitchen break, or closed',
                badge: '🔴 Break/Closed',
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-3.5 transition-all min-h-[52px] ${
                  statusMode === opt.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  value={opt.id}
                  {...register('status_mode')}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">{opt.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusMode === opt.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {opt.badge}
                  </span>
                </div>
                <p className={`mt-1.5 text-[10px] ${statusMode === opt.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {opt.desc}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Status Notice (Optional) */}
        <div className="pt-1">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Status Note / Emergency Notice (Optional)
          </label>
          <input
            type="text"
            {...register('status_notice')}
            placeholder="e.g. Sold out for lunch! Reopening for dinner at 6:00 PM."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none min-h-[44px]"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            Displayed directly next to your Open/Closed badge on the public menu.
          </p>
        </div>
      </div>

      {/* ─── CARD 2: OPERATING SCHEDULE & POP-UP EVENTS ──────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600 shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              2. Operating Schedule &amp; Pop-Up Events
            </h2>
          </div>
          {eventMode === 'recurring' && (
            <button
              type="button"
              onClick={copyMondayToAllWeekdays}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-[10px] font-extrabold text-slate-700 hover:bg-slate-200 transition-colors min-h-[36px]"
            >
              <Copy size={11} />
              <span>Copy Mon to Weekdays</span>
            </button>
          )}
        </div>

        {/* Schedule Mode Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-900 block">
            Schedule Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all min-h-[52px] ${
                eventMode === 'recurring'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                value="recurring"
                {...register('event.mode')}
                className="sr-only"
              />
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🔄</span>
                <div>
                  <p className="text-xs font-black">Recurring Weekly Schedule</p>
                  <p className={`text-[10px] ${eventMode === 'recurring' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Permanent store or regular weekly hours
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all min-h-[52px] ${
                eventMode === 'one_time'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                value="one_time"
                {...register('event.mode')}
                className="sr-only"
              />
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎪</span>
                <div>
                  <p className="text-xs font-black">One-Time Pop-Up Event</p>
                  <p className={`text-[10px] ${eventMode === 'one_time' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Festival weekend, trade fair, or pop-up run
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* ── MODE: RECURRING WEEKLY SCHEDULE ── */}
        {eventMode === 'recurring' ? (
          <div className="divide-y divide-slate-100 pt-2">
            {DAYS.map(({ key, label }) => {
              const isClosed = watch(`operating_hours.${key}.closed`)
              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2.5"
                >
                  <div className="w-28 shrink-0 flex items-center justify-between sm:block">
                    <span className="text-xs font-black text-slate-900">{label}</span>
                    <label className="flex sm:hidden items-center gap-1.5 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 min-h-[32px]">
                      <input
                        type="checkbox"
                        {...register(`operating_hours.${key}.closed`)}
                        className="rounded text-rose-600 focus:ring-0 h-4 w-4"
                      />
                      <span className="text-[11px] font-bold text-slate-700">Closed</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    {!isClosed ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input
                          type="time"
                          {...register(`operating_hours.${key}.open`)}
                          className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-800 focus:border-slate-900 focus:outline-none min-h-[42px]"
                        />
                        <span className="text-xs font-bold text-slate-400 shrink-0">to</span>
                        <input
                          type="time"
                          {...register(`operating_hours.${key}.close`)}
                          className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-800 focus:border-slate-900 focus:outline-none min-h-[42px]"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="inline-block rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700">
                          Closed All Day
                        </span>
                      </div>
                    )}

                    <label className="hidden sm:flex items-center gap-1.5 cursor-pointer ml-auto shrink-0 min-h-[40px] px-2">
                      <input
                        type="checkbox"
                        {...register(`operating_hours.${key}.closed`)}
                        className="rounded text-rose-600 focus:ring-0 h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-600">Closed</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* ── MODE: ONE-TIME POP-UP EVENT ── */
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Event Start Date
                </label>
                <input
                  type="date"
                  {...register('event.startDate')}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Event End Date (Inclusive)
                </label>
                <input
                  type="date"
                  {...register('event.endDate')}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Live Event Notice / Stall Landmark (Optional)
              </label>
              <input
                type="text"
                {...register('event.liveNotice')}
                placeholder="e.g. Catch us at Stall #14, Trans-Amadi Food Fest!"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none min-h-[44px]"
              />
              <p className="text-[10px] text-slate-400">
                Shown alongside your Open badge while the event is live.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Event Ended Notice (Optional)
              </label>
              <textarea
                rows={2}
                {...register('event.endedNotice')}
                placeholder="e.g. Our pop-up weekend run has concluded! Thank you for stopping by. Catch us at the next edition."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                After the end date, shoppers scanning leftover flyers or standees see this message and a link to browse active venues, preventing stale catalog orders.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── CARD 3: VISUAL BRANDING & MEDIA ────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles size={16} className="text-amber-500" />
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            3. Visual Branding &amp; Media
          </h2>
        </div>

        {/* Cover Photo Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Cover Banner Photo (16:9 Aspect Ratio recommended)
          </label>
          <div className="relative aspect-[16/9] w-full max-w-lg overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
            {coverUrl ? (
              <>
                <Image
                  src={resolveUrl(coverUrl)!}
                  alt="Cover Banner"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue('cover_url', null)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white hover:bg-black min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label="Remove cover photo"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-4 text-slate-400 hover:text-slate-600 active:bg-slate-100 transition-colors">
                <Upload size={24} />
                <span className="text-xs font-bold text-center">
                  {uploadingCover ? 'Uploading cover photo...' : 'Tap to upload header banner photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="sr-only"
                  disabled={uploadingCover}
                />
              </label>
            )}
          </div>
        </div>

        {/* Logo Photo Upload */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Store Profile Logo (Square Avatar)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50">
              {logoUrl ? (
                <>
                  <Image
                    src={resolveUrl(logoUrl)!}
                    alt="Store Logo"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('logo_url', null)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 text-white hover:bg-black min-h-[30px] min-w-[30px] flex items-center justify-center"
                    aria-label="Remove logo"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Store size={28} />
                </div>
              )}
            </div>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all min-h-[44px]">
              <Upload size={14} />
              <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="sr-only"
                disabled={uploadingLogo}
              />
            </label>
          </div>
        </div>

        {/* Tagline / Motto */}
        <div className="space-y-1 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Store Slogan / Tagline (Optional)
          </label>
          <input
            type="text"
            {...register('tagline')}
            placeholder="e.g. Authentic Charcoal Grills & Chops in Ibadan"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none min-h-[44px]"
          />
        </div>

        {/* Accent Color Swatch Picker */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Brand Accent Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => setValue('primary_color', swatch.hex)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all min-h-[42px] ${
                  selectedColor === swatch.hex
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-95'
                }`}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span>{swatch.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CARD 4: LIVE ANNOUNCEMENT TICKER ───────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-amber-600 shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              4. Live Announcement Ticker
            </h2>
          </div>
          <label className="relative inline-flex cursor-pointer items-center shrink-0 min-h-[44px]">
            <input
              type="checkbox"
              {...register('announcement_enabled')}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-focus:outline-none" />
          </label>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Display a prominent alert bar at the top of your digital menu for daily promos, holiday hours, or special notices.
        </p>

        <div className="space-y-1">
          <textarea
            {...register('announcement_text')}
            rows={2}
            placeholder="e.g. Free delivery on orders over ₦15,000 today in Bodija! 🚚"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Will show as 📢 banner on storefront when enabled</span>
            <span>{announcementText.length}/180</span>
          </div>
        </div>
      </div>

      {/* ─── CARD 5: WHATSAPP & STORE PERKS ─────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone size={16} className="text-emerald-600 shrink-0" />
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            5. WhatsApp Routing &amp; Store Perks
          </h2>
        </div>

        {/* WhatsApp Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">
            Order Desk WhatsApp Number (with Country Code)
          </label>
          <div className="relative">
            <input
              type="tel"
              inputMode="tel"
              {...register('whatsapp_phone')}
              placeholder="e.g. 2348012345678 or 08012345678"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none min-h-[44px]"
            />
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            When customers tap 💬 WhatsApp Order or Inquiry buttons, messages are routed directly to this number.
          </p>
        </div>

        {/* Store Perks & Amenities */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Store Amenities &amp; Service Perks
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {HIGHLIGHT_OPTIONS.map((opt) => {
              const isSelected = selectedHighlights.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleHighlight(opt.id)}
                  className={`flex items-center gap-2 rounded-2xl border p-3 text-left transition-all min-h-[48px] active:scale-95 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base shrink-0">{opt.icon}</span>
                  <span className="text-xs font-bold truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="text-emerald-600 ml-auto shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── CARD 6: BANK TRANSFER DETAILS (PHYSICAL STALL PAYMENTS) ───────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-emerald-600 shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              6. Direct Bank Transfer &amp; Stall Payments
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('bank_enabled')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--lime-base)]" />
          </label>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Provide your bank account details for instant walk-in transfer payments at pop-up stalls or retail checkout.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Bank Name</label>
            <input
              type="text"
              {...register('bank_name')}
              placeholder="e.g. Moniepoint / GTBank / OPay"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Account Number</label>
            <input
              type="text"
              inputMode="numeric"
              {...register('account_number')}
              placeholder="e.g. 0123456789"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Account Name</label>
            <input
              type="text"
              {...register('account_name')}
              placeholder="e.g. Qarty Stores Ltd"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ─── CARD 7: STORY, SOCIALS & STALL LOCATION ───────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Store size={16} className="text-emerald-600 shrink-0" />
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            7. Our Story, Social Touchpoints &amp; Stall Info
          </h2>
        </div>

        {/* Business Story / Bio */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">
            Our Story / Business Bio
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Tell customers about your craftsmanship, recipes, or story (e.g. Handcrafted pastries in Ibadan since 2022...)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Stall & Event Zone Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Stall / Booth Number</label>
            <input
              type="text"
              {...register('stall_number')}
              placeholder="e.g. Stall #A-14"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Event Zone / Hall</label>
            <input
              type="text"
              {...register('location_zone')}
              placeholder="e.g. Food Court / Zone B"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Social Touchpoints */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Social Touchpoints &amp; Website
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              {...register('social_instagram')}
              placeholder="Instagram (e.g. @qarty_ng)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              {...register('social_tiktok')}
              placeholder="TikTok (e.g. @qarty_ng)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              {...register('social_twitter')}
              placeholder="X / Twitter (e.g. @qarty_ng)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              {...register('social_website')}
              placeholder="Website URL (e.g. www.qarty.ng)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-16 md:bottom-6 left-0 right-0 mx-auto z-40 w-full max-w-3xl px-4 pointer-events-none">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl pointer-events-auto">
          <div className="hidden sm:block">
            <p className="text-xs font-black text-slate-900">Live Storefront Studio</p>
            <p className="text-[10px] text-slate-500">Changes reflect instantly when customers scan your QR codes.</p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 sm:px-8 py-3.5 text-xs font-black text-black shadow-lg shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 transition-all disabled:opacity-60 min-h-[48px]"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publishing Updates...</span>
              </>
            ) : (
              <>
                <Check size={16} strokeWidth={3} />
                <span>Save &amp; Publish Storefront</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
