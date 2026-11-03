import React from 'react'
import { renderToString } from 'react-dom/server'
import { describe, it, expect, vi } from 'vitest'
import { DishCard } from './dish-card'
import type { StorefrontItem } from '@/features/storefront/types'

// Mock useCart hook
const mockUseCart = vi.fn()
vi.mock('@/context/CartContext', () => ({
  useCart: () => mockUseCart(),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const sampleProduct: StorefrontItem = {
  id: 'dish-123',
  business_id: 'biz-1',
  category_id: 'cat-1',
  name: 'Jollof Rice & Plantain',
  description: 'Smoky party jollof with sweet fried plantain',
  base_price: 3500,
  sku: 'JOL-01',
  barcode: null,
  is_available: true,
  image_url: null,
  sort_order: 1,
  attributes: {},
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('DishCard accessibility', () => {
  it('renders contextual aria-label on the primary Add button when item is not in list', () => {
    mockUseCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      isInList: () => false,
      getQuantity: () => 0,
    })

    const html = renderToString(
      <DishCard
        product={sampleProduct}
        businessSlug="test-buka"
        businessName="Test Buka"
      />
    )

    expect(html).toContain('aria-label="Add Jollof Rice &amp; Plantain to list"')
  })

  it('renders contextual aria-label on stepper controls when item is in list with quantity 1', () => {
    mockUseCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      isInList: () => true,
      getQuantity: () => 1,
    })

    const html = renderToString(
      <DishCard
        product={sampleProduct}
        businessSlug="test-buka"
        businessName="Test Buka"
      />
    )

    expect(html).toContain('aria-label="Remove Jollof Rice &amp; Plantain from list"')
    expect(html).toContain('aria-label="Increase quantity of Jollof Rice &amp; Plantain"')
  })

  it('renders contextual decrease aria-label on stepper controls when quantity > 1', () => {
    mockUseCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      isInList: () => true,
      getQuantity: () => 3,
    })

    const html = renderToString(
      <DishCard
        product={sampleProduct}
        businessSlug="test-buka"
        businessName="Test Buka"
      />
    )

    expect(html).toContain('aria-label="Decrease quantity of Jollof Rice &amp; Plantain"')
    expect(html).toContain('aria-label="Increase quantity of Jollof Rice &amp; Plantain"')
  })
})
