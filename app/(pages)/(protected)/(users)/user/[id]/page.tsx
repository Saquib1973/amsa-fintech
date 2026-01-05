import UserDetailClient from '@/components/(protected-user)/super-admin/users/user-detail-client'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Details | AMSA Fintech',
  description: 'View user information and transaction history',
}

export default function UserDetailPage() {
  return (
    <AnimateWrapper>
      <OffWhiteHeadingContainer>
        <h1 className="text-5xl font-light">User Details</h1>
      </OffWhiteHeadingContainer>
      <SectionWrapper>
        <UserDetailClient />
      </SectionWrapper>
    </AnimateWrapper>
  )
}