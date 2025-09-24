import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import WalletList from '@/components/(protected-user)/wallets/wallet-list'
import ConnectWallet from '@/components/(protected-user)/dashboard/connect-wallet'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

export default async function Wallets() {

  const session = await getSession()

  if (!session?.user?.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-semibold mb-4">Wallets</h1>
        <p className="text-gray-400">Please sign in to access your wallets.</p>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wallets: true },
  })

  return (
    <AnimateWrapper>

    <div className="min-h-screen bg-white dark:bg-black">
      <OffWhiteHeadingContainer>
        <span className="block text-4xl md:text-6xl font-light tracking-wide">Wallets</span>
      </OffWhiteHeadingContainer>
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8">
        <ConnectWallet />
        {user?.wallets && user.wallets.length > 0 ? (
          <WalletList wallets={user.wallets} />
        ) : (
          <div className="text-gray-400 mt-16 text-center text-base">No wallets found. Connect a wallet to get started!</div>
        )}
      </div>
    </div>
          </AnimateWrapper>
  )
}