'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, UserPlus, ShieldCheck, Briefcase, MapPin, Loader2, Plus, AlertCircle } from 'lucide-react'
import { assignRoleSchema, type AssignRoleInput, type AssignRoleOutput } from '../schemas'
import type { ScopeOption } from '../types'
import { assignRoleAction } from '../actions'

interface AssignRoleModalProps {
  isOpen: boolean
  onClose: () => void
  scopeOptions: ScopeOption[]
}

export function AssignRoleModal({ isOpen, onClose, scopeOptions }: AssignRoleModalProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AssignRoleInput>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      email: '',
      role: 'admin',
      scope_type: 'business',
      scope_id: scopeOptions[0]?.scopeId ?? '',
    },
  })

  const selectedRole = watch('role')

  // Filter scope options based on selected role (Admin = business scope, Manager = location scope)
  const filteredScopeOptions = scopeOptions.filter((opt) =>
    selectedRole === 'admin' ? opt.scopeType === 'business' : opt.scopeType === 'location'
  )

  const handleRoleChange = (newRole: 'admin' | 'manager') => {
    const nextScopeType = newRole === 'admin' ? 'business' : 'location'
    setValue('role', newRole)
    setValue('scope_type', nextScopeType)

    const firstMatchingOption = scopeOptions.find((opt) => opt.scopeType === nextScopeType)
    if (firstMatchingOption) {
      setValue('scope_id', firstMatchingOption.scopeId)
    }
  }

  const onSubmit = async (data: AssignRoleInput) => {
    setIsSubmitting(true)
    setServerError(null)

    // Explicit cast at the onSubmit boundary per architectural rules
    const payload = data as AssignRoleOutput
    const res = await assignRoleAction(payload)

    setIsSubmitting(false)

    if (res.success) {
      reset()
      onClose()
    } else {
      setServerError(res.error)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-role-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl space-y-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black font-black">
              <UserPlus size={18} />
            </div>
            <h3 id="assign-role-modal-title" className="text-lg font-black tracking-tight text-white">
              Assign Team Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {serverError && (
          <div className="flex items-start gap-2 rounded-2xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs font-bold text-red-300">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="team-email-input" className="text-xs font-extrabold text-slate-300">
              User Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. manager@store.ng"
              {...register('email')}
              id="team-email-input"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-xs font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:border-[var(--lime-base)] transition-colors"
            />
            {errors.email && (
              <p className="text-xs font-bold text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selector Cards */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">
              Role & Access Privileges
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="role-select-admin"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                  selectedRole === 'admin'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-200 shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Briefcase size={14} className={selectedRole === 'admin' ? 'text-blue-400' : ''} />
                  <span>Business Admin</span>
                </div>
                <span className="text-xs opacity-75 font-medium">Full business catalog & store scope</span>
              </button>

              <button
                type="button"
                id="role-select-manager"
                onClick={() => handleRoleChange('manager')}
                className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                  selectedRole === 'manager'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <MapPin size={14} className={selectedRole === 'manager' ? 'text-emerald-400' : ''} />
                  <span>Location Manager</span>
                </div>
                <span className="text-xs opacity-75 font-medium">Scoped single store location</span>
              </button>
            </div>
          </div>

          {/* Scope Select Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="team-scope-select" className="text-xs font-extrabold text-slate-300">
              Assigned Scope Target
            </label>
            {filteredScopeOptions.length === 0 ? (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-4 text-xs text-amber-200 space-y-2">
                <p className="font-bold">No physical locations available for manager scope.</p>
                <Link
                  href="/locations/new"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-black text-[var(--lime-base)] hover:underline"
                >
                  <Plus size={14} />
                  <span>+ Create Store Location First</span>
                </Link>
              </div>
            ) : (
              <select
                {...register('scope_id')}
                id="team-scope-select"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-xs font-semibold text-white focus:outline-none focus:border-[var(--lime-base)] transition-colors"
              >
                {filteredScopeOptions.map((opt) => (
                  <option key={opt.scopeId} value={opt.scopeId} className="bg-slate-900 text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
            )}
            {errors.scope_id && (
              <p className="text-xs font-bold text-red-400">{errors.scope_id.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 py-3.5 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || filteredScopeOptions.length === 0}
              id="confirm-assign-role-btn"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Assign Access</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
