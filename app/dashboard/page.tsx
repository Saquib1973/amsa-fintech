import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import LogoutButton from '@/components/button/logout-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Link from 'next/link'
import SecondaryButton from '@/components/button/secondary-button'
import { prisma } from '@/lib/prisma'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'

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

  return (
    <AnimateWrapper>
      <div className="min-h-screen">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <Link
                href="/"
                className="text-6xl font-light hover:text-blue-400 transition-colors"
              >
                AMSA Fintech
              </Link>
              <p className="text-xl text-gray-500 mt-2 font-light">
                Welcome back, {session?.user?.email}
              </p>
            </div>
            {session && (
              <div className='flex gap-4 max-md:ml-auto max-md:mt-4'>
                <LogoutButton />
              </div>
            )}
          </div>
        </OffWhiteHeadingContainer>

        {session ? (
          <SectionWrapper className="py-6 md:py-16">
            <div className="space-y-12">
              <div className="flex flex-wrap gap-4 justify-end">
                <SecondaryButton className="bg-blue-400 hover:bg-blue-500 text-white w-[120px] transition-colors">
                  Deposit
                </SecondaryButton>
                <SecondaryButton className="bg-green-400 hover:bg-green-500 text-white w-[120px] transition-colors">
                  Buy
                </SecondaryButton>
                <SecondaryButton className="bg-red-400 hover:bg-red-500 text-white w-[120px] transition-colors">
                  Sell
                </SecondaryButton>
                <SecondaryButton className="hover:bg-gray-100 w-[120px] transition-colors">
                  Swap
                </SecondaryButton>
                <SecondaryButton className="bg-yellow-400 hover:bg-yellow-500 text-white w-[120px] transition-colors">
                  Withdraw
                </SecondaryButton>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-100 rounded-md p-8">
                  <h2 className="text-2xl font-light mb-4 text-gray-900">
                    Total Balance
                  </h2>
                  <div className="text-5xl font-light text-gray-900">
                    ${user?.wallet?.balance}
                  </div>
                  <div className="text-lg text-gray-500 mt-2 font-light">
                    Available for trading
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-md p-8">
                  <h2 className="text-2xl font-light mb-4 text-gray-900">
                    Market Overview
                  </h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-gray-700 font-light">
                        BTC/USD
                      </span>
                      <span className="text-green-500 text-xl font-light">
                        +2.5%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-gray-700 font-light">
                        ETH/USD
                      </span>
                      <span className="text-red-500 text-xl font-light">
                        -1.2%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className="bg-white border border-gray-100 rounded-md p-8">
                  <h2 className="text-2xl font-light mb-4 text-gray-900">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    <div className="text-xl text-gray-500 italic font-light">
                      No recent transactions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-light text-gray-400">
              Please sign in to access your dashboard.
            </p>
          </div>
        )}
      </div>
    </AnimateWrapper>
  )
}
