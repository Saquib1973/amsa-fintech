'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Copy, Check, Clock, Wallet, Network, Coins } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED'

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
}

const getStatusChip = (status: TransactionStatus) => {
  const baseClasses = "px-3 py-1 text-sm font-medium rounded-full inline-flex items-center gap-2"
  switch (status) {
    case 'COMPLETED':
      return <span className={`${baseClasses} text-green-800 bg-green-100`}>✓ Completed</span>
    case 'PENDING':
      return <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>⏳ Pending</span>
    case 'PROCESSING':
      return <span className={`${baseClasses} text-blue-800 bg-blue-100`}>🔄 Processing</span>
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return <span className={`${baseClasses} text-red-800 bg-red-100`}>❌ {status}</span>
    default:
      return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>{status}</span>
  }
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
      <div className="min-h-screen text-black dark:text-white animate-pulse">
        <OffWhiteHeadingContainer>
          <div>
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="py-6 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-gray-200 rounded w-24 mb-6"></div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full w-28"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-40"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center pt-6">
                <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
              </div>
            </div>
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
  const [copied, setCopied] = useState(false)

  const transactionId = params.id as string

  useEffect(() => {
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

    fetchTransaction()
  }, [transactionId])

  const handleCopyAddress = async () => {
    if (!transaction?.walletAddress) return

    try {
      await navigator.clipboard.writeText(transaction.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p')
  }

  if (loading) {
    return <TransactionDetailSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen text-black dark:text-white">
      <OffWhiteHeadingContainer>
        <div>
          <h1 className="text-4xl font-light">Transaction Details</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-2 font-light">
            {isBuy ? 'Bought' : 'Sold'} {transaction.cryptoCurrency}
          </p>
        </div>
      </OffWhiteHeadingContainer>

      <SectionWrapper className="py-6 md:py-16">
        <div className="max-w-4xl mx-auto">
          <SecondaryButton
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </SecondaryButton>
          <div className="space-y-6">
            {/* Transaction Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-3">
                    <CryptoIcon currency={transaction.cryptoCurrency} />
                    <div>
                      <div className="text-2xl font-semibold">
                        {isBuy ? 'Buy' : 'Sell'} {transaction.cryptoCurrency}
                      </div>
                      <div className="text-sm text-gray-500">
                        Transaction ID: {transaction.id}
                      </div>
                    </div>
                  </CardTitle>
                  {getStatusChip(transaction.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-lg">
                        {formatCurrency(
                          transaction.fiatAmount,
                          transaction.fiatCurrency,
                        )}
                      </span>
                    </div>
                    {transaction.fiatAmountInUsd && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount in USD:</span>
                        <span className="font-medium">
                          ${transaction.fiatAmountInUsd}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Type:</span>
                      <span
                        className={`font-medium ${
                          isBuy ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isBuy ? 'Buy' : 'Sell'}
                      </span>
                    </div>
                    {transaction.paymentOptionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">
                          {transaction.paymentOptionId
                            .replace(/_/g, ' ')
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Network:</span>
                      <span className="font-medium flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        {transaction.network}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(transaction.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <code className="flex-1 text-sm font-mono break-all">
                        {transaction.walletAddress}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  {transaction.walletLink && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Transaction Link
                      </label>
                      <a
                        href={transaction.walletLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status History Card */}
            {transaction.statusHistories &&
              Array.isArray(transaction.statusHistories) &&
              transaction.statusHistories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Status History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transaction.statusHistories.map(
                        (history: StatusHistory, index: number) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-medium">
                                  {history.status}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {formatDate(history.createdAt)}
                                </span>
                              </div>
                              {history.message && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {history.message}
                                </p>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <SecondaryButton onClick={() => router.push('/transactions')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Transactions
              </SecondaryButton>
              {transaction.walletLink && (
                <PrimaryButton
                  onClick={() =>
                    window.open(transaction.walletLink, '_blank')
                  }
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </SectionWrapper>
      </div>
      </AnimateWrapper>
  )
}

export default TransactionDetailPage