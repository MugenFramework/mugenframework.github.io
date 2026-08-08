import type { MetadataRoute } from 'next'
import { getAllDocSlugs } from '@/lib/content'
import { getAllBlogSlugs } from '@/lib/blog'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mugenframework.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Doc pages
  const docs: MetadataRoute.Sitemap = getAllDocSlugs().map((slug) => ({
    url: `${BASE_URL}/docs/${slug.join('/')}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog posts
  const posts: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...statics, ...docs, ...posts]
}
