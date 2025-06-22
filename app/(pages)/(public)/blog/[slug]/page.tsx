import { notFound } from 'next/navigation'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { blogPosts } from '@/content/blog'
import type { Metadata } from 'next'
import BlogPostClient from '@/components/blogs/blog-post-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Blog Post Not Found | AMSA Fintech and IT solutions',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | AMSA Fintech and IT solutions`,
    description: `Read our blog post about ${post.title}. Published on ${new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}.`,
    keywords: `${post.title}, blog, AMSA Fintech and IT solutions`,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <AnimateWrapper>
      <BlogPostClient post={post} />
    </AnimateWrapper>
  )
}
