export type Role = 'owner' | 'admin' | 'manager'
export type ScopeType = 'organization' | 'business' | 'location'

export interface RoleAssignment {
  role: Role
  scope_type: ScopeType
  scope_id: string
}

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'

export interface TeamMember {
  id: string
  userId: string
  userEmail: string
  userName?: string | null
  role: Role
  scopeType: ScopeType
  scopeId: string
  scopeName: string // e.g. "Main Organization", "Spar Victoria Island", or "Lekki Branch"
  createdAt?: string
}

export interface ScopeOption {
  scopeId: string
  scopeType: ScopeType
  name: string
}