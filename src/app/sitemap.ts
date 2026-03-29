import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kiddyshop.ro'

  // Static routes
  const routes = [
    '',
    '/shop',
    '/cart',
    '/checkout',
    '/contact',
    '/termeni',
    '/politica-confidentialitate',
    '/livrare',
    '/faq'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic products
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true }
  })

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...productRoutes]
}
