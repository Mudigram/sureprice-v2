'use client'

import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

/** 🍽️ All Categories / Master Plate Fallback */
export function CategoryPlateSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" className="fill-current/10" />
      <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
      <path d="M12 15a3 3 0 0 0 3-3" strokeWidth="1.5" />
    </svg>
  )
}

/** 🥤 Beverages & Soft Drinks */
export function CategoryBeverageSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M7 10h10l-1.2 10.2A2 2 0 0 1 13.82 22H10.18a2 2 0 0 1-1.98-1.8L7 10z" className="fill-current/10" />
      <path d="M6 6h12v4H6z" className="fill-current/20" />
      <path d="M14 2l-2 4" />
      <line x1="9" y1="14" x2="15" y2="14" strokeWidth="1.2" />
    </svg>
  )
}

/** 🧃 Juices & Smoothies */
export function CategoryJuiceSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="7" y="7" width="10" height="14" rx="2" className="fill-current/10" />
      <path d="M15 2l-3 5" />
      <path d="M10 11a2 2 0 0 0 4 0" strokeWidth="1.5" />
      <circle cx="12" cy="16" r="1.5" className="fill-current" />
    </svg>
  )
}

/** 🥐 Bakery, Bread & Snacks */
export function CategoryBakerySvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 14.5A4.5 4.5 0 0 1 8.5 10H15.5a4.5 4.5 0 0 1 4.5 4.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5z" className="fill-current/10" />
      <path d="M7 10V8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
      <path d="M9 14h6" strokeWidth="1.5" />
    </svg>
  )
}

/** 🥛 Dairy & Milk */
export function CategoryDairySvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8 8h8l-1 13H9L8 8z" className="fill-current/10" />
      <path d="M9 3h6v5H9z" className="fill-current/20" />
      <path d="M8 14c2-1 4 1 8 0" strokeWidth="1.5" />
    </svg>
  )
}

/** 🥩 Meat & Poultry */
export function CategoryMeatSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M14.5 4.5c2.5 0 4.5 2 4.5 4.5 0 4-5 8-8 10.5C8 17 4 13 4 9a4.5 4.5 0 0 1 4.5-4.5c1.5 0 2.8.7 3.5 1.8.7-1.1 2-1.8 2.5-1.8z" className="fill-current/10" />
      <circle cx="10" cy="9" r="1.5" className="fill-current" />
      <circle cx="15" cy="11" r="1.2" className="fill-current" />
    </svg>
  )
}

/** 🥬 Fresh Produce & Greens */
export function CategoryProduceSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4 2.5 7.5 6.5 9 1-.5 2-1.5 2.5-2.5 2 1.5 5 1.5 7 0 .5 1 1.5 2 2.5 2.5 4-1.5 6.5-5 6.5-9 0-5.5-4.5-10-10-10z" className="fill-current/10" />
      <path d="M12 6v12" strokeWidth="1.5" />
      <path d="M12 10c-2-1.5-4-1.5-5 0" strokeWidth="1.5" />
      <path d="M12 14c2-1.5 4-1.5 5 0" strokeWidth="1.5" />
    </svg>
  )
}

/** 🥗 Starters & Salads */
export function CategorySaladSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 11a9 9 0 0 0 18 0H3z" className="fill-current/15" />
      <path d="M6 9c1-3 4-4 6-4 3 0 5 2 6 4" strokeWidth="1.5" />
      <circle cx="9" cy="8" r="1" className="fill-current" />
      <circle cx="14" cy="7" r="1.2" className="fill-current" />
    </svg>
  )
}

/** 🍝 Mains & Pasta */
export function CategoryPastaSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 14a8 8 0 0 0 16 0H4z" className="fill-current/15" />
      <path d="M8 14V6" strokeWidth="1.5" />
      <path d="M12 14V4" strokeWidth="1.5" />
      <path d="M16 14V6" strokeWidth="1.5" />
      <path d="M6 18h12" />
    </svg>
  )
}

/** 🍰 Desserts & Sweets */
export function CategoryDessertSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 17l18-3v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z" className="fill-current/20" />
      <path d="M3 17l9-9 9 6" className="fill-current/10" />
      <circle cx="12" cy="6" r="2" className="fill-current" />
    </svg>
  )
}

/** ⭐ Chef Specials */
export function CategoryStarSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        className="fill-current/20"
      />
    </svg>
  )
}

/** 🍜 Soups & Noodles */
export function CategorySoupSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 12a9 9 0 0 0 18 0H3z" className="fill-current/15" />
      <path d="M7 8c1-1 1-3 0-4" strokeWidth="1.5" />
      <path d="M12 8c1-1 1-3 0-4" strokeWidth="1.5" />
      <path d="M17 8c1-1 1-3 0-4" strokeWidth="1.5" />
    </svg>
  )
}

/** 🔥 Grill & BBQ */
export function CategoryGrillSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3c-2.5 3-4 5.5-4 8.5a6 6 0 0 0 12 0c0-3-1.5-5.5-4-8.5-1 2-2 3-4 0z" className="fill-current/25" />
      <path d="M12 14a2 2 0 0 0 2-2c0-1-.5-1.5-2-3-1.5 1.5-2 2-2 3a2 2 0 0 0 2 2z" className="fill-current" />
    </svg>
  )
}

/** 🥘 Sides & Extras */
export function CategorySidesSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 13a8 8 0 0 0 16 0H3z" className="fill-current/15" />
      <path d="M19 13a2 2 0 0 0 2-2V9h-3" />
      <path d="M5 13H2V9h3" />
      <line x1="7" y1="18" x2="15" y2="18" strokeWidth="1.5" />
    </svg>
  )
}

/** 🍳 Breakfast & Eggs */
export function CategoryBreakfastSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <ellipse cx="12" cy="13" rx="7" ry="5" className="fill-current/15" />
      <circle cx="11" cy="13" r="2.5" className="fill-current/40" />
      <path d="M19 13l3-3" strokeWidth="2" />
    </svg>
  )
}

/** 🦐 Seafood & Fish */
export function CategorySeafoodSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 12c4-6 12-6 14 0-2 6-10 6-14 0z" className="fill-current/15" />
      <path d="M6 12L2 9v6l4-3z" className="fill-current/25" />
      <circle cx="16" cy="11" r="1" className="fill-current" />
    </svg>
  )
}

/** 🍚 Rice & Jollof Dishes */
export function CategoryRiceSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 13a8 8 0 0 0 16 0H4z" className="fill-current/15" />
      <path d="M7 13c1-3 3-5 5-5s4 2 5 5" className="fill-current/20" strokeWidth="1.5" />
      <line x1="8" y1="18" x2="16" y2="18" strokeWidth="1.5" />
    </svg>
  )
}

/** 🍕 Pizza */
export function CategoryPizzaSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2L2 20h20L12 2z" className="fill-current/15" />
      <path d="M5 15c4 2 10 2 14 0" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="1.2" className="fill-current" />
      <circle cx="9" cy="14" r="1.2" className="fill-current" />
      <circle cx="15" cy="14" r="1.2" className="fill-current" />
    </svg>
  )
}

/** 🍔 Burgers */
export function CategoryBurgerSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 11a7 7 0 0 1 14 0H5z" className="fill-current/20" />
      <rect x="4" y="13" width="16" height="2" rx="1" className="fill-current/40" />
      <path d="M5 17h14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" className="fill-current/15" />
    </svg>
  )
}

/** 🍹 Cocktails & Bar */
export function CategoryCocktailSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 4h14l-7 8-7-8z" className="fill-current/20" />
      <line x1="12" y1="12" x2="12" y2="20" strokeWidth="2" />
      <line x1="8" y1="20" x2="16" y2="20" strokeWidth="2" />
      <path d="M16 2l3 3" />
    </svg>
  )
}

/** ☕ Coffee & Tea */
export function CategoryCoffeeSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M17 8h1a3 3 0 0 1 0 6h-1" />
      <path d="M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" className="fill-current/15" />
      <path d="M6 3c1 1 1 2 0 3" strokeWidth="1.5" />
      <path d="M10 3c1 1 1 2 0 3" strokeWidth="1.5" />
      <path d="M14 3c1 1 1 2 0 3" strokeWidth="1.5" />
    </svg>
  )
}

/** 🏠 Household & Non-Food */
export function CategoryHouseholdSvg({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" className="fill-current/15" />
      <rect x="9" y="14" width="6" height="7" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * Maps category names (e.g. "Beverages", "Mains", "Desserts", "Household")
 * to their bespoke vector SVG component.
 */
export function getCategorySvgIcon(
  name?: string,
  props: IconProps = {}
): React.ReactElement {
  if (!name) return <CategoryPlateSvg {...props} />
  const key = name.toLowerCase()

  if (key.includes('beverage') || key.includes('drink') || key.includes('soft drink')) {
    return <CategoryBeverageSvg {...props} />
  }
  if (key.includes('juice') || key.includes('smoothie')) {
    return <CategoryJuiceSvg {...props} />
  }
  if (key.includes('snack') || key.includes('bakery') || key.includes('bread') || key.includes('pastr')) {
    return <CategoryBakerySvg {...props} />
  }
  if (key.includes('dairy') || key.includes('milk') || key.includes('cheese')) {
    return <CategoryDairySvg {...props} />
  }
  if (key.includes('meat') || key.includes('poultry') || key.includes('steak') || key.includes('beef')) {
    return <CategoryMeatSvg {...props} />
  }
  if (key.includes('produce') || key.includes('veg') || key.includes('green')) {
    return <CategoryProduceSvg {...props} />
  }
  if (key.includes('starter') || key.includes('salad') || key.includes('appetizer')) {
    return <CategorySaladSvg {...props} />
  }
  if (key.includes('pasta') || key.includes('main') || key.includes('spaghetti')) {
    return <CategoryPastaSvg {...props} />
  }
  if (key.includes('dessert') || key.includes('cake') || key.includes('sweet') || key.includes('ice cream')) {
    return <CategoryDessertSvg {...props} />
  }
  if (key.includes('special') || key.includes('star') || key.includes('chef')) {
    return <CategoryStarSvg {...props} />
  }
  if (key.includes('soup') || key.includes('noodle') || key.includes('ramen') || key.includes('swallow')) {
    return <CategorySoupSvg {...props} />
  }
  if (key.includes('grill') || key.includes('bbq') || key.includes('barbecue') || key.includes('suya')) {
    return <CategoryGrillSvg {...props} />
  }
  if (key.includes('side') || key.includes('extra') || key.includes('topping')) {
    return <CategorySidesSvg {...props} />
  }
  if (key.includes('breakfast') || key.includes('egg') || key.includes('morning')) {
    return <CategoryBreakfastSvg {...props} />
  }
  if (key.includes('seafood') || key.includes('fish') || key.includes('shrimp') || key.includes('prawn')) {
    return <CategorySeafoodSvg {...props} />
  }
  if (key.includes('rice') || key.includes('jollof') || key.includes('fried rice')) {
    return <CategoryRiceSvg {...props} />
  }
  if (key.includes('pizza')) {
    return <CategoryPizzaSvg {...props} />
  }
  if (key.includes('burger')) {
    return <CategoryBurgerSvg {...props} />
  }
  if (key.includes('cocktail') || key.includes('bar') || key.includes('wine') || key.includes('spirit')) {
    return <CategoryCocktailSvg {...props} />
  }
  if (key.includes('coffee') || key.includes('tea') || key.includes('espresso') || key.includes('latte')) {
    return <CategoryCoffeeSvg {...props} />
  }
  if (key.includes('house') || key.includes('clean') || key.includes('non-food') || key.includes('retail')) {
    return <CategoryHouseholdSvg {...props} />
  }

  return <CategoryPlateSvg {...props} />
}
