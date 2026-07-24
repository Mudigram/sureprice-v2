'use client'

import { useState } from 'react'
import { Crown, Briefcase, MapPin, Trash2, UserCheck, ShieldAlert, Mail } from 'lucide-react'
import type { TeamMember } from '../types'
import { revokeRoleAction } from '../actions'

interface TeamMemberListProps {
  members: TeamMember[]
  canManage?: boolean
}

export function TeamMemberList({ members, canManage = true }: TeamMemberListProps) {
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this team member access?')) return
    setRevokingId(id)
    setErrorMsg(null)

    const res = await revokeRoleAction({ role_assignment_id: id })
    setRevokingId(null)

    if (!res.success) {
      setErrorMsg(res.error)
    }
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-12 text-center dark:border-zinc-800">
        <UserCheck size={36} className="text-slate-400" />
        <p className="mt-3 text-base font-extrabold text-slate-900 dark:text-zinc-100">No team members assigned</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-zinc-400">
          Assign business admins or location managers to delegate store management.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <ShieldAlert size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800/60">
        {members.map((member) => {
          const isOwner = member.role === 'owner'
          const isAdmin = member.role === 'admin'

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30"
            >
              {/* Left: User Icon & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white ${
                    isOwner
                      ? 'bg-amber-500 shadow-amber-500/20'
                      : isAdmin
                      ? 'bg-blue-600 shadow-blue-600/20'
                      : 'bg-emerald-600 shadow-emerald-600/20'
                  } shadow-md`}
                >
                  {isOwner ? (
                    <Crown size={20} />
                  ) : isAdmin ? (
                    <Briefcase size={20} />
                  ) : (
                    <MapPin size={20} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-black text-slate-900 dark:text-zinc-100">
                      {member.userEmail}
                    </p>

                    {/* Role Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        isOwner
                          ? 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                          : isAdmin
                          ? 'bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {isOwner ? 'Owner' : isAdmin ? 'Business Admin' : 'Location Manager'}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    Scope: <span className="font-bold text-slate-700 dark:text-zinc-300">{member.scopeName}</span>
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              {canManage && !isOwner && (
                <button
                  type="button"
                  id={`revoke-btn-${member.id}`}
                  disabled={revokingId === member.id}
                  onClick={() => handleRevoke(member.id)}
                  title="Revoke Role Access"
                  className="shrink-0 text-slate-300 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
