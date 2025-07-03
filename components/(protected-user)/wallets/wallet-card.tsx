import type { Wallet } from '@prisma/client'
import Link from 'next/link'
import React from 'react'

const WalletCard = ({ wallet }: { wallet: Wallet }) => {
  return (
    <Link
      href={`/wallet/${wallet.id}`}
      key={wallet.id}
      className="group cursor-pointer border rounded-2xl p-6 bg-gray-50 dark:bg-gray-900 transition-shadow flex flex-col min-h-[160px] relative"
      title={wallet.address || ''}
    >
      <span
        className={`absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-medium ${wallet.type === 'fiat' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
      >
        {wallet.type === 'fiat' ? 'Fiat' : 'Crypto'}
      </span>
      <div className="text-xs text-gray-500 mb-2">Wallet Address</div>
      <div
        className="font-mono text-sm break-all mb-4 text-gray-700 dark:text-gray-200 truncate max-w-full"
        title={wallet.address || ''}
      >
        {wallet.address || ''}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
      <div className="flex flex-col mt-auto">
        <span className="text-gray-500 text-xs">Balance</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          ${wallet.balance}
        </span>
      </div>
    </Link>
  )
}

export default WalletCard
