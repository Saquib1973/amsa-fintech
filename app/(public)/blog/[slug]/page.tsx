'use client'
import { notFound, useParams } from 'next/navigation'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import MarkdownContent from '@/components/markdown-content'
import Link from 'next/link'
import { blogPosts } from '@/content/blog'
import { useEffect, useState } from 'react'

export default function BlogPostPage() {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState({
    title: '',
    date: '',
    content: '',
  })
  const params = useParams()
  useEffect(() => {
    setPost(blogPosts[params.slug as string])
    setLoading(false)
  }, [params.slug])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!post) {
    notFound()
  }

  return (
    <AnimateWrapper>
      <div className="width-1240 py-20 p-10 flex flex-col gap-10">
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
    </AnimateWrapper>
  )
}

const LoadingSkeleton = () => {
  return (
    <AnimateWrapper>
      <div className="width-1240 py-20 p-10 flex flex-col gap-10">
        <div className="flex items-center gap-2 text-xl font-light">
          <Link href="/blog" className="underline underline-offset-4">
            Blog
          </Link>
          <span>/</span>
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>

        <div className="bg-gradient-to-tr aspect-video from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center p-10"></div>

        <div className="h-6 w-48 bg-gray-200 rounded" />

        <div className="mt-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </AnimateWrapper>
  )
}
