import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import PrimaryButton from '@/components/button/primary-button'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Wallet } from '@prisma/client'

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
              <div
                key={wallet.id}
                className="group cursor-pointer border rounded-2xl p-6 bg-gray-50 dark:bg-gray-900 transition-shadow flex flex-col min-h-[160px] relative"
                title={wallet.address || ''}
                // onClick={() => router.push(`/wallets/${wallet.id}`)} // future navigation
              >
                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-medium ${wallet.type === 'fiat' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {wallet.type === 'fiat' ? 'Fiat' : 'Crypto'}
                </span>
                <div className="text-xs text-gray-500 mb-2">Wallet Address</div>
                <div className="font-mono text-sm break-all mb-4 text-gray-700 dark:text-gray-200 truncate max-w-full" title={wallet.address || ''}>
                  {wallet.address || ''}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
                <div className="flex flex-col mt-auto">
                  <span className="text-gray-500 text-xs">Balance</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${wallet.balance}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 mt-16 text-center text-base">No wallets found. Connect a wallet to get started!</div>
        )}
      </div>
    </div>
  )
}