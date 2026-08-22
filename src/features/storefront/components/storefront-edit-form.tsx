'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X, Check, Image as ImageIcon, Sparkles, Store, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateStorefrontBrandingSchema, HIGHLIGHT_OPTIONS, type UpdateStorefrontBrandingInput } from '../schema'
import { updateStorefrontBranding } from '../actions'

const COLOR_SWATCHES = [
  { name: 'Lime (Default)', hex: '#13ec5b' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Crimson Red', hex: '#e11d48' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Royal Indigo', hex: '#6366f1' },
  { name: 'Dark Slate', hex: '#18181b' },
]

interface Props {
  businessId: string
  initialData: {
    is_published?: boolean
    logo_url?: string | null
    cover_url?: string | null
    tagline?: string | null
    primary_color?: string | null
    highlights?: string[]
  }
}

export function StorefrontEditForm({ businessId, initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateStorefrontBrandingInput>({
    resolver: zodResolver(updateStorefrontBrandingSchema),
    defaultValues: {
      is_published: initialData.is_published ?? true,
      logo_url: initialData.logo_url ?? null,
      cover_url: initialData.cover_url ?? null,
      tagline: initialData.tagline ?? '',
      primary_color: initialData.primary_color ?? '#13ec5b',
      highlights: initialData.highlights ?? [],
    },
  })

  const logoUrl = watch('logo_url')
  const coverUrl = watch('cover_url')
  const selectedColor = watch('primary_color')
  const selectedHighlights = watch('highlights') ?? []

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

  const onSubmit = (data: UpdateStorefrontBrandingInput) => {
    setErrorMsg(null)
    setSaveSuccess(false)
    startTransition(async () => {
      try {
        await updateStorefrontBranding(businessId, data)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to save storefront settings')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 p-3.5 text-xs font-bold text-destructive border border-destructive/20">
          {errorMsg}
        </div>
      )}

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
          <Check size={16} />
          Storefront branding and settings saved successfully!
        </div>
      )}

      {/* Published Status Toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div>
          <p className="text-sm font-bold text-foreground flex items-center gap-2">
            <Store size={16} className="text-muted-foreground" />
            Public Storefront Status
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            When published, customers can scan table QR tags and view verified prices.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register('is_published')}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--lime-base)]" />
        </label>
      </div>

      {/* Header Cover Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">Header Cover Banner Photo</label>
        <p className="text-xs text-muted-foreground">
          Upload a wide photo of your restaurant dining room, bar, or signature dish.
        </p>

        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40 transition-all">
          {coverUrl ? (
            <>
              <Image
                src={resolveUrl(coverUrl)!}
                alt="Header Cover Banner"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setValue('cover_url', null)}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-md hover:bg-red-600 transition-all"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-4 text-center hover:bg-muted/70 transition-all">
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
              <span className="text-xs font-bold text-foreground">
                {uploadingCover ? 'Uploading Cover Banner…' : 'Click to Upload Cover Photo'}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">JPG or PNG (Recommended 1200x400)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={uploadingCover}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Logo Avatar Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">Restaurant Logo</label>
        <p className="text-xs text-muted-foreground">
          Displayed in a circular avatar badge next to your store name.
        </p>

        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted flex items-center justify-center shadow-sm">
            {logoUrl ? (
              <>
                <Image
                  src={resolveUrl(logoUrl)!}
                  alt="Restaurant Logo"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue('logo_url', null)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 text-white transition-opacity"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <Store className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-bold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-all">
            <Upload size={14} />
            {uploadingLogo ? 'Uploading Logo…' : 'Upload Logo'}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Tagline / Slogan */}
      <div className="space-y-1">
        <label className="block text-sm font-bold text-foreground">Tagline / Slogan</label>
        <input
          {...register('tagline')}
          placeholder="e.g. Authentic Wood-Fired Grill & Artisan Cocktails"
          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.tagline && <p className="text-xs text-destructive mt-1">{errors.tagline.message}</p>}
      </div>

      {/* Highlight Badges Multi-select */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">Restaurant Amenity Badges</label>
        <p className="text-xs text-muted-foreground">
          Select features to highlight on your digital menu header.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {HIGHLIGHT_OPTIONS.map((opt) => {
            const isSelected = selectedHighlights.includes(opt.id)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleHighlight(opt.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 border ${
                  isSelected
                    ? 'border-[var(--lime-base)] bg-[var(--lime-base)]/15 text-foreground shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-gray-300'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
                {isSelected && <Check size={12} className="text-[var(--lime-dark)]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Brand Accent Color Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">Primary Brand Accent Color</label>
        <div className="flex flex-wrap items-center gap-3">
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected = selectedColor === swatch.hex
            return (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => setValue('primary_color', swatch.hex)}
                className={`flex items-center gap-2 rounded-xl border p-2 text-xs font-bold transition-all ${
                  isSelected ? 'border-foreground bg-accent' : 'border-border bg-card hover:border-gray-300'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span>{swatch.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || uploadingLogo || uploadingCover}
        className="w-full rounded-2xl bg-[var(--lime-base)] py-3.5 text-sm font-black text-black shadow-lg shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50"
      >
        {isPending ? 'Saving Settings…' : 'Save Storefront Branding'}
      </button>
    </form>
  )
}
