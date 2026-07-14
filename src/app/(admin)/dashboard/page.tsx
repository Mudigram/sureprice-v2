import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getOwnerOrganizationId } from '@/features/organizations/queries'
import { getBusinessesForOrg } from '@/features/businesses/queries'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const orgId = await getOwnerOrganizationId(user.id)
  if (!orgId) redirect('/no-access')

  const businesses = await getBusinessesForOrg(orgId)

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Your Businesses</h1>
        <Link
          href={`/businesses/new?organization_id=${orgId}`}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New Business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <p className="text-muted-foreground">No businesses yet. Create your first one to get started.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {businesses.map((b) => (
            <Link
              key={b.id}
              href={`/businesses/${b.id}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-ring"
            >
              <p className="font-medium text-card-foreground">{b.name}</p>
              <p className="text-sm capitalize text-muted-foreground">{b.business_type.replace('_', ' ')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}