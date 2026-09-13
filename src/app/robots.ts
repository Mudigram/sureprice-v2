import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qarty.ng'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/home',
          '/stores',
          '/scan',
          '/s/',
          '/privacy',
          '/terms',
          '/login',
          '/register',
          '/onboarding',
        ],
        disallow: ['/dashboard', '/businesses/', '/locations/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
