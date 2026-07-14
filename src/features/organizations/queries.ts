import { createClient } from '@/lib/supabase/server'

export async function getOwnerOrganizationId(userId: string): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('role_assignments')
    .select('scope_id')
    .eq('user_id', userId)
    .eq('role', 'owner')
    .eq('scope_type', 'organization')
    .maybeSingle()

  if (error) throw error
  return data?.scope_id ?? null
}