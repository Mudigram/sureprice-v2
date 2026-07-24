'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserPlus, Users, ArrowLeft } from 'lucide-react'
import type { TeamMember, ScopeOption } from '@/features/role-assignments/types'
import { TeamMemberList } from '@/features/role-assignments/components/team-member-list'
import { AssignRoleModal } from '@/features/role-assignments/components/assign-role-modal'

interface BusinessTeamClientProps {
  businessId: string
  businessName: string
  teamMembers: TeamMember[]
  scopeOptions: ScopeOption[]
}

export function BusinessTeamClient({
  businessId,
  businessName,
  teamMembers,
  scopeOptions,
}: BusinessTeamClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/businesses/${businessId}`}
            className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400"
          >
            <ArrowLeft size={14} />
            <span>Back to {businessName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
                {businessName} — Team Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Manage business admins and location managers for this store.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          id="open-assign-modal-btn"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-5 py-3 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 transition-transform active:scale-95"
        >
          <UserPlus size={16} />
          <span>Assign Role</span>
        </button>
      </div>

      {/* Team Member List */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Assigned Store Admins & Managers
        </h2>
        <TeamMemberList members={teamMembers} canManage={true} />
      </div>

      {/* Assign Role Modal */}
      <AssignRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scopeOptions={scopeOptions}
      />
    </div>
  )
}
