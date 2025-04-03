import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Link from 'next/link'
import { blogPosts } from '@/content/blog'

const BlogPage = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default BlogPage

const BlogCard = ({ name, link }: { name: string; link: string }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className="bg-gradient-to-tr aspect-video from-blue-400 flex items-center justify-center via-blue-600 to-blue-400 p-10">
        <h1 className='text-white text-4xl font-light'>AMSA | Blog</h1>
      </div>
      <Link href={link} className='text-lg underline underline-offset-4'>
        {name}
      </Link>
    </div>
  )
}
