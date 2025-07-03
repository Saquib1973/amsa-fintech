import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import PrimaryButton from '@/components/button/primary-button'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Wallet } from '@prisma/client'
import WalletCard from '@/components/(protected-user)/wallets/wallet-card'

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
    <div className="min-h-screen bg-white dark:bg-black">
      <OffWhiteHeadingContainer>
        <span className="block text-4xl md:text-6xl font-light tracking-wide">Wallets</span>
      </OffWhiteHeadingContainer>
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8">
        <PrimaryButton className="mb-10" type="button">Connect Wallet</PrimaryButton>
        {user?.wallets && user.wallets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {user.wallets.map((wallet: Wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 mt-16 text-center text-base">No wallets found. Connect a wallet to get started!</div>
        )}
      </div>
    </div>
  )
}