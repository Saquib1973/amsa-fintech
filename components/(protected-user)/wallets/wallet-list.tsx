'use client'
import React, { useMemo, useState } from 'react'
import type { Wallet } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { trimWalletAddress } from '@/lib/utils'

type WalletListProps = {
  wallets: Wallet[]
}

const WalletList = ({ wallets }: WalletListProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'crypto' | 'fiat'>('crypto')

  const { cryptoWallets, fiatWallets } = useMemo(() => {
    const crypto = wallets.filter((w) => w.type !== 'fiat')
    const fiat = wallets.filter((w) => w.type === 'fiat')
    return { cryptoWallets: crypto, fiatWallets: fiat }
  }, [wallets])

  const list = activeTab === 'crypto' ? cryptoWallets : fiatWallets

  return (
    <div className="w-full">
      <div className="inline-flex border border-gray-200 mb-6 bg-white">
        <button
          className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
            activeTab === 'crypto'
              ? 'bg-primary-main text-white'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('crypto')}
          type="button"
        >
          Crypto
        </button>
        <button
          className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
            activeTab === 'fiat'
              ? 'bg-primary-main text-white'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('fiat')}
          type="button"
        >
          Fiat
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-gray-400 text-center text-base mt-10">
          {activeTab === 'crypto'
            ? 'No crypto wallets yet.'
            : 'No fiat wallets yet.'}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 overflow-hidden">
          {list.map((wallet) => (
            <li key={wallet.id} className="">
              {wallet.type !== 'fiat' ? (
                <button
                  type="button"
                  className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => router.push(`/wallet/${wallet.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      Wallet Address
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="font-mono text-sm truncate text-gray-900 dark:text-white"
                        title={wallet.address || ''}
                      >
                        {trimWalletAddress(wallet.address || '')}
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        Crypto
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">Balance</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">
                      ${wallet.balance}
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-6 cursor-not-allowed opacity-80"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="font-mono text-sm truncate text-gray-900 dark:text-white"
                        title={wallet.address || ''}
                      >
                        {'Fiat Account'}
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        Fiat
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">Balance</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">
                      ${wallet.balance}
                    </div>
                  </div>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default WalletList
