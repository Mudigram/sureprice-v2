import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Store } from 'lucide-react'
import { requireOrgAccess } from '@/lib/auth/require-access'
import { BusinessForm } from '@/features/businesses/components/business-form'

export const metadata: Metadata = {
  title: 'Register New Store Business — SurePrice Admin',
  description: 'Register a physical supermarket, dining restaurant, café, or event pop-up store.',
}

export default async function NewBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ organization_id?: string }>
}) {
  const { organization_id } = await searchParams
  if (!organization_id) redirect('/dashboard')

  await requireOrgAccess(organization_id)

  return (
    <div className="mx-auto max-w-lg p-6 sm:p-8 space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black">
            <Store size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Register Store Business</h1>
            <p className="text-xs text-slate-400">Set up your physical venue and price tag network.</p>
          </div>
        </div>
      </div>

      <BusinessForm organizationId={organization_id} />
    </div>
  )
}