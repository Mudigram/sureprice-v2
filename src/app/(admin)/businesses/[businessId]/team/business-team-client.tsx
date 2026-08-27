'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserPlus, Users } from 'lucide-react'
import type { TeamMember, ScopeOption } from '@/features/role-assignments/types'
import type { StorefrontBusiness } from '@/features/storefront/types'
import { TeamMemberList } from '@/features/role-assignments/components/team-member-list'
import { AssignRoleModal } from '@/features/role-assignments/components/assign-role-modal'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

interface BusinessTeamClientProps {
  business: StorefrontBusiness
  teamMembers: TeamMember[]
  scopeOptions: ScopeOption[]
}

export function BusinessTeamClient({
  business,
  teamMembers,
  scopeOptions,
}: BusinessTeamClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Store Admin Header Navigation Bar */}
      <BusinessAdminNav business={business} currentSection="team" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {business.name} — Store Team & Roles
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage store admins, floor managers, and cashiers for this business.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          id="open-assign-modal-btn"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-5 py-3 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <UserPlus size={16} />
          <span>Assign Role</span>
        </button>
      </div>

      {/* Team Member List */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Assigned Store Admins & Managers ({teamMembers.length})
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
