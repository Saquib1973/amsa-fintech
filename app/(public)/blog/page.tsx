import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { blogPosts } from '@/content/blog'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

const BlogPage = async () => {
  const posts = Object.entries(blogPosts).map(([id, post]) => ({
    id,
    name: post.title,
  }));

  return (
    <AnimateWrapper>
      <div className="page-container">
        <OffWhiteHeadingContainer>Blogs</OffWhiteHeadingContainer>
        <div className="width-1600 py-20 p-10 flex flex-col gap-10">
          <h1 className="text-xl font-light">
            <span className="underline underline-offset-4">Home</span>
            {` / Blog`}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                name={post.name}
                link={`/blog/${post.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimateWrapper>
  )
}

const BlogCard = ({ name, link }: { name: string; link: string }) => {
  return (
    <Link href={link} className='group flex hover:bg-surface-main transition-all hover:shadow p-3 flex-col gap-2'>
      <div className="bg-gradient-to-tr aspect-video from-blue-400 flex relative items-center justify-center via-blue-600 to-blue-400 p-10">
        <h1 className='text-white text-4xl font-light'>AMSA | Blog</h1>
        <ExternalLink className='w-5 h-5 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all text-white z-50' />
      </div>
      <div className='group-hover:text-black text-gray-500 text-lg group-hover:underline underline-offset-4'>
        {name}
      </div>
    </Link>
  )
}

export default BlogPage
