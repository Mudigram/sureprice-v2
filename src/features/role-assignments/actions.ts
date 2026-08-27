'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assignRoleSchema, revokeRoleSchema, type AssignRoleInput, type RevokeRoleInput } from './schemas'

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

/**
 * Server action to assign a role to a user at business or location scope.
 * Accepts typed input object, re-validates server-side with assignRoleSchema.parse().
 */
export async function assignRoleAction(input: AssignRoleInput): Promise<ActionResult> {
  try {
    const validated = assignRoleSchema.parse(input)
    const supabase = await createClient()

    // Get current authenticated user
    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !currentUser) {
      return { success: false, error: 'Unauthorized: Please log in to assign roles' }
    }

    // Verify permission via RPC
    if (validated.scope_type === 'business') {
      const { data: canManage } = await supabase.rpc('can_manage_business', {
        biz_id: validated.scope_id,
      })
      if (!canManage) {
        return { success: false, error: 'Permission denied: You cannot assign roles for this business' }
      }
    } else if (validated.scope_type === 'location') {
      const { data: canManage } = await supabase.rpc('can_manage_location', {
        loc_id: validated.scope_id,
      })
      if (!canManage) {
        return { success: false, error: 'Permission denied: You cannot assign roles for this location' }
      }
    }

    // Target user assignment
    const targetUserId = currentUser.id // Default self fallback for testing

    const { error: insertError } = await supabase
      .from('role_assignments')
      .insert({
        user_id: targetUserId,
        role: validated.role,
        scope_type: validated.scope_type,
        scope_id: validated.scope_id,
        created_by: currentUser.id,
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return { success: false, error: 'This role assignment already exists for this user.' }
      }
      return { success: false, error: insertError.message }
    }

    revalidatePath('/dashboard/team')
    revalidatePath(`/businesses/${validated.scope_id}`)

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to assign role'
    return { success: false, error: msg }
  }
}

/**
 * Server action to revoke a role assignment.
 * Guards permission based on scope_type (organization, business, or location).
 */
export async function revokeRoleAction(input: RevokeRoleInput): Promise<ActionResult> {
  try {
    const validated = revokeRoleSchema.parse(input)
    const supabase = await createClient()

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !currentUser) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Fetch assignment scope to verify caller's management rights
    const { data: assignment, error: fetchError } = await supabase
      .from('role_assignments')
      .select('scope_type, scope_id')
      .eq('id', validated.role_assignment_id)
      .single()

    if (fetchError || !assignment) {
      return { success: false, error: 'Role assignment not found' }
    }

    // Verify permission matching scope_type
    if (assignment.scope_type === 'organization') {
      const { data: isOwner } = await supabase.rpc('is_owner', { org_id: assignment.scope_id })
      if (!isOwner) {
        return { success: false, error: 'Permission denied: Only organization owners can revoke org-level roles' }
      }
    } else if (assignment.scope_type === 'business') {
      const { data: canManage } = await supabase.rpc('can_manage_business', { biz_id: assignment.scope_id })
      if (!canManage) {
        return { success: false, error: 'Permission denied: You cannot revoke roles for this business' }
      }
    } else if (assignment.scope_type === 'location') {
      const { data: canManage } = await supabase.rpc('can_manage_location', { loc_id: assignment.scope_id })
      if (!canManage) {
        return { success: false, error: 'Permission denied: You cannot revoke roles for this location' }
      }
    }

    const { error: deleteError } = await supabase
      .from('role_assignments')
      .delete()
      .eq('id', validated.role_assignment_id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    revalidatePath('/dashboard/team')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to revoke role'
    return { success: false, error: msg }
  }
}
