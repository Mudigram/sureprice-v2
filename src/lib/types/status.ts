export type EntityStatus = 'active' | 'archived'
const VALID_STATUSES: EntityStatus[] = ['active', 'archived']

export function assertEntityStatus(value: string, context: string): EntityStatus {
  if (!VALID_STATUSES.includes(value as EntityStatus)) {
    throw new Error(`Unexpected status value in ${context}: "${value}"`)
  }
  return value as EntityStatus
}
