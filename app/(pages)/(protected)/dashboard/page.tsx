import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getTransactions } from '@/actions/transactions'
import type { Transaction } from '@/types/transaction-types'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import UserDashboard from '@/components/(protected-user)/dashboard/user-dashboard'
import AdminDashboard from '@/components/(protected-user)/dashboard/admin-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | AMSA Fintech and IT solutions',
  description: 'Dashboard for AMSA Fintech and IT solutions',
  keywords: 'dashboard, AMSA Fintech and IT solutions',
}

const DashboardPage = async () => {
  const session = await getSession()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const userRole = session.user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN'

  // Fetch transactions for regular users
  let transactions: Transaction[] = []
  if (userRole === 'USER') {
    const transactionsResult = await getTransactions({ recent: true })
    transactions = transactionsResult.data as unknown as Transaction[]
  }

  // Determine dashboard title based on role
  const dashboardTitle = userRole === 'USER' ? 'Dashboard' : 'Admin Dashboard'

  return (
    <AnimateWrapper>
      <OffWhiteHeadingContainer>
        <div>
          <h1 className="text-5xl font-light">{dashboardTitle}</h1>
        </div>
      </OffWhiteHeadingContainer>

      {userRole === 'USER' ? (
        <UserDashboard transactions={transactions} />
      ) : (
        <AdminDashboard />
      )}
    </AnimateWrapper>
  )
}

export default DashboardPage
