import UserTransactionsClient from '@/components/(protected-user)/super-admin/users/user-transactions-client'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Transactions | AMSA Fintech',
  description: 'View all user transactions',
}

export default function UserTransactionsPage() {
  return (
    <AnimateWrapper>
      <OffWhiteHeadingContainer>
        <h1 className="text-5xl font-light">User Transactions</h1>
      </OffWhiteHeadingContainer>
      <SectionWrapper>
        <UserTransactionsClient />
      </SectionWrapper>
    </AnimateWrapper>
  )
}
