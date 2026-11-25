import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessByIdForAdmin } from '@/features/businesses/queries'
import { getServiceById } from '@/features/bookings/queries'
import { ServiceForm } from '@/features/bookings/components/service-form'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Edit Service | Qarty Admin',
  description: 'Update service details, pricing, deposit, and add-ons.',
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ businessId: string; serviceId: string }>
}) {
  const { businessId, serviceId } = await params
  await requireBusinessManage(businessId)

  const business = await getBusinessByIdForAdmin(businessId)
  if (!business) notFound()

  const service = await getServiceById(serviceId, businessId)
  if (!service) notFound()

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      <BusinessAdminNav business={business} currentSection="services" />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Edit Service: {service.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Update pricing, duration, deposit settings, or add extra options.
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

        <ServiceForm businessId={businessId} initialData={service} />
      </div>
    </div>
  )
}
