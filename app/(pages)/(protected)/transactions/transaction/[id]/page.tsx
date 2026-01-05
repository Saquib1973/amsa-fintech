'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Clock, Wallet, Network, Coins, RotateCw } from 'lucide-react'
import { format } from 'date-fns'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { SimpleButton } from '@/components/ui/simple-button'
import { getStatusColor, trimWalletAddress } from '@/lib/utils'
import type { TransactionStatus } from '@/types/transaction-types'
import { useToast } from '@/components/ui/use-toast'

interface StatusHistory {
  status: string
  createdAt: string
  message?: string
}

interface Transaction {
  id: string
  isBuyOrSell: 'BUY' | 'SELL'
  fiatAmount: number
  fiatCurrency: string
  cryptoCurrency: string
  walletAddress: string
  walletLink: string
  network: string
  status: TransactionStatus
  paymentOptionId?: string
  fiatAmountInUsd?: string
  statusHistories?: StatusHistory[]
  createdAt: string
  updatedAt: string
  userId: string
  amountPaid?: number
  cryptoAmount?: number
  totalFeeInFiat?: number
  countryCode?: string
  stateCode?: string
  statusReason?: string
  transakFeeAmount?: number
  cardPaymentData?: Record<string, unknown>
}

const getStatusChip = (status: TransactionStatus) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${getStatusColor(status)}`} />
      <span className="text-sm text-gray-600">{status}</span>
    </div>
  )
}

const CryptoIcon = ({ currency }: { currency: string }) => {
  const getCryptoColor = (crypto: string) => {
    switch (crypto.toUpperCase()) {
      case 'BTC': return 'bg-orange-500'
      case 'ETH': return 'bg-blue-500'
      case 'USDT': return 'bg-green-500'
      case 'USDC': return 'bg-blue-400'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className={`w-10 h-10 rounded-full ${getCryptoColor(currency)} flex items-center justify-center text-white font-bold text-sm`}>
      {currency.slice(0, 3)}
    </div>
  )
}

const TransactionDetailSkeleton = () => {
  return (
    <AnimateWrapper>
      <div className="min-h-[calc(100vh-69px)] text-black dark:text-white animate-pulse">
        <OffWhiteHeadingContainer>
          <div>
            <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="max-w-2xl mx-auto max-md:px-1 py-6 md:py-10 pb-8 mb-8">
          {/* Action Button Skeleton */}
          <div className="flex gap-3 justify-start mb-6 mr-2">
            <div className="h-10 w-[200px] rounded-md bg-gray-200 flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full mr-2" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="space-y-10 px-2">
            {/* Transaction Summary Section */}
            <section className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>

              {/* Transaction Header with Crypto Icon */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </div>

              {/* Transaction Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-gray-50 rounded-md p-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-1">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Wallet Information Section */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-1">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </section>

            {/* Status History Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      {/* Status dot */}
                      <div className={`relative z-10 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 ${
                        i === 2 ? 'bg-gray-200' : 'bg-gray-200'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Status header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            {i === 2 && (
                              <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                            )}
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>

                        {/* Message content */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                              {[...Array(4)].map((_, j) => (
                                <div key={j} className="flex flex-col">
                                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}

const TransactionDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const toast = useToast()
  const [updating, setUpdating] = useState(false)

  const transactionId = params.id as string

  // Reusable fetch function
  const fetchTransaction = async () => {
    if (!transactionId) return
    try {
      setLoading(true)
      const response = await fetch(`/api/transaction/${transactionId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Transaction not found')
        }
        throw new Error('Failed to fetch transaction')
      }
      const data = await response.json()
      setTransaction(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransaction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId])



  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p')
  }



  const handleUpdateStatus = async () => {
    setUpdating(true)
    setError(null)
    try {
      const response = await fetch(`/api/transaction/${transactionId}`, {
        method: 'PATCH',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status')
      }
      toast({ title: 'Status Updated', description: 'Transaction status has been refreshed.' })
      // Show skeleton and refetch transaction
      await fetchTransaction()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update status', variant: 'destructive' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <TransactionDetailSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-69px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Transaction</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <SecondaryButton onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </SecondaryButton>
            <PrimaryButton onClick={() => window.location.reload()}>
              Try Again
            </PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-[calc(100vh-69px)] flex items-center justify-center">
        <div className="text-center flex items-center justify-center flex-col ">
          <div className="text-gray-500 text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Transaction Not Found</h1>
          <p className="text-gray-600 mb-6">The transaction you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          <SecondaryButton className='' onClick={() => router.push('/transactions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </SecondaryButton>
        </div>
      </div>
    )
  }

  const isBuy = transaction.isBuyOrSell === 'BUY'

  return (
    <AnimateWrapper>
      <div className="min-h-[calc(100vh-69px)] text-black dark:text-white">
        <OffWhiteHeadingContainer>
          <div>
            <h1 className="text-4xl font-light mb-1">Transaction Details</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
              {isBuy ? 'Bought' : 'Sold'} {transaction.cryptoCurrency}
            </p>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="max-w-2xl mx-auto max-md:px-1 py-6 md:py-10 pb-8 mb-8">
          {/* Action Button */}
          <div className="flex gap-3 justify-start mb-6 mr-2">
            <SimpleButton
              onClick={handleUpdateStatus}
              className="flex items-center rounded-md p-2 ml-auto w-[200px] gap-2"
              disabled={updating}
              variant="outline"
            >
              {updating && <RotateCw
                className="animate-spin w-4 h-4" />}
              {updating ? 'Refreshing...' : 'Refresh Status'}
            </SimpleButton>
          </div>
          <div className="space-y-10 px-2">
            {/* Transaction Summary */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Transaction Summary
              </h2>
              <div className="flex items-center gap-3 mb-2">
                <CryptoIcon currency={transaction.cryptoCurrency} />
                <div>
                  <div className="text-lg text-gray-900 font-medium">
                    {isBuy ? 'Buy' : 'Sell'} {transaction.cryptoCurrency}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {transaction.id}
                  </div>
                </div>
                <span className="ml-auto">
                  {getStatusChip(transaction.status)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-gray-50 rounded-md p-4">
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      transaction.fiatAmount,
                      transaction.fiatCurrency
                    )}
                  </span>
                </div>
                {transaction.fiatAmountInUsd && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Amount in USD</span>
                    <span className="text-gray-900">
                      ${transaction.fiatAmountInUsd}
                    </span>
                  </div>
                )}
                {transaction.cryptoAmount && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Crypto Amount</span>
                    <span className="text-gray-900">
                      {transaction.cryptoAmount} {transaction.cryptoCurrency}
                    </span>
                  </div>
                )}
                {transaction.amountPaid && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        transaction.amountPaid,
                        transaction.fiatCurrency
                      )}
                    </span>
                  </div>
                )}
                {transaction.totalFeeInFiat && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Total Fee</span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        transaction.totalFeeInFiat,
                        transaction.fiatCurrency
                      )}
                    </span>
                  </div>
                )}
                {transaction.transakFeeAmount && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Transak Fee</span>
                    <span className="text-gray-900">
                      ${transaction.transakFeeAmount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Type</span>
                  <span className={isBuy ? 'text-green-600' : 'text-red-600'}>
                    {isBuy ? 'Buy' : 'Sell'}
                  </span>
                </div>
                {transaction.paymentOptionId && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="text-gray-900">
                      {transaction.paymentOptionId
                        .replace(/_/g, ' ')
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Network</span>
                  <span className="text-gray-900 flex items-center gap-1">
                    <Network className="w-4 h-4" />
                    {transaction.network}
                  </span>
                </div>
                {transaction.countryCode && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Country</span>
                    <span className="text-gray-900">
                      {transaction.countryCode}
                    </span>
                  </div>
                )}
                {transaction.stateCode && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">State</span>
                    <span className="text-gray-900">
                      {transaction.stateCode}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Updated</span>
                  <span className="text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(transaction.updatedAt)}
                  </span>
                </div>
              </div>
            </section>

            {/* Wallet Info Section */}
            <section className="space-y-2">
              <h2 className="text-base font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Wallet className="w-5 h-5" />
                Wallet Information
              </h2>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <code className="flex-1 text-sm font-mono break-all">
                  {trimWalletAddress(transaction.walletAddress, 6, 4)}
                </code>
              </div>
              {transaction.walletLink && (
                <div className="mt-1">
                  <a
                    href={transaction.walletLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </a>
                </div>
              )}
            </section>

            {/* Status Reason Section */}
            {transaction.statusReason && (
              <section className="space-y-2">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <Coins className="w-5 h-5" />
                  Status Reason
                </h2>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    {transaction.statusReason}
                  </p>
                </div>
              </section>
            )}

            {/* Status History Section */}
            {transaction.statusHistories &&
              Array.isArray(transaction.statusHistories) &&
              transaction.statusHistories.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-base font-medium text-gray-700 flex items-center gap-2 mb-3">
                    <Coins className="w-5 h-5" />
                    Status History
                  </h2>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6">
                      {transaction.statusHistories.map(
                        (history: StatusHistory, index: number) => {
                          // Parse the message to extract structured data
                          const message = history.message || ''
                          const isLast =
                            index === transaction.statusHistories!.length - 1

                          // Extract key information from the message
                          const extractOrderInfo = (msg: string) => {
                            const orderIdMatch = msg.match(
                              /\*Order Id:\* ([a-f0-9-]+)/
                            )
                            const emailMatch = msg.match(/\*Email:\* ([^\s*]+)/)
                            const cryptoAmountMatch = msg.match(
                              /\*Crypto Amount:\* ([0-9.]+ [A-Z]+)/
                            )
                            const fiatAmountMatch = msg.match(
                              /\*Fiat Amount:\* ([0-9]+ [A-Z]+)/
                            )
                            const paymentMethodMatch = msg.match(
                              /\*Payment Method:\* ([^\s*]+)/
                            )
                            const walletAddressMatch = msg.match(
                              /\*Wallet Address:\* ([a-fA-F0-9x]+)/
                            )
                            const liquidityProviderMatch = msg.match(
                              /\*Liquidity Provider\* ([^\s*]+)/
                            )

                            return {
                              orderId: orderIdMatch?.[1],
                              email: emailMatch?.[1],
                              cryptoAmount: cryptoAmountMatch?.[1],
                              fiatAmount: fiatAmountMatch?.[1],
                              paymentMethod: paymentMethodMatch?.[1],
                              walletAddress: walletAddressMatch?.[1],
                              liquidityProvider: liquidityProviderMatch?.[1],
                            }
                          }

                          const orderInfo = extractOrderInfo(message)
                          const hasStructuredData =
                            orderInfo.orderId ||
                            orderInfo.cryptoAmount ||
                            orderInfo.fiatAmount

                          return (
                            <div
                              key={index}
                              className="relative flex items-start gap-4"
                            >
                              {/* Status dot */}
                              <div
                                className={`relative z-10 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 ${
                                  isLast ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    isLast ? 'bg-white' : 'bg-gray-600'
                                  }`}
                                ></div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Status header */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 text-sm">
                                      {history.status.replace(/_/g, ' ')}
                                    </span>
                                    {isLast && (
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-gray-500 text-xs whitespace-nowrap ml-2">
                                    {formatDate(history.createdAt)}
                                  </span>
                                </div>

                                {/* Message content */}
                                {message && (
                                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    {hasStructuredData ? (
                                      <div className="space-y-3">
                                        {/* Clean message without structured data */}
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                          {message
                                            .replace(/\*[^*]+\*/g, '')
                                            .trim()}
                                        </p>

                                        {/* Structured data grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                                          {orderInfo.orderId && (
                                            <div className="flex flex-col">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Order ID
                                              </span>
                                              <span className="text-sm text-gray-900 font-mono">
                                                {orderInfo.orderId}
                                              </span>
                                            </div>
                                          )}
                                          {orderInfo.email && (
                                            <div className="flex flex-col">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Email
                                              </span>
                                              <span className="text-sm text-gray-900">
                                                {orderInfo.email}
                                              </span>
                                            </div>
                                          )}
                                          {orderInfo.cryptoAmount && (
                                            <div className="flex flex-col">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Crypto Amount
                                              </span>
                                              <span className="text-sm text-gray-900 font-semibold">
                                                {orderInfo.cryptoAmount}
                                              </span>
                                            </div>
                                          )}
                                          {orderInfo.fiatAmount && (
                                            <div className="flex flex-col">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Fiat Amount
                                              </span>
                                              <span className="text-sm text-gray-900 font-semibold">
                                                {orderInfo.fiatAmount}
                                              </span>
                                            </div>
                                          )}
                                          {orderInfo.paymentMethod && (
                                            <div className="flex flex-col">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Payment Method
                                              </span>
                                              <span className="text-sm text-gray-900 capitalize">
                                                {orderInfo.paymentMethod.replace(
                                                  /_/g,
                                                  ' '
                                                )}
                                              </span>
                                            </div>
                                          )}
                                          {orderInfo.liquidityProvider && (
                                            <div className="flex flex-col">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Provider
                                              </span>
                                              <span className="text-sm text-gray-900">
                                                {orderInfo.liquidityProvider}
                                              </span>
                                            </div>
                                          )}
                                          {orderInfo.walletAddress && (
                                            <div className="flex flex-col sm:col-span-2">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Wallet Address
                                              </span>
                                              <span className="text-sm text-gray-900 font-mono break-all">
                                                {trimWalletAddress(orderInfo.walletAddress || '', 6, 4)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-700 leading-relaxed">
                                        {message}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                </section>
              )}
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}

export default TransactionDetailPage