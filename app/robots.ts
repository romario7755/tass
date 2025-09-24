import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://enre.fr'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/cars/*',
          '/login',
          '/register',
        ],
        disallow: [
          '/dashboard',
          '/api/*',
          '/admin/*',
          '/private/*',
          '/purchases',
          '/activate',
          '/reset-password',
          '/forgot-password',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: [
          '/',
          '/cars/*',
        ],
        disallow: [
          '/dashboard',
          '/api/*',
          '/admin/*',
          '/private/*',
          '/purchases',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}