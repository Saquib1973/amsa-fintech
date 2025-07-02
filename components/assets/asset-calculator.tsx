'use client'
import { CoinData } from '@/types/coingecko-types'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import TransakPaymentComponent from '../transak-payment-component'
import { useSession } from 'next-auth/react'
import PrimaryButton from '../button/primary-button'
import Confetti from '../confetti'
import toast from 'react-hot-toast'
import Breadcrumb from '../bread-crumb'
import { ExternalLink, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { SimpleButton } from '@/components/ui/simple-button'
import { useRouter } from 'next/navigation'
import type { TransactionStatus, TransakOrderData } from '@/types/transaction-types'

interface TransactionData {
  id: string
  userId: string
  isBuyOrSell: string
  fiatCurrency: string
  cryptoCurrency: string
  fiatAmount: number
  status: TransactionStatus
  amountPaid: number
  paymentOptionId: string
  walletAddress: string
  walletLink: string
  network: string
  cryptoAmount: number
  totalFeeInFiat: number
  fiatAmountInUsd: string | null
  countryCode: string
  stateCode: string
  createdAt: string
  updatedAt: string
  statusReason?: string
  transakFeeAmount?: number
  cardPaymentData?: {
    status: TransactionStatus
    statusReason?: string
    processedOn?: string
  }
  statusHistories?: Array<{
    status: TransactionStatus
    createdAt: string
    message?: string
  }>
}

interface TransactionReceiptProps {
  orderData: TransactionData
  onClose: () => void
}

const TransactionReceipt = ({
  orderData,
  onClose,
}: TransactionReceiptProps) => {
  const [liveOrderData, setLiveOrderData] = useState(orderData)
  const [isPolling, setIsPolling] = useState(false)
  const [isFinal, setIsFinal] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLiveOrderData(orderData)
    setIsFinal(
      [
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'EXPIRED',
      ].includes(orderData.status)
    )
    if (!isFinal && orderData.id && orderData.id !== 'N/A') {
      setIsPolling(true)
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/transaction/status?orderId=${orderData.id}`)
          const data = await res.json()
          if (data?.data) {
            setLiveOrderData((prev) => ({ ...prev, ...data.data }))
            if ([
              'COMPLETED',
              'FAILED',
              'CANCELLED',
              'EXPIRED',
            ].includes(data.data.status)) {
              setIsFinal(true)
              setIsPolling(false)
              if (pollingRef.current) clearInterval(pollingRef.current)
            }
          }
        } catch {
          // Optionally handle error
        }
      }, 5000)
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [orderData])

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch {
        return 'Invalid Object'
      }
    }
    return String(value)
  }
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    } catch {
      return 'Invalid Date'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="bg-white w-screen h-screen overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-xl font-medium text-gray-900">Transaction Receipt</h2>
            <SimpleButton
              variant="outline"
              size="sm"
              onClick={onClose}
              className="!p-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </SimpleButton>
          </div>
          {/* Live Status Indicator - simple and subtle, now under the heading */}
          <div className="flex items-center gap-2 mb-4 ml-6 text-xs text-gray-500">
            {isPolling ? (
              <Loader2 className="animate-spin text-blue-400" size={14} />
            ) : isFinal ? (
              <CheckCircle2 className="text-green-400" size={14} />
            ) : null}
            <span>
              {isPolling ? 'Live status update' : isFinal ? 'Status up to date' : ''}
            </span>
          </div>
          <div className="border-b border-gray-100" />

          <div className="p-6 space-y-8">
            {/* Transaction Summary */}
            <section className="space-y-4">
              <h3 className="text-base font-medium text-gray-800">
                Transaction Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-gray-50 rounded-md p-4">
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`font-medium ${liveOrderData.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}
                  >
                    {formatValue(liveOrderData.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium">
                    {formatValue(liveOrderData.fiatAmount)}{' '}
                    {formatValue(liveOrderData.fiatCurrency)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Crypto Amount</span>
                  <span className="font-medium">
                    {formatValue(liveOrderData.cryptoAmount)}{' '}
                    {formatValue(liveOrderData.cryptoCurrency)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">
                    {formatValue(liveOrderData.paymentOptionId)
                      .replace(/_/g, ' ')
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium">
                    {formatValue(liveOrderData.network)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Amount in USD</span>
                  <span className="font-medium">
                    ${formatValue(liveOrderData.fiatAmountInUsd)}
                  </span>
                </div>
              </div>
            </section>

            {/* Wallet Information */}
            <section className="space-y-2">
              <h3 className="text-base font-medium text-gray-800">
                Wallet Information
              </h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <code className="flex-1 text-sm font-mono break-all">
                  {formatValue(liveOrderData.walletAddress)}
                </code>
                {liveOrderData.walletLink && (
                  <Link
                    href={liveOrderData.walletLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-1 items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </section>

            {/* Fee Information */}
            <section className="space-y-2">
              <h3 className="text-base font-medium text-gray-800">
                Fee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Total Fees</span>
                  <span className="font-medium">
                    {formatValue(liveOrderData.totalFeeInFiat)}{' '}
                    {formatValue(liveOrderData.fiatCurrency)}
                  </span>
                </div>
                {liveOrderData.transakFeeAmount && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500">Transak Fee</span>
                    <span className="font-medium">
                      {formatValue(liveOrderData.transakFeeAmount)}{' '}
                      {formatValue(liveOrderData.fiatCurrency)}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Timestamps */}
            <section className="space-y-2">
              <h3 className="text-base font-medium text-gray-800">
                Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {formatDate(liveOrderData.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-medium">
                    {formatDate(liveOrderData.updatedAt)}
                  </span>
                </div>
              </div>
            </section>

            {/* Status History */}
            {liveOrderData.statusHistories &&
              liveOrderData.statusHistories.length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-base font-medium text-gray-800">
                    Status History
                  </h3>
                  <div className="space-y-2">
                    {liveOrderData.statusHistories?.map((history, index) => {
                      const message = history.message || ''
                      // Extract structured data from message
                      const extractOrderInfo = (msg: string) => {
                        const orderIdMatch = msg.match(/\*Order Id:\* ([a-f0-9-]+)/)
                        const emailMatch = msg.match(/\*Email:\* ([^\s*]+)/)
                        const cryptoAmountMatch = msg.match(/\*Crypto Amount:\* ([0-9.]+ [A-Z]+)/)
                        const fiatAmountMatch = msg.match(/\*Fiat Amount:\* ([0-9]+ [A-Z]+)/)
                        const paymentMethodMatch = msg.match(/\*Payment Method:\* ([^\s*]+)/)
                        const walletAddressMatch = msg.match(/\*Wallet Address:\* ([a-fA-F0-9x]+)/)
                        const liquidityProviderMatch = msg.match(/\*Liquidity Provider\* ([^\s*]+)/)
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
                        <div key={index} className="flex items-start gap-2 text-sm">
                          {/* Timeline dot */}
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: index === liveOrderData.statusHistories!.length - 1 ? '#2563eb' : '#a3a3a3' }} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{formatValue(history.status)}</span>
                              <span className="text-gray-400 text-xs">{formatDate(history.createdAt)}</span>
                            </div>
                            {message && (
                              <div className="mt-1">
                                {hasStructuredData ? (
                                  <>
                                    <span className="text-gray-700">{message.replace(/\*[^*]+\*/g, '').trim()}</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                                      {orderInfo.orderId && (
                                        <div><span className="text-xs text-gray-500">Order ID:</span> <span className="font-mono">{orderInfo.orderId}</span></div>
                                      )}
                                      {orderInfo.email && (
                                        <div><span className="text-xs text-gray-500">Email:</span> {orderInfo.email}</div>
                                      )}
                                      {orderInfo.cryptoAmount && (
                                        <div><span className="text-xs text-gray-500">Crypto:</span> <span className="font-semibold">{orderInfo.cryptoAmount}</span></div>
                                      )}
                                      {orderInfo.fiatAmount && (
                                        <div><span className="text-xs text-gray-500">Fiat:</span> <span className="font-semibold">{orderInfo.fiatAmount}</span></div>
                                      )}
                                      {orderInfo.paymentMethod && (
                                        <div><span className="text-xs text-gray-500">Payment:</span> <span className="capitalize">{orderInfo.paymentMethod.replace(/_/g, ' ')}</span></div>
                                      )}
                                      {orderInfo.liquidityProvider && (
                                        <div><span className="text-xs text-gray-500">Provider:</span> {orderInfo.liquidityProvider}</div>
                                      )}
                                      {orderInfo.walletAddress && (
                                        <div className="col-span-2"><span className="text-xs text-gray-500">Wallet:</span> <span className="font-mono break-all">{orderInfo.walletAddress}</span></div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-gray-700">{message}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center p-6 border-t border-gray-100 gap-4">
            <SimpleButton variant="secondary" onClick={onClose}>
              Close
            </SimpleButton>
            <div className="flex gap-2 justify-between">

            <SimpleButton
              variant="secondary"
              onClick={() => {
                if (liveOrderData.id && liveOrderData.id !== 'N/A' && liveOrderData.id !== 'ERROR') {
                  router.push(`/transactions/${liveOrderData.id}`)
                } else {
                  toast.error('Transaction ID not available!')
                }
              }}
            >
              Details
            </SimpleButton>
            <SimpleButton
              variant="primary-outlined"
              onClick={() => router.push('/transactions')}
              >
              All Transactions
            </SimpleButton>
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface AssetCalculatorProps {
  coinData: CoinData
  selectedCurrency: string
}

const AssetCalculator = ({
  coinData,
  selectedCurrency,
}: AssetCalculatorProps) => {
  const [amount, setAmount] = useState('')
  const [cryptoAmount, setCryptoAmount] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderData, setOrderData] = useState<TransactionData | null>(null)
  const [lastTransakOrderData, setLastTransakOrderData] = useState<TransactionData | null>(null)
  const { data: session,status:userSessionStatus} = useSession()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)

    if (value && coinData.market_data?.current_price?.usd) {
      const coinValue =
        parseFloat(value) / coinData.market_data.current_price.usd
      setCryptoAmount(coinValue.toFixed(8))
    } else {
      setCryptoAmount('')
    }
  }

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCryptoAmount(value)

    if (value && coinData.market_data?.current_price?.usd) {
      const currencyValue =
        parseFloat(value) * coinData.market_data.current_price.usd
      setAmount(currencyValue.toFixed(2))
    } else {
      setAmount('')
    }
  }

  const handleTransakSuccess = (orderData: TransakOrderData) => {
    console.log('handleTransakSuccess called with:', orderData)

    const defaultTransactionData: TransactionData = {
      id: 'ERROR',
      userId: 'ERROR',
      isBuyOrSell: 'BUY',
      fiatCurrency: 'AUD',
      cryptoCurrency: 'BTC',
      fiatAmount: 0,
      status: 'FAILED',
      amountPaid: 0,
      paymentOptionId: 'ERROR',
      walletAddress: 'ERROR',
      walletLink: '',
      network: 'ERROR',
      cryptoAmount: 0,
      totalFeeInFiat: 0,
      fiatAmountInUsd: null,
      countryCode: 'US',
      stateCode: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistories: [],
    }

    let transactionData: TransactionData = defaultTransactionData

    try {
      if (!orderData.status) {
        throw new Error('No status data received')
      }

      const status = orderData.status
      console.log('Processing transaction status:', status)

      transactionData = {
        id: status.id || 'N/A',
        userId: status.userId || 'N/A',
        isBuyOrSell: status.isBuyOrSell || 'BUY',
        fiatCurrency: status.fiatCurrency || 'AUD',
        cryptoCurrency: status.cryptoCurrency || 'BTC',
        fiatAmount: status.fiatAmount || 0,
        status: (status.status as TransactionStatus) || 'PROCESSING',
        amountPaid: status.amountPaid || 0,
        paymentOptionId: status.paymentOptionId || 'credit_debit_card',
        walletAddress: status.walletAddress || 'N/A',
        walletLink: status.walletLink || '',
        network: status.network || 'mainnet',
        cryptoAmount: status.cryptoAmount || 0,
        totalFeeInFiat: status.totalFeeInFiat || 0,
        fiatAmountInUsd: status.fiatAmountInUsd?.toString() || null,
        countryCode: status.countryCode || 'US',
        stateCode: status.stateCode || '',
        createdAt: status.createdAt || new Date().toISOString(),
        updatedAt: status.updatedAt || new Date().toISOString(),
        statusReason: status.statusReason,
        transakFeeAmount: status.transakFeeAmount,
        cardPaymentData: status.cardPaymentData
          ? {
              status: (status.cardPaymentData.status as TransactionStatus),
              statusReason: status.cardPaymentData.statusReason,
              processedOn: status.cardPaymentData.processedOn,
            }
          : undefined,
        statusHistories: status.statusHistories
          ? status.statusHistories.map((h) => ({
              status: h.status,
              createdAt: h.createdAt,
              message: h.message,
            }))
          : [],
      }
    } catch (error) {
      console.error('Error parsing transaction data:', error)
    }

    console.log('Final transaction data:', transactionData)
    setOrderData(transactionData)
    setLastTransakOrderData(transactionData)
    setShowReceipt(true)

    if (
      transactionData.status === 'COMPLETED' ||
      transactionData.status === 'PROCESSING'
    ) {
      setShowConfetti(true)
      toast.success(
        `Transaction ${transactionData.status.toLowerCase()}! Amount: ${transactionData.fiatAmount} ${transactionData.fiatCurrency}`,
        {
          duration: 5000,
          position: 'top-center',
        }
      )
      setTimeout(() => {
        setShowConfetti(false)
        toast.dismiss()
      }, 5000)
    } else {
      toast(
        `Transaction is ${transactionData.status.toLowerCase()}. Please check back later for updates.`,
        {
          duration: 5000,
          position: 'top-center',
        }
      )
    }
  }

  const handleTransakClose = () => {
    console.log('Transak closed')
    console.log('lastTransakOrderData at close:', lastTransakOrderData)
    if (lastTransakOrderData) {
      setOrderData(lastTransakOrderData)
      setShowReceipt(true)
      console.log('Showing receipt modal on close')
    } else {
      console.log('No transaction data to show on close')
    }
  }

  const handleCloseReceipt = () => {
    setShowReceipt(false)
    setOrderData(null)
  }

  // Test function to manually trigger receipt (for debugging)
  const testReceipt = () => {
    const testData: TransactionData = {
      id: 'TEST-123',
      userId: 'test-user',
      isBuyOrSell: 'BUY',
      fiatCurrency: 'AUD',
      cryptoCurrency: 'BTC',
      fiatAmount: 100,
      status: 'COMPLETED',
      amountPaid: 100,
      paymentOptionId: 'credit_debit_card',
      walletAddress: 'test-wallet-address',
      walletLink: 'https://example.com',
      network: 'mainnet',
      cryptoAmount: 0.0025,
      totalFeeInFiat: 5,
      fiatAmountInUsd: '75',
      countryCode: 'US',
      stateCode: 'CA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistories: [
        {
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          message: 'Transaction initiated',
        },
        {
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          message: 'Transaction completed successfully',
        },
      ],
    }
    setOrderData(testData)
    setShowReceipt(true)
    setShowConfetti(true)
  }

  const currentPrice =
    coinData.market_data?.current_price?.[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ] || 0

  // Debug log for receipt modal rendering
  if (showReceipt && orderData) {
    console.log('Rendering TransactionReceipt modal', orderData)
  }

  return (
    <div className="w-full xl:w-[50%] md:border-l border-b border-gray-200">
      {showConfetti && <Confetti />}
      <AnimatePresence>
        {showReceipt && orderData && (
          <TransactionReceipt
            orderData={orderData}
            onClose={handleCloseReceipt}
          />
        )}
      </AnimatePresence>
      <div className="m-auto w-full py-6 md:py-12 p-1 md:p-6">
        <Breadcrumb className="xl:hidden my-2" />
        <div className="w-full flex flex-col gap-3">
          <div className="flex-col">
            <div className="p-2 md:p-6">
              <h2 className="text-xl font-medium mb-4">
                Calculate Your Purchase
              </h2>

              <div className="space-y-4 w-full">
                <div className="flex xl:flex-col gap-3">
                  <div className="relative w-full">
                    <input
                      type="number"
                      name="dollars"
                      className="input-field text-right w-full p-3 md:p-4 border rounded-lg"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </div>

                  <svg
                    className="text-black max-xl:rotate-90 block m-auto fill-current"
                    width="23"
                    height="24"
                    viewBox="0 0 23 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.0621 20.066C16.9798 20.1707 16.8763 20.2549 16.7589 20.3126C16.6415 20.3703 16.5133 20.4001 16.3836 20.3996C16.2708 20.4004 16.159 20.3774 16.0548 20.332C15.9507 20.2867 15.8564 20.2199 15.7776 20.1356L12.323 16.526C12.1614 16.3573 12.0707 16.1285 12.0707 15.89C12.0707 15.6515 12.1614 15.4228 12.323 15.254C12.4847 15.0855 12.7039 14.9908 12.9325 14.9908C13.161 14.9908 13.3802 15.0855 13.542 15.254L15.5211 17.3324V4.49963C15.5211 4.26093 15.612 4.03201 15.7737 3.86323C15.9355 3.69445 16.1549 3.59963 16.3836 3.59963C16.6124 3.59963 16.8317 3.69445 16.9935 3.86323C17.1552 4.03201 17.2461 4.26093 17.2461 4.49963V17.3204L19.2264 15.2588C19.3881 15.0907 19.6071 14.9962 19.8353 14.9962C20.0636 14.9962 20.2826 15.0907 20.4443 15.2588C20.6058 15.4276 20.6965 15.6563 20.6965 15.8948C20.6965 16.1333 20.6058 16.3621 20.4443 16.5308L17.0621 20.066ZM7.28712 3.93323C7.20484 3.82856 7.10126 3.74432 6.9839 3.68662C6.86655 3.62892 6.73835 3.5992 6.60862 3.59963C6.49578 3.59887 6.38395 3.62186 6.27982 3.66722C6.17569 3.71258 6.0814 3.77938 6.00257 3.86363L2.54912 7.47323C2.3876 7.64198 2.29688 7.87073 2.29688 8.10923C2.29688 8.34773 2.3876 8.57648 2.54912 8.74523C2.71084 8.91377 2.93005 9.00844 3.15862 9.00844C3.38718 9.00844 3.6064 8.91377 3.76812 8.74523L5.74612 6.66803V19.4996C5.74612 19.7383 5.83699 19.9672 5.99874 20.136C6.16049 20.3048 6.37987 20.3996 6.60862 20.3996C6.83737 20.3996 7.05675 20.3048 7.2185 20.136C7.38025 19.9672 7.47112 19.7383 7.47112 19.4996V6.67883L9.45142 8.74043C9.61309 8.9086 9.83206 9.00304 10.0603 9.00304C10.2886 9.00304 10.5076 8.9086 10.6693 8.74043C10.8308 8.57168 10.9215 8.34293 10.9215 8.10443C10.9215 7.86593 10.8308 7.63718 10.6693 7.46843L7.28712 3.93323Z"
                      fill="black"
                    />
                  </svg>

                  <div className="relative">
                    <div className="asset-icon absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
                      <Image
                        width={24}
                        height={24}
                        src={coinData.image.large}
                        alt={coinData.name}
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </div>
                    <input
                      type="text"
                      name="asset-value"
                      className="input-field text-right w-full p-3 md:p-4 border rounded-lg pl-10 md:pl-12"
                      placeholder="0.00"
                      value={cryptoAmount}
                      onChange={handleCoinChange}
                    />
                  </div>
                </div>

                <p className="text-color-text-body asset-price-calc text-sm md:text-base">
                  1 {coinData.symbol.toUpperCase()} = $
                  {currentPrice.toLocaleString()}{' '}
                  <span className="currency-set">
                    {selectedCurrency.toUpperCase()}
                  </span>
                </p>

                {/* Temporary test button for debugging */}
                {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && (
                  <button
                    onClick={testReceipt}
                    className="w-full p-2 bg-blue-500 text-white rounded-lg text-sm mb-4"
                  >
                    Test Receipt (Dev Only)
                  </button>
                )}

                  {session?.user ? (

                      <TransakPaymentComponent
                        fiatAmount={Number(amount)}
                        cryptoCurrency={coinData.symbol.toUpperCase()}
                        cryptoAmount={Number(cryptoAmount)}
                        onSuccess={handleTransakSuccess}
                        onClose={handleTransakClose}
                      />
                  ) : (

                      <PrimaryButton
                        link="/auth/signin"
                        className="w-full"
                        disabled={userSessionStatus==="loading" || userSessionStatus==="unauthenticated"}
                      >
                        {
                          userSessionStatus ==="loading" ? "Loading":"Sign In"

                        }
                      </PrimaryButton>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetCalculator
