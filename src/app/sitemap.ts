import type { MetadataRoute } from 'next'
import { getPublishedBusinesses } from '@/features/storefront/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qarty.ng'

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/scan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Dynamic storefront routes
  try {
    const published = await getPublishedBusinesses()
    const storeRoutes: MetadataRoute.Sitemap = published.map((b) => ({
      url: `${siteUrl}/s/${b.slug}`,
      lastModified: new Date(b.updated_at || new Date()),
      changeFrequency: 'daily',
      priority: 0.85,
    }))
    return [...staticRoutes, ...storeRoutes]
  } catch {
    return staticRoutes
  }
}
