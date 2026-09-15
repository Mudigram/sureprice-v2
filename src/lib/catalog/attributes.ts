/**
 * Utility functions for parsing, cleaning, and formatting product attributes
 * into consumer-friendly badges and structured specifications.
 */

export interface FormattedBadge {
  id: string
  label: string
  emoji?: string
  colorClass: string
}

export interface FormattedSpec {
  key: string
  label: string
  value: string
  iconType: 'clock' | 'scale' | 'box' | 'shield' | 'info'
}

export interface ParsedItemDetails {
  badges: FormattedBadge[]
  specs: FormattedSpec[]
}

// System keys that should never be shown in user-facing specifications
const SYSTEM_KEYS = new Set([
  'is_sold_out',
  'in_stock',
  'is_featured',
  'availability',
  'stock',
  'featured',
])

function formatLabel(rawKey: string): string {
  // Convert snake_case or kebab-case or camelCase to Title Case
  const words = rawKey
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)

  const ACRONYMS = new Set(['sku', 'pos', 'qr', 'id', 'vat', 'ml', 'kg', 'g', 'oz', 'abv'])

  return words
    .map((word) => {
      const lower = word.toLowerCase()
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

function detectIconType(key: string): FormattedSpec['iconType'] {
  const k = key.toLowerCase()
  if (k.includes('time') || k.includes('prep') || k.includes('cook') || k.includes('duration') || k.includes('wait')) {
    return 'clock'
  }
  if (k.includes('weight') || k.includes('size') || k.includes('portion') || k.includes('volume') || k.includes('gram') || k.includes('kg') || k.includes('ml') || k.includes('liter') || k.includes('capacity')) {
    return 'scale'
  }
  if (k.includes('storage') || k.includes('shelf') || k.includes('temp') || k.includes('expire') || k.includes('safe') || k.includes('condition')) {
    return 'shield'
  }
  if (k.includes('pack') || k.includes('box') || k.includes('origin') || k.includes('material') || k.includes('fabric') || k.includes('brand') || k.includes('model') || k.includes('color')) {
    return 'box'
  }
  return 'info'
}

export function parseItemAttributes(attributes: unknown): ParsedItemDetails {
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return { badges: [], specs: [] }
  }

  const raw = attributes as Record<string, unknown>
  const badges: FormattedBadge[] = []
  const specs: FormattedSpec[] = []

  const isTruthy = (val: unknown): boolean => {
    if (typeof val === 'boolean') return val
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase()
      return s === 'true' || s === 'yes' || s === '1' || s === 'y'
    }
    if (typeof val === 'number') return val === 1
    return false
  }

  const isFalsy = (val: unknown): boolean => {
    if (typeof val === 'boolean') return !val
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase()
      return s === 'false' || s === 'no' || s === '0' || s === 'n'
    }
    if (typeof val === 'number') return val === 0
    return false
  }

  for (const [rawKey, rawValue] of Object.entries(raw)) {
    if (rawValue === null || rawValue === undefined) continue

    const keyLower = rawKey.trim().toLowerCase()
    const strVal = String(rawValue).trim()
    if (!strVal) continue

    // Filter out internal system keys
    if (SYSTEM_KEYS.has(keyLower)) {
      continue
    }

    // 1. Dietary & Lifestyle Presets
    if (keyLower === 'spicy' || keyLower === 'spice') {
      if (isTruthy(rawValue) || strVal.toLowerCase() === 'mild' || strVal.toLowerCase() === 'medium' || strVal.toLowerCase() === 'hot' || strVal.toLowerCase() === 'extra hot') {
        const spiceLevel = isTruthy(rawValue) ? 'Spicy' : `${strVal} Spicy`
        badges.push({
          id: 'spicy',
          label: spiceLevel,
          emoji: '🌶️',
          colorClass: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
        })
      }
      continue
    }

    if (keyLower === 'vegetarian' || keyLower === 'veg') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'vegetarian',
          label: 'Vegetarian',
          emoji: '🌱',
          colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
        })
      }
      continue
    }

    if (keyLower === 'vegan') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'vegan',
          label: '100% Plant-Based Vegan',
          emoji: '🌿',
          colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
        })
      }
      continue
    }

    if (keyLower === 'halal') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'halal',
          label: 'Halal Certified',
          emoji: '☪️',
          colorClass: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900',
        })
      }
      continue
    }

    if (keyLower === 'gluten_free' || keyLower === 'glutenfree' || keyLower === 'gluten free') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'gluten_free',
          label: 'Gluten-Free',
          emoji: '🌾',
          colorClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
        })
      }
      continue
    }

    if (keyLower === 'organic') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'organic',
          label: 'Organic',
          emoji: '🍃',
          colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
        })
      }
      continue
    }

    if (keyLower === 'special' || keyLower === 'chef_special' || keyLower === 'chef special') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'special',
          label: "Chef's Special",
          emoji: '🔥',
          colorClass: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
        })
      }
      continue
    }

    if (keyLower === 'bestseller' || keyLower === 'popular' || keyLower === 'favorite' || keyLower === 'recommended') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'bestseller',
          label: 'Bestseller',
          emoji: '⭐',
          colorClass: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
        })
      }
      continue
    }

    if (keyLower === 'limited' || keyLower === 'limited_edition' || keyLower === 'event_exclusive' || keyLower === 'batch') {
      if (isTruthy(rawValue)) {
        badges.push({
          id: 'limited',
          label: 'Limited Batch',
          emoji: '🎪',
          colorClass: 'bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900',
        })
      }
      continue
    }

    // If it's any other boolean flag set to false, skip it
    if (isFalsy(rawValue)) {
      continue
    }

    // If it's a boolean flag set to true with a custom name, render as a feature badge
    if (isTruthy(rawValue)) {
      badges.push({
        id: keyLower,
        label: formatLabel(rawKey),
        emoji: '✨',
        colorClass: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      })
      continue
    }

    // 2. Otherwise, format as a real, structured product specification
    specs.push({
      key: rawKey,
      label: formatLabel(rawKey),
      value: strVal,
      iconType: detectIconType(rawKey),
    })
  }

  return { badges, specs }
}
