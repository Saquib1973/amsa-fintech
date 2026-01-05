import UsersListClient from '@/components/(protected-user)/super-admin/users/users-list-client'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users | AMSA Fintech',
  description: 'Manage platform users',
}

const UsersPage = () => {
  return (
    <AnimateWrapper>
      <OffWhiteHeadingContainer>
        <h1 className="text-5xl font-light">Users</h1>
      </OffWhiteHeadingContainer>
      <SectionWrapper>
        <UsersListClient />
      </SectionWrapper>
    </AnimateWrapper>
  )
}

export default UsersPage
