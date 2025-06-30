'use client'
import MarkdownContent from '@/components/markdown-content'
import Link from 'next/link'
import { BlogPost } from '@/content/blog/types'

interface BlogPostClientProps {
  post: BlogPost
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-20 p-4 flex flex-col gap-10">
      <div className="flex items-center gap-2 text-xl font-light">
        <Link href="/blog" className="underline underline-offset-4">
          Blog
        </Link>
        <span>/</span>
        <span className="line-clamp-1">{post.title}</span>
      </div>

      <div className="bg-gradient-to-tr aspect-video from-blue-400 flex items-center justify-center via-blue-600 to-blue-400 p-10">
        <h1 className="text-white text-4xl font-light">{post.title}</h1>
      </div>

      <div className="text-gray-600">
        Published on{' '}
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div className="mt-8">
        <MarkdownContent content={post.content} />
      </div>
    </div>
  )
}