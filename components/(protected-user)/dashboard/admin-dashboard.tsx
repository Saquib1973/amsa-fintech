import { prisma } from '@/lib/prisma'
import AdminStatsCards from './admin-stats-cards'
import AdminQuickActionsSidebar from './admin-quick-actions-sidebar'
import RecentAdminTransactionsSection from './recent-admin-transactions-section'
import AdminAnalyticsSection from './admin-analytics-section'

async function getAdminStats() {
  const [totalUsers, totalTransactions, recentTransactions, allTransactions] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.transaction.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.transaction.findMany({
      select: {
        isBuyOrSell: true,
        fiatAmount: true,
      },
    }),
  ])

  const pendingVerifications = await prisma.user.count({
    where: { isVerified: false },
  })

  // Calculate volume statistics
  let totalBuy = 0
  let totalSell = 0

  allTransactions.forEach((tx) => {
    const amount = Number(tx.fiatAmount)
    if (tx.isBuyOrSell === 'BUY') {
      totalBuy += amount
    } else if (tx.isBuyOrSell === 'SELL') {
      totalSell += amount
    }
  })

  const totalVolume = totalBuy + totalSell

  return {
    totalUsers,
    totalTransactions,
    pendingVerifications,
    recentTransactions,
    totalVolume,
    buyVolume: totalBuy,
    sellVolume: totalSell,
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen font-sans">
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <AdminStatsCards
          totalUsers={stats.totalUsers}
          totalTransactions={stats.totalTransactions}
          pendingVerifications={stats.pendingVerifications}
          totalVolume={stats.totalVolume}
          buyVolume={stats.buyVolume}
          sellVolume={stats.sellVolume}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AdminAnalyticsSection />
            <RecentAdminTransactionsSection transactions={stats.recentTransactions} />
          </div>
          <AdminQuickActionsSidebar />
        </div>
      </main>
    </div>
  )
}
