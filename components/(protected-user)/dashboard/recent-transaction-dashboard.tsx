import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Transaction } from '@/types/transaction-types'
import React from 'react'
import { getStatusColor } from '@/lib/utils'
import { format } from 'date-fns'
const SimpleCryptoIcon = ({ currency }: { currency: string }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
    {currency.slice(0, 4).toUpperCase()}
  </div>
)
const DashboardTransactionItem = ({
  transaction,
}: {
  transaction: Transaction
}) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/transaction/${transaction.id}`}
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
            currency: transaction.fiatCurrency || 'USD',
          }).format(Number(transaction.fiatAmount))}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(transaction.status)}`}
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
const RecentTransactionDashboard = ({
  transactions,
  txArrLen,
}: {
  transactions: Transaction[]
  txArrLen: number
}) => {
  return (
    <div className="bg-white rounded-md border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-primary-main rounded-t-md text-white">
        <h2 className="text-xl">
          Recent Transactions
        </h2>
      </div>
      <div className="">
        {txArrLen > 0 ? (
          <div className="">
            {transactions.map((transaction) => {
              const transformedTransaction = {
                ...transaction,
                statusHistories:
                  transaction.statusHistories &&
                  typeof transaction.statusHistories === 'string'
                    ? (() => {
                        try {
                          return JSON.parse(transaction.statusHistories)
                        } catch {
                          return transaction.statusHistories
                        }
                      })()
                    : transaction.statusHistories,
              }
              return (
                <DashboardTransactionItem
                  key={transformedTransaction.id}
                  transaction={transformedTransaction as Transaction}
                />
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-8">
              No recent transactions.
            </p>
            <Link
              href="/assets"
              className="text-white transition-all bg-primary-main px-6 py-3 rounded-md mx-auto text-sm"
            >
              Buy your first asset
            </Link>
          </div>
        )}
      </div>
      <div className="pb-4 pt-4 flex items-center justify-center">
        {txArrLen > 0 && (
          <Link
            href="/transactions"
            className="group inline-flex items-center text-sm font-medium hover:text-primary-main transition-colors"
          >
            View all transactions
            <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default RecentTransactionDashboard
