import { createClient } from '@/lib/supabase/server'
import type { RoleAssignment, Role, ScopeType } from './types'

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

/**
 * Resolves where a user should land after login.
 *
 * Priority: owner > admin > manager. If a user somehow holds multiple
 * assignments of the same role (e.g. admin on two businesses), we take
 * the first — the current plan assumes one scope per role per user.
 * Revisit if multi-business admins become a real case.
 */
export function resolveRedirectPath(assignments: RoleAssignment[]): string {
  const owner = assignments.find((a) => a.role === 'owner' && a.scope_type === 'organization')
  if (owner) return '/dashboard'

  const admin = assignments.find((a) => a.role === 'admin' && a.scope_type === 'business')
  if (admin) return `/businesses/${admin.scope_id}`

  const manager = assignments.find((a) => a.role === 'manager' && a.scope_type === 'location')
  if (manager) return `/locations/${manager.scope_id}`

  return '/no-access'
}