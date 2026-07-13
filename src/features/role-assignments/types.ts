export type Role = 'owner' | 'admin' | 'manager'
export type ScopeType = 'organization' | 'business' | 'location'

export interface RoleAssignment {
  role: Role
  scope_type: ScopeType
  scope_id: string
}

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'