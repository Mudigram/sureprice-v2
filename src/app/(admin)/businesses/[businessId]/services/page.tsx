import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Plus, Scissors, Clock, ShieldCheck, Sparkles, Edit3 } from 'lucide-react'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessByIdForAdmin } from '@/features/businesses/queries'
import { getAdminServices } from '@/features/bookings/queries'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Services & Bookings | Qarty Admin',
  description: 'Manage bookable services, treatment durations, deposits, and add-on menus.',
}

export default async function ServicesAdminPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const business = await getBusinessByIdForAdmin(businessId)
  if (!business) notFound()

  const services = await getAdminServices(businessId)

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Business Admin Navigation Bar */}
      <BusinessAdminNav business={business} currentSection="services" />

      {/* Services List Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Services Menu</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                {services.length}
              </span>
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Configure treatments, duration, deposit policies, and add-ons for {business.name}.
            </p>
          </div>

          <Link
            href={`/businesses/${businessId}/services/new`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all shrink-0"
          >
            <Plus size={16} className="text-emerald-400" />
            <span>Add New Service</span>
          </Link>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 mb-3">
              <Scissors size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No services added yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto dark:text-slate-400">
              Set up your services (e.g. Gel Nails, Hair Cut, Lash Extensions, Tattoo Session) so customers can book directly from your storefront.
            </p>
            <div className="mt-5">
              <Link
                href={`/businesses/${businessId}/services/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all"
              >
                <Plus size={14} className="text-emerald-400" />
                <span>Create First Service</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 overflow-hidden relative border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700">
                        {service.image_url ? (
                          <Image
                            src={service.image_url}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Scissors size={22} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {service.name}
                        </h4>
                        <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                          {formatNaira(service.price)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        service.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  {service.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
                      {service.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      <Clock size={12} />
                      {service.duration_minutes} mins
                      {service.buffer_minutes > 0 && ` (+${service.buffer_minutes}m buffer)`}
                    </span>

                    {service.requires_deposit && (
                      <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-1 rounded-lg border border-amber-200/60 dark:border-amber-900">
                        <ShieldCheck size={12} />
                        Deposit: {formatNaira(service.deposit_amount || 0)}
                      </span>
                    )}

                    {service.addons && service.addons.length > 0 && (
                      <span className="flex items-center gap-1 font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-1 rounded-lg">
                        <Sparkles size={12} />
                        {service.addons.length} Add-on{service.addons.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Link
                    href={`/businesses/${businessId}/services/${service.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Edit3 size={13} />
                    <span>Edit Service & Add-ons</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
