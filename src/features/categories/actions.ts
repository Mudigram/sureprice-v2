'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireBusinessManage } from '@/lib/auth/require-access'
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from './schema'
import { getCategoriesForBusiness } from './queries'

export async function createCategory(input: CreateCategoryInput) {
  const parsed = createCategorySchema.parse(input)
  await requireBusinessManage(parsed.business_id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const existing = await getCategoriesForBusiness(parsed.business_id, true)
  const nextSortOrder = existing.length > 0 ? Math.max(...existing.map((c) => c.sort_order)) + 1 : 0

  const { error } = await supabase.from('categories').insert({
    business_id: parsed.business_id,
    name: parsed.name,
    sort_order: nextSortOrder,
    created_by: user.id,
  })

  if (error) throw error
  revalidatePath(`/businesses/${parsed.business_id}/categories`)
}

export async function updateCategory(categoryId: string, businessId: string, input: UpdateCategoryInput) {
  const parsed = updateCategorySchema.parse(input)
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const { error } = await supabase.from('categories').update({ name: parsed.name }).eq('id', categoryId)
  if (error) throw error

  revalidatePath(`/businesses/${businessId}/categories`)
}

export async function setCategoryStatus(categoryId: string, businessId: string, status: 'active' | 'archived') {
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const { error } = await supabase.from('categories').update({ status }).eq('id', categoryId)
  if (error) throw error

  revalidatePath(`/businesses/${businessId}/categories`)
}

/**
 * Swaps sort_order between adjacent categories — simple move up/down,
 * not full drag-and-drop. Upgrade later if the flat list gets unwieldy.
 */
export async function moveCategorySortOrder(businessId: string, categoryId: string, direction: 'up' | 'down') {
  await requireBusinessManage(businessId)

  const categories = await getCategoriesForBusiness(businessId, true)
  const index = categories.findIndex((c) => c.id === categoryId)
  if (index === -1) return

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= categories.length) return

  const current = categories[index]
  const swap = categories[swapIndex]
  const supabase = await createClient()

  const { error: e1 } = await supabase.from('categories').update({ sort_order: swap.sort_order }).eq('id', current.id)
  if (e1) throw e1

  const { error: e2 } = await supabase.from('categories').update({ sort_order: current.sort_order }).eq('id', swap.id)
  if (e2) throw e2

  revalidatePath(`/businesses/${businessId}/categories`)
}