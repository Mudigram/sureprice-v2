'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  serviceSchema,
  type ServiceFormValues,
  type ServiceInput,
} from '../schema'
import { createService, updateService, createServiceAddon, deleteServiceAddon } from '../actions'
import type { Service } from '../types'
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  DollarSign,
  ArrowRight,
  Info,
} from 'lucide-react'

interface ServiceFormProps {
  businessId: string
  initialData?: Service | null
}

export function ServiceForm({ businessId, initialData }: ServiceFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Add-on state for existing service
  const [addons, setAddons] = useState(initialData?.addons || [])
  const [newAddonName, setNewAddonName] = useState('')
  const [newAddonPrice, setNewAddonPrice] = useState('')
  const [newAddonDuration, setNewAddonDuration] = useState('15')
  const [addingAddon, setAddingAddon] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      business_id: businessId,
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price ? String(initialData.price) : '',
      duration_minutes: initialData?.duration_minutes ? String(initialData.duration_minutes) : '60',
      buffer_minutes: initialData?.buffer_minutes ? String(initialData.buffer_minutes) : '15',
      requires_deposit: initialData?.requires_deposit || false,
      deposit_amount: initialData?.deposit_amount ? String(initialData.deposit_amount) : '5000',
      sort_order: initialData?.sort_order ? String(initialData.sort_order) : '0',
    },
  })

  const watchRequiresDeposit = watch('requires_deposit')

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)

      const payload = values as unknown as ServiceInput

      if (initialData?.id) {
        await updateService(initialData.id, businessId, {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          duration_minutes: payload.duration_minutes,
          buffer_minutes: payload.buffer_minutes,
          requires_deposit: payload.requires_deposit,
          deposit_amount: payload.deposit_amount,
          sort_order: payload.sort_order,
          status: initialData.status,
        })
      } else {
        await createService(payload)
      }

      router.push(`/businesses/${businessId}/services`)
      router.refresh()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save service')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddAddon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddonName.trim() || !newAddonPrice || !initialData?.id) return

    try {
      setAddingAddon(true)
      const res = await createServiceAddon({
        business_id: businessId,
        service_id: initialData.id,
        name: newAddonName.trim(),
        price: Number(newAddonPrice),
        duration_minutes: Number(newAddonDuration) || 0,
        is_active: true,
      })

      setAddons((prev) => [
        ...prev,
        {
          id: res.id,
          business_id: businessId,
          service_id: initialData.id,
          name: newAddonName.trim(),
          price: Number(newAddonPrice),
          duration_minutes: Number(newAddonDuration) || 0,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])

      setNewAddonName('')
      setNewAddonPrice('')
      setNewAddonDuration('15')
    } catch (err: any) {
      alert(err.message || 'Failed to create add-on')
    } finally {
      setAddingAddon(false)
    }
  }

  const handleDeleteAddon = async (addonId: string) => {
    try {
      await deleteServiceAddon(addonId, businessId)
      setAddons((prev) => prev.filter((a) => a.id !== addonId))
    } catch (err: any) {
      alert(err.message || 'Failed to remove add-on')
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* 1. Basic Details */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            Service Details
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Gel-X Extensions, Ombré Brow Tint, Flash Tattoo 3x3"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('price')}
                placeholder="15000"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.price && (
                <p className="mt-1 text-[11px] text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                {...register('sort_order')}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description &amp; Client Instructions
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Include what's included, style options, and prep rules (e.g. Come with clean bare nails, no oils)."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* 2. Timing & Slot Rules */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            Duration &amp; Slot Spacing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Appointment Duration (Minutes)
              </label>
              <select
                {...register('duration_minutes')}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="15">15 mins (Quick fix / consultation)</option>
                <option value="30">30 mins (Express / clean-up)</option>
                <option value="45">45 mins</option>
                <option value="60">1 hr (Standard)</option>
                <option value="90">1 hr 30 mins (Full set / refill)</option>
                <option value="120">2 hrs (Detailed set / tattoo)</option>
                <option value="150">2 hrs 30 mins</option>
                <option value="180">3 hrs (Complex art / mega lashes)</option>
                <option value="240">4 hrs (Large custom tattoo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Buffer Time (Clean-up &amp; Prep)
              </label>
              <select
                {...register('buffer_minutes')}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="0">0 mins (Back to back)</option>
                <option value="10">10 mins</option>
                <option value="15">15 mins (Recommended)</option>
                <option value="20">20 mins</option>
                <option value="30">30 mins</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Next client appointment slot will automatically open after duration + buffer time.
          </p>
        </div>

        {/* 3. Deposit & Commitment Fee */}
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" />
              Slot Reservation Deposit
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('requires_deposit')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600">
            Require clients to transfer a commitment deposit to lock in their slot and reduce no-shows.
          </p>

          {watchRequiresDeposit && (
            <div className="pt-2 border-t border-emerald-200/60">
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                Deposit Amount (₦)
              </label>
              <input
                type="number"
                {...register('deposit_amount')}
                placeholder="5000"
                className="w-full sm:w-48 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            <span>{initialData?.id ? 'Update Service' : 'Save Service'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>

      {/* 4. Add-Ons Management (Shown when editing a service) */}
      {initialData?.id && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-sm">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus size={16} className="text-purple-600" />
              Service Add-ons &amp; Upsells
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Extra options clients can check when booking (e.g. French tip, soak-off, nail charms, extra length).
            </p>
          </div>

          {/* Add-on Creation Form */}
          <form
            onSubmit={handleAddAddon}
            className="flex flex-col sm:flex-row items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80"
          >
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Add-on Name
              </label>
              <input
                type="text"
                value={newAddonName}
                onChange={(e) => setNewAddonName(e.target.value)}
                placeholder="e.g. Soak Off, French Tips"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
              />
            </div>

            <div className="w-full sm:w-28">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Extra (₦)
              </label>
              <input
                type="number"
                value={newAddonPrice}
                onChange={(e) => setNewAddonPrice(e.target.value)}
                placeholder="2000"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
              />
            </div>

            <div className="w-full sm:w-24">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Extra Mins
              </label>
              <input
                type="number"
                value={newAddonDuration}
                onChange={(e) => setNewAddonDuration(e.target.value)}
                placeholder="15"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={addingAddon || !newAddonName || !newAddonPrice}
              className="w-full sm:w-auto rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Add
            </button>
          </form>

          {/* Existing Add-on list */}
          <div className="space-y-2 pt-2">
            {addons.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No add-ons created yet for this service.</p>
            ) : (
              addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{addon.name}</span>
                    <span className="text-slate-500 font-mono">+₦{addon.price.toLocaleString()}</span>
                    {addon.duration_minutes > 0 && (
                      <span className="text-[10px] text-slate-400">+{addon.duration_minutes}m</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddon(addon.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
