'use server'
import { prisma } from '@/lib/prisma'
import React from 'react'
import Link from 'next/link'
import { getStatusColor, trimWalletAddress } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import type { Transaction } from '@prisma/client'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
const quickLinks = [
  {
    label: 'Transactions',
    href: '/transactions',
  },
  {
    label: 'Assets',
    href: '/assets',
  },
  {
    label: 'Wallets',
    href: '/wallets',
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
]
const page = async ({ params }: { params: Promise<{ wallet: string }> }) => {
  const wallet = await prisma.wallet.findUnique({
    where: {
      id: (await params).wallet,
    },
  })

  if (!wallet) {
    return <div>Wallet not found</div>
  }
  if (wallet?.address) {
    const transactions = await prisma.transaction.findMany({
      where: {
        walletAddress: wallet.address,
      },
    })

    const totalTransactions = transactions.reduce(
      (acc, transaction) => acc + transaction.fiatAmount,
      0
    )
    return (
      <AnimateWrapper>
        <OffWhiteHeadingContainer>
          <h1 className="text-4xl font-light">Wallet</h1>
        </OffWhiteHeadingContainer>
        <div className=" w-full max-w-6xl mx-auto px-4 py-6 flex flex-col border-b border-gray-200 ">
          <div className="flex items-center max-md:flex-col max-md:items-start justify-between gap-2 text-3xl font-light">
            <div className="flex items-end justify-start gap-2 ">
              <p>Transactions Amount : </p>
              <p className="text-primary-main">${totalTransactions}</p>
            </div>
            <div className="flex items-end justify-center gap-2">
              <span className="">Type:</span>
              <div className="capitalize">{wallet.type}</div>
            </div>
          </div>
          <div className="flex items-center justify-start my-4 gap-2 text-3xl font-light">
            <div className="font-mono text-sm text-gray-700 dark:text-gray-200 break-all">
              <span title={wallet.address || ''}>
                {trimWalletAddress(wallet.address || '')}
              </span>
            </div>
          </div>
          <div className="flex md:justify-end items-center gap-2">
            <span className="text-gray-500 text-xs">Created:</span>
            <div className="text-sm">
              {wallet.createdAt?.toLocaleString?.() ?? String(wallet.createdAt)}
            </div>
          </div>
        </div>
        <div className="max-w-6xl flex max-md:flex-col mx-auto my-10 px-2">
          <div className="flex flex-col md:w-2/3">
            <h1 className="text-2xl font-light my-4">
              Recent wallet transactions
            </h1>
            {transactions
              .slice(0, transactions.length >= 8 ? 8 : transactions.length)
              .map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
          </div>
          <div className="md:w-1/3 p-2">
            <div className="flex flex-col rounded-md">
              <h1 className="text-2xl mb-3 font-light border-b border-gray-200 py-4 px-4">
                Quick Links
              </h1>
              {quickLinks.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="hover:text-black text-gray-500 px-4 rounded-md hover:bg-gray-50 py-2 transition-all duration-500"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AnimateWrapper>
    )
  }
}

const SimpleCryptoIcon = ({ currency }: { currency: string }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
    {currency.slice(0, 3).toUpperCase()}
  </div>
)

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/transaction/${transaction.id}`}
      className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-2 py-3 group rounded-md"
      aria-label={`View details for ${actionText} ${transaction.cryptoCurrency} transaction`}
    >
      <div className="flex items-center gap-2 min-w-[40px]">
        <SimpleCryptoIcon currency={transaction.cryptoCurrency} />
      </div>
      <div className="flex-1 min-w-0 px-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors duration-100">
            {actionText} {transaction.cryptoCurrency}
          </span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-400">
            {transaction.network}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {format(new Date(transaction.createdAt), 'PP')}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 min-w-[90px]">
        <span className="text-gray-800 text-sm">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: transaction.fiatCurrency,
          }).format(transaction.fiatAmount)}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(transaction.status)}`}
          />
          {transaction.status}
        </div>
      </div>
      <div className="flex items-center ml-2" title="View transaction details">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export default page
