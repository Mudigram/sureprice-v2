'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, UserPlus, ShieldCheck, Briefcase, MapPin, Loader2 } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black">
              <UserPlus size={18} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">
              Assign Team Member
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100"
          >
            <X size={20} />
          </button>
        </div>

        {serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
              User Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. manager@store.ng"
              {...register('email')}
              id="team-email-input"
              className="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--lime-base)] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            />
            {errors.email && (
              <p className="text-[11px] font-bold text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selector Cards */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
              Role & Access Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="role-select-admin"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  selectedRole === 'admin'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-200'
                    : 'border-gray-100 bg-slate-50 text-slate-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Briefcase size={14} />
                  <span>Business Admin</span>
                </div>
                <span className="text-[10px] opacity-80">Full catalog & business scope</span>
              </button>

              <button
                type="button"
                id="role-select-manager"
                onClick={() => handleRoleChange('manager')}
                className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  selectedRole === 'manager'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200'
                    : 'border-gray-100 bg-slate-50 text-slate-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <MapPin size={14} />
                  <span>Location Manager</span>
                </div>
                <span className="text-[10px] opacity-80">Specific store location scope</span>
              </button>
            </div>
          </div>

          {/* Scope Select Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
              Assigned Scope Target
            </label>
            {filteredScopeOptions.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                No matching {selectedRole === 'admin' ? 'businesses' : 'locations'} available to assign.
              </div>
            ) : (
              <select
                {...register('scope_id')}
                id="team-scope-select"
                className="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--lime-base)] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {filteredScopeOptions.map((opt) => (
                  <option key={opt.scopeId} value={opt.scopeId}>
                    {opt.name}
                  </option>
                ))}
              </select>
            )}
            {errors.scope_id && (
              <p className="text-[11px] font-bold text-red-500">{errors.scope_id.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-slate-600 dark:border-zinc-800 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || filteredScopeOptions.length === 0}
              id="confirm-assign-role-btn"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 disabled:opacity-50"
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
