import { createClient } from '@/lib/supabase/server'
import type { RoleAssignment, Role, ScopeType, TeamMember, ScopeOption } from './types'

const VALID_ROLES: Role[] = ['owner', 'admin', 'manager']
const VALID_SCOPE_TYPES: ScopeType[] = ['organization', 'business', 'location']

function toRoleAssignment(row: { role: string; scope_type: string; scope_id: string }): RoleAssignment {
  if (!VALID_ROLES.includes(row.role as Role)) {
    throw new Error(`Unexpected role_assignments.role value: "${row.role}"`)
  }
  if (!VALID_SCOPE_TYPES.includes(row.scope_type as ScopeType)) {
    throw new Error(`Unexpected role_assignments.scope_type value: "${row.scope_type}"`)
  }
  return {
    role: row.role as Role,
    scope_type: row.scope_type as ScopeType,
    scope_id: row.scope_id,
  }
}

export async function getUserRoleAssignments(userId: string): Promise<RoleAssignment[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('role_assignments')
    .select('role, scope_type, scope_id')
    .eq('user_id', userId)

  if (error) throw error
  return (data ?? []).map(toRoleAssignment)
}

export function resolveRedirectPath(assignments: RoleAssignment[]): string {
  const owner = assignments.find((a) => a.role === 'owner' && a.scope_type === 'organization')
  if (owner) return '/dashboard'

  const admin = assignments.find((a) => a.role === 'admin' && a.scope_type === 'business')
  if (admin) return `/businesses/${admin.scope_id}`

  const manager = assignments.find((a) => a.role === 'manager' && a.scope_type === 'location')
  if (manager) return `/locations/${manager.scope_id}`

  return '/no-access'
}

/**
 * Fetches all team members assigned across an entire organization (businesses & locations).
 */
export async function getTeamMembersForOrg(orgId: string): Promise<TeamMember[]> {
  const supabase = await createClient()

  // 1. Fetch businesses in the org
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('organization_id', orgId)

  const businessIds = (businesses ?? []).map((b) => b.id)
  const businessMap = new Map((businesses ?? []).map((b) => [b.id, b.name]))

  // 2. Fetch locations in those businesses
  const { data: locations } = businessIds.length > 0
    ? await supabase.from('locations').select('id, name, business_id').in('business_id', businessIds)
    : { data: [] }

  const locationIds = (locations ?? []).map((l) => l.id)
  const locationMap = new Map((locations ?? []).map((l) => [l.id, l.name]))

  // 3. Fetch role assignments for org, businesses, or locations
  const { data: assignments, error } = await supabase
    .from('role_assignments')
    .select('id, user_id, role, scope_type, scope_id, created_at')
    .or(`and(scope_type.eq.organization,scope_id.eq.${orgId}),and(scope_type.eq.business,scope_id.in.(${businessIds.join(',') || '00000000-0000-0000-0000-000000000000'})),and(scope_type.eq.location,scope_id.in.(${locationIds.join(',') || '00000000-0000-0000-0000-000000000000'}))`)

  if (error) throw error
  if (!assignments || assignments.length === 0) return []

  return assignments.map((row) => {
    let scopeName = 'Organization'
    if (row.scope_type === 'business') {
      scopeName = businessMap.get(row.scope_id) ?? 'Business'
    } else if (row.scope_type === 'location') {
      scopeName = locationMap.get(row.scope_id) ?? 'Location'
    }

    return {
      id: row.id,
      userId: row.user_id,
      userEmail: `user-${row.user_id.slice(0, 8)}@sureprice.ng`, // Fallback display email from user_id
      role: row.role as Role,
      scopeType: row.scope_type as ScopeType,
      scopeId: row.scope_id,
      scopeName,
      createdAt: row.created_at,
    }
  })
}

/**
 * Fetches team members (admins & managers) for a specific business and its locations.
 */
export async function getTeamMembersForBusiness(businessId: string): Promise<TeamMember[]> {
  const supabase = await createClient()

  // 1. Fetch business name
  const { data: biz } = await supabase
    .from('businesses')
    .select('name')
    .eq('id', businessId)
    .single()

  const bizName = biz?.name ?? 'Business'

  // 2. Fetch locations
  const { data: locations } = await supabase
    .from('locations')
    .select('id, name')
    .eq('business_id', businessId)

  const locationIds = (locations ?? []).map((l) => l.id)
  const locationMap = new Map((locations ?? []).map((l) => [l.id, l.name]))

  // 3. Fetch role assignments
  const { data: assignments, error } = await supabase
    .from('role_assignments')
    .select('id, user_id, role, scope_type, scope_id, created_at')
    .or(`and(scope_type.eq.business,scope_id.eq.${businessId}),and(scope_type.eq.location,scope_id.in.(${locationIds.join(',') || '00000000-0000-0000-0000-000000000000'}))`)

  if (error) throw error
  if (!assignments || assignments.length === 0) return []

  return assignments.map((row) => {
    const scopeName = row.scope_type === 'business'
      ? bizName
      : locationMap.get(row.scope_id) ?? 'Location'

    return {
      id: row.id,
      userId: row.user_id,
      userEmail: `user-${row.user_id.slice(0, 8)}@sureprice.ng`,
      role: row.role as Role,
      scopeType: row.scope_type as ScopeType,
      scopeId: row.scope_id,
      scopeName,
      createdAt: row.created_at,
    }
  })
}

/**
 * Fetches scope options (businesses & locations) available for role assignment in an organization.
 */
export async function getScopeOptionsForOrg(orgId: string): Promise<ScopeOption[]> {
  const supabase = await createClient()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('organization_id', orgId)
    .order('name', { ascending: true })

  const bizIds = (businesses ?? []).map((b) => b.id)

  const { data: locations } = bizIds.length > 0
    ? await supabase
        .from('locations')
        .select('id, name, business_id')
        .in('business_id', bizIds)
        .order('name', { ascending: true })
    : { data: [] }

  const options: ScopeOption[] = []

  // Business options (for Admin role)
  for (const b of businesses ?? []) {
    options.push({
      scopeId: b.id,
      scopeType: 'business',
      name: `Business: ${b.name}`,
    })
  }

  // Location options (for Manager role)
  for (const l of locations ?? []) {
    const parentBiz = (businesses ?? []).find((b) => b.id === l.business_id)
    options.push({
      scopeId: l.id,
      scopeType: 'location',
      name: `Location: ${l.name}${parentBiz ? ` (${parentBiz.name})` : ''}`,
    })
  }

  return options
}