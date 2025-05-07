import { MetadataRoute } from 'next'
import { blogPosts } from '@/content/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  const staticRoutes = [
    { path: '', priority: 1.0 },
    { path: '/about-us', priority: 0.8 },
    { path: '/blog', priority: 0.8 },
    { path: '/features', priority: 0.8 },
    { path: '/fees', priority: 0.7 },
    { path: '/networks', priority: 0.7 },
    { path: '/learn-earn', priority: 0.8 },
    { path: '/courses', priority: 0.7 },
    { path: '/guides', priority: 0.7 },
    { path: '/help', priority: 0.7 },
    { path: '/docs', priority: 0.7 },
    { path: '/docs/ui-patterns', priority: 0.6 },
    { path: '/docs/apis', priority: 0.6 },
    { path: '/terms-of-use', priority: 0.5 },
    { path: '/support', priority: 0.7 },
    { path: '/privacy-policy', priority: 0.5 },
    { path: '/tnc', priority: 0.5 },
    { path: '/assets', priority: 0.9 },
    { path: '/assets/bitcoin', priority: 0.8 },
    { path: '/assets/ethereum', priority: 0.8 },
    { path: '/assets/solana', priority: 0.8 },
    { path: '/assets/tether', priority: 0.8 },
    { path: '/assets/ripple', priority: 0.8 },
  ].map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route.priority,
  }))

  const blogRoutes = Object.entries(blogPosts).map(([slug, post]) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}