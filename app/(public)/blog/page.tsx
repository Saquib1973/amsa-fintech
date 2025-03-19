import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Link from 'next/link'

const BlogPage = () => {
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
            <BlogCard
              name="Trump Announces Bitcoin Reserve as Economic Fears Deepen "
              link="https://www.google.com"
            />
            <BlogCard
              name="Crypto Suffers Biggest-Ever Hack as Bitcoin Tumbles Below US $90k "
              link="https://www.google.com"
            />
            <BlogCard
              name="Bitcoin Hits All-Time High as Trump Wins 2024 US Election "
              link="https://www.google.com"
            />
            <BlogCard
              name="Crypto Market Bounces Back As the Industry Ticks Off Several All-Time Highs "
              link="https://www.google.com"
            />
            <BlogCard
              name="XRP Flies High as Veteran Altcoins Make a Comeback"
              link="https://www.google.com"
            />
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
