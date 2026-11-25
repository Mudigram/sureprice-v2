import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessByIdForAdmin } from '@/features/businesses/queries'
import { ServiceForm } from '@/features/bookings/components/service-form'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Add New Service | Qarty Admin',
  description: 'Create a new bookable service for your business.',
}

export default async function NewServicePage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const business = await getBusinessByIdForAdmin(businessId)
  if (!business) notFound()

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      <BusinessAdminNav business={business} currentSection="services" />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Create New Service
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Define the price, appointment duration, buffer time, and deposit terms.
            </p>
          </div>

          <Link
            href={`/businesses/${businessId}/services`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Services</span>
          </Link>
        </div>

        <ServiceForm businessId={businessId} />
      </div>
    </div>
  )
}
