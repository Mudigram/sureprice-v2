import { describe, it, expect } from 'vitest'
import { resolveRedirectPath } from './queries'
import type { RoleAssignment } from './types'

describe('resolveRedirectPath', () => {
  it('returns /dashboard for an organization owner', () => {
    const assignments: RoleAssignment[] = [
      { role: 'owner', scope_type: 'organization', scope_id: 'org-123' },
    ]
    expect(resolveRedirectPath(assignments)).toBe('/dashboard')
  })

  it('returns /businesses/:id for a business admin', () => {
    const assignments: RoleAssignment[] = [
      { role: 'admin', scope_type: 'business', scope_id: 'biz-456' },
    ]
    expect(resolveRedirectPath(assignments)).toBe('/businesses/biz-456')
  })

  it('returns /locations/:id for a location manager', () => {
    const assignments: RoleAssignment[] = [
      { role: 'manager', scope_type: 'location', scope_id: 'loc-789' },
    ]
    expect(resolveRedirectPath(assignments)).toBe('/locations/loc-789')
  })

  it('prioritizes organization owner over business admin and location manager', () => {
    const assignments: RoleAssignment[] = [
      { role: 'manager', scope_type: 'location', scope_id: 'loc-789' },
      { role: 'admin', scope_type: 'business', scope_id: 'biz-456' },
      { role: 'owner', scope_type: 'organization', scope_id: 'org-123' },
    ]
    expect(resolveRedirectPath(assignments)).toBe('/dashboard')
  })

  it('prioritizes business admin over location manager when owner is absent', () => {
    const assignments: RoleAssignment[] = [
      { role: 'manager', scope_type: 'location', scope_id: 'loc-789' },
      { role: 'admin', scope_type: 'business', scope_id: 'biz-456' },
    ]
    expect(resolveRedirectPath(assignments)).toBe('/businesses/biz-456')
  })

  it('returns /no-access when assignments array is empty', () => {
    expect(resolveRedirectPath([])).toBe('/no-access')
  })

  it('returns /no-access when assignments do not match required role-scope combinations', () => {
    const assignments = [
      { role: 'manager', scope_type: 'organization', scope_id: 'org-123' },
      { role: 'owner', scope_type: 'business', scope_id: 'biz-456' },
    ] as RoleAssignment[]
    expect(resolveRedirectPath(assignments)).toBe('/no-access')
  })
})
