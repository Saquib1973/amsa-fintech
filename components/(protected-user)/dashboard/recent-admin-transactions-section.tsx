import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getStatusColor } from '@/lib/utils'
import { format } from 'date-fns'
import type { TransactionStatus } from '@/types/transaction-types'

type AdminTransaction = {
  id: string
  cryptoCurrency: string
  fiatAmount: number
  fiatCurrency: string
  status: string
  createdAt: Date
  network?: string | null
  isBuyOrSell?: string | null
  user: {
    name: string | null
    email: string | null
  }
}

interface RecentAdminTransactionsSectionProps {
  transactions: AdminTransaction[]
}

const SimpleCryptoIcon = ({ currency }: { currency: string }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
    {currency.slice(0, 4).toUpperCase()}
  </div>
)

const AdminTransactionItem = ({ transaction }: { transaction: AdminTransaction }) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/admin/transaction/${transaction.id}`}
      className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-4 py-3 group"
    >
      <div className="flex items-center gap-2 min-w-[40px]">
        <SimpleCryptoIcon currency={transaction.cryptoCurrency} />
      </div>
      <div className="flex-1 min-w-0 px-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors duration-100">
            {actionText} {transaction.cryptoCurrency}
          </span>
          {transaction.network && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-400">
              {transaction.network}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {transaction.user.name || transaction.user.email} • {format(new Date(transaction.createdAt), 'PP')}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 min-w-[90px]">
        <span className="text-gray-800 text-sm">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: transaction.fiatCurrency || 'USD',
          }).format(Number(transaction.fiatAmount))}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(transaction.status as TransactionStatus)}`}
          />
          {transaction.status}
        </div>
      </div>
      <div className="flex items-center ml-2">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export default function RecentAdminTransactionsSection({ transactions }: RecentAdminTransactionsSectionProps) {
  return (
    <div className="bg-white rounded-md border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-primary-main rounded-t-md text-white">
        <h2 className="text-xl">Recent Transactions</h2>
      </div>
      <div className="">
        {transactions.length > 0 ? (
          <div className="">
            {transactions.map((transaction) => (
              <AdminTransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No transactions found</p>
          </div>
        )}
      </div>
      <Link
        href="/admin/all-transactions"
        className="flex w-full items-center hover:text-primary-main hover:bg-gray-50 justify-center gap-2 rounded-b-md px-4 py-4 text-sm font-medium transition-colors group border-t border-gray-100"
      >
        <span>View all transactions</span>
        <ChevronRight className="h-4 w-4 group-hover:text-primary-main transition-all group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
