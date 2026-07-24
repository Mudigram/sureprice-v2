import { z } from 'zod'

export const VALID_ROLES = ['admin', 'manager'] as const
export const VALID_SCOPE_TYPES = ['business', 'location'] as const

export const assignRoleSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: z.enum(VALID_ROLES, {
    message: 'Role must be either Business Admin or Location Manager',
  }),
  scope_type: z.enum(VALID_SCOPE_TYPES, {
    message: 'Scope must be Business or Location',
  }),
  scope_id: z.string().uuid('Please select a valid business or location'),
})

export type AssignRoleInput = z.input<typeof assignRoleSchema>
export type AssignRoleOutput = z.infer<typeof assignRoleSchema>

export const revokeRoleSchema = z.object({
  role_assignment_id: z.string().uuid('Invalid assignment ID'),
})

export type RevokeRoleInput = z.input<typeof revokeRoleSchema>
export type RevokeRoleOutput = z.infer<typeof revokeRoleSchema>
