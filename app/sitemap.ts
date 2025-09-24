import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://enre.fr'

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/purchases`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  try {
    // Pages dynamiques - voitures publiques
    const cars = await prisma.car.findMany({
      where: { published: true },
      select: {
        id: true,
        createdAt: true,
      },
    })

    const carPages = cars.map((car) => ({
      url: `${baseUrl}/cars/${car.id}`,
      lastModified: car.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...staticPages, ...carPages]
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error)
    return staticPages
  }
}