import ContainerTwo from '@/components/containers/container-two'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

const BlogPage = () => {
  return (
    <AnimateWrapper>
      <div className="page-container">
        <ContainerTwo>Blogs</ContainerTwo>
      </div>
    </AnimateWrapper>
  )
}

export default BlogPage
