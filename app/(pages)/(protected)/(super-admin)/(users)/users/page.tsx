import UsersListClient from '@/components/(protected-user)/super-admin/users/users-list-client'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'

const UsersPage = () => {
  return (
    <AnimateWrapper>
      <OffWhiteHeadingContainer>
        <h1 className="text-4xl font-light">Users</h1>
      </OffWhiteHeadingContainer>
      <SectionWrapper>
        <UsersListClient />
      </SectionWrapper>
    </AnimateWrapper>
  )
}

export default UsersPage
