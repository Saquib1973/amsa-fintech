import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import LogoutButton from '@/components/button/logout-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Link from 'next/link'
import SecondaryButton from '@/components/button/secondary-button'
import { prisma } from '@/lib/prisma'
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    include: {
      wallet: true,
    },
  });
  console.log(user)

  return (
    <AnimateWrapper>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-5xl font-light">AMSA Fintech</Link>
            <p className="text-gray-400">Welcome back, {session?.user?.email}</p>
          </div>
          {session && <LogoutButton />}
        </div>

        {session ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="b-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Total Balance</h2>
              <div className="text-3xl font-light">${user?.wallet?.balance}</div>
              <div className="text-sm text-gray-600 mt-2">Available for trading</div>
            </div>

            <div className="b-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>BTC/USD</span>
                  <span className="text-green-500">+2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>ETH/USD</span>
                  <span className="text-red-500">-1.2%</span>
                </div>
              </div>
            </div>

            <div className="b-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">No recent transactions</div>
              </div>
            </div>
            <div className="flex max-md:flex-wrap items-end justify-end md:col-span-3 gap-4">
                <SecondaryButton className='bg-blue-400 text-white w-[100px]'>
                  Deposit
                </SecondaryButton>
                <SecondaryButton className='bg-green-400 text-white w-[100px]'>
                  Buy
                </SecondaryButton>
                <SecondaryButton className='bg-red-400 text-white w-[100px]'>
                  Sell
                </SecondaryButton>
                <SecondaryButton className='w-[100px]'>
                  Swap
                </SecondaryButton>
                <SecondaryButton className='bg-yellow-400 text-white w-[100px]'>
                  Withdraw
                </SecondaryButton>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-light text-gray-400">Please sign in to access your dashboard.</p>
          </div>
        )}
      </div>
    </AnimateWrapper>
  )
}
