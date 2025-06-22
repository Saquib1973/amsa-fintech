import ConnectWallet from '@/components/(protected-user)/dashboard/connect-wallet'
import WalletCard from '@/components/(protected-user)/dashboard/wallet-card'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Wallet } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wallets | AMSA Fintech and IT solutions',
  description: 'Wallets for AMSA Fintech and IT solutions',
  keywords: 'wallets, AMSA Fintech and IT solutions',
}

export default async function Wallets() {
  const session = await getSession()

  if (!session?.user?.email) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-light text-gray-400 dark:text-gray-500">
          Please sign in to access your dashboard.
        </p>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    include: {
      wallets: true,
    },
  })

  return (
    <AnimateWrapper>
      <div className="min-h-screen">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
                <h1 className="text-4xl md:text-6xl tracking-wider font-light">
                  Wallets
                </h1>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        {session ? (
          <SectionWrapper className="p-2 py-6 md:py-16">
            <div className="space-y-12">
              <div className="flex justify-center">
                <ConnectWallet />
              </div>
              {user?.wallets.length ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {user.wallets.map((wallet: Wallet) => (
                    <WalletCard key={wallet.id} wallet={wallet} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-2xl font-light text-gray-400 dark:text-gray-500">
                    Please sign in to access your dashboard.
                  </p>
                </div>
              )}
            </div>
          </SectionWrapper>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-light text-gray-400 dark:text-gray-500">
              Please sign in to access your dashboard.
            </p>
          </div>
        )}
      </div>
    </AnimateWrapper>
  )
}
