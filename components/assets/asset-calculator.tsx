"use client"
import { CoinData } from '@/types/coingecko-types'
import Image from 'next/image'
import { useState } from 'react'
import TransakPaymentComponent from '../transak-payment-component'
import { useSession } from 'next-auth/react'
import PrimaryButton from '../button/primary-button'
import Confetti from '../confetti'
import toast from 'react-hot-toast'
import Breadcrumb from '../bread-crumb'
import SecondaryButton from '../button/secondary-button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
interface TransactionData {
  id: string
  userId: string
  isBuyOrSell: string
  fiatCurrency: string
  cryptoCurrency: string
  fiatAmount: number
  status: string
  amountPaid: number
  paymentOptionId: string
  walletAddress: string
  walletLink: string
  network: string
  cryptoAmount: number
  totalFeeInFiat: number
  fiatAmountInUsd: number
  countryCode: string
  stateCode: string
  createdAt: string
  updatedAt: string
  statusReason?: string
  transakFeeAmount?: number
  cardPaymentData?: {
    status: string
    statusReason?: string
    processedOn?: string
  }
  statusHistories?: Array<{
    status: string
    createdAt: string
    message: string
  }>
}

interface TransactionReceiptProps {
  orderData: TransactionData
  onClose: () => void
}

const TransactionReceipt = ({ orderData, onClose }: TransactionReceiptProps) => {
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
        timeZoneName: 'short'
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
      <div className="bg-white px-6 w-full max-w-[90%] max-h-[90%] overflow-y-auto">
        <div className="flex justify-between py-6 items-center mb-6 sticky top-0 bg-white pb-4 border-gray-200 border-b">
          <div>
            <h2 className="text-2xl font-isola">Transaction Receipt</h2>
            <p className="text-gray-500 mt-1">Order ID: {formatValue(orderData.id)}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Transaction Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${orderData.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {formatValue(orderData.status)}
                  </span>
                </div>
                {orderData.statusReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Reason:</span>
                    <span className="font-medium text-gray-800">{formatValue(orderData.statusReason)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatValue(orderData.fiatAmount)} {formatValue(orderData.fiatCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crypto Amount:</span>
                  <span className="font-medium">{formatValue(orderData.cryptoAmount)} {formatValue(orderData.cryptoCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{formatValue(orderData.paymentOptionId).replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Wallet Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium">{formatValue(orderData.network)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Address:</span>
                  <span className="font-medium break-all text-right">{formatValue(orderData.walletAddress)}</span>
                </div>
                {orderData.walletLink && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Link:</span>
                    <Link href={orderData.walletLink} target="_blank" rel="noopener noreferrer" className="flex gap-1 items-center font-medium text-blue-600 hover:text-blue-800 break-all text-right">
                      Visit Wallet <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Fee Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fees:</span>
                  <span className="font-medium">{formatValue(orderData.totalFeeInFiat)} {formatValue(orderData.fiatCurrency)}</span>
                </div>
                {orderData.transakFeeAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transak Fee:</span>
                    <span className="font-medium">{formatValue(orderData.transakFeeAmount)} {formatValue(orderData.fiatCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount in USD:</span>
                  <span className="font-medium">${formatValue(orderData.fiatAmountInUsd)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Timestamps</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created At:</span>
                  <span className="font-medium">{formatDate(orderData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated At:</span>
                  <span className="font-medium">{formatDate(orderData.updatedAt)}</span>
                </div>
              </div>
            </div>

            {orderData.cardPaymentData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="font-medium">{formatValue(orderData.cardPaymentData.status)}</span>
                  </div>
                  {orderData.cardPaymentData.statusReason && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Reason:</span>
                      <span className="font-medium">{formatValue(orderData.cardPaymentData.statusReason)}</span>
                    </div>
                  )}
                  {orderData.cardPaymentData.processedOn && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processed On:</span>
                      <span className="font-medium">{formatDate(orderData.cardPaymentData.processedOn)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {orderData.statusHistories && orderData.statusHistories.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Status History</h3>
            <div className="space-y-4">
              {orderData.statusHistories.map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{formatValue(history.status)}</span>
                      <span className="text-gray-500 text-sm">{formatDate(history.createdAt)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{formatValue(history.message)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between pb-6 gap-4 sticky bottom-0 bg-white pt-4 border-gray-200 border-t">
          <SecondaryButton onClick={onClose} className="px-6">
            Close
          </SecondaryButton>
          <PrimaryButton link="/transactions" className="px-6">
            View All Transactions
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  )
}

interface AssetCalculatorProps {
  coinData: CoinData
  selectedCurrency: string
}

interface TransakOrderData {
  eventName: string
  status: {
    id: string
    userId: string
    isBuyOrSell: string
    fiatCurrency: string
    cryptoCurrency: string
    fiatAmount: number
    status: string
    amountPaid: number
    paymentOptionId: string
    walletAddress: string
    walletLink: string
    network: string
    cryptoAmount: number
    totalFeeInFiat: number
    fiatAmountInUsd: number
    countryCode: string
    stateCode: string
    createdAt: string
    updatedAt: string
    statusReason?: string
    transakFeeAmount?: number
    cardPaymentData?: {
      status: string
      statusReason?: string
      processedOn?: string
    }
    statusHistories?: Array<{
      status: string
      createdAt: string
      message: string
    }>
  }
}

const AssetCalculator = ({
  coinData,
  selectedCurrency,
}: AssetCalculatorProps) => {
  const [currencyAmount, setCurrencyAmount] = useState('')
  const [coinAmount, setCoinAmount] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const { data: session } = useSession()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrencyAmount(value)

    if (value && coinData.market_data?.current_price?.usd) {
      const coinValue =
        parseFloat(value) / coinData.market_data.current_price.usd
      setCoinAmount(coinValue.toFixed(8))
    } else {
      setCoinAmount('')
    }
  }

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCoinAmount(value)

    if (value && coinData.market_data?.current_price?.usd) {
      const currencyValue =
        parseFloat(value) * coinData.market_data.current_price.usd
      setCurrencyAmount(currencyValue.toFixed(2))
    } else {
      setCurrencyAmount('')
    }
  }

  const handleTransakSuccess = (orderData: TransakOrderData) => {
    const defaultTransactionData: TransactionData = {
      id: "ERROR",
      userId: "ERROR",
      isBuyOrSell: "BUY",
      fiatCurrency: "AUD",
      cryptoCurrency: "BTC",
      fiatAmount: 0,
      status: "ERROR",
      amountPaid: 0,
      paymentOptionId: "ERROR",
      walletAddress: "ERROR",
      walletLink: "",
      network: "ERROR",
      cryptoAmount: 0,
      totalFeeInFiat: 0,
      fiatAmountInUsd: 0,
      countryCode: "US",
      stateCode: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistories: []
    };

    let transactionData: TransactionData = defaultTransactionData;

    try {
      if (!orderData.status) {
        throw new Error('No status data received');
      }

      const status = orderData.status;

      transactionData = {
        id: status.id || "N/A",
        userId: status.userId || "N/A",
        isBuyOrSell: status.isBuyOrSell || "BUY",
        fiatCurrency: status.fiatCurrency || "AUD",
        cryptoCurrency: status.cryptoCurrency || "BTC",
        fiatAmount: status.fiatAmount || 0,
        status: status.status || "PROCESSING",
        amountPaid: status.amountPaid || 0,
        paymentOptionId: status.paymentOptionId || "credit_debit_card",
        walletAddress: status.walletAddress || "N/A",
        walletLink: status.walletLink || "",
        network: status.network || "mainnet",
        cryptoAmount: status.cryptoAmount || 0,
        totalFeeInFiat: status.totalFeeInFiat || 0,
        fiatAmountInUsd: status.fiatAmountInUsd || 0,
        countryCode: status.countryCode || "US",
        stateCode: status.stateCode || "",
        createdAt: status.createdAt || new Date().toISOString(),
        updatedAt: status.updatedAt || new Date().toISOString(),
        statusReason: status.statusReason,
        transakFeeAmount: status.transakFeeAmount,
        cardPaymentData: status.cardPaymentData,
        statusHistories: status.statusHistories || []
      };
    } catch (error) {
      console.error('Error parsing transaction data:', error);
    }

    setShowConfetti(true);
    setTransactionData(transactionData);
    setShowReceipt(true);
    toast.success(`Transaction ${transactionData.status.toLowerCase()}! Amount: ${transactionData.fiatAmount} ${transactionData.fiatCurrency}`, {
      duration: 5000,
      position: 'top-center'
    });
    setTimeout(() => {
      setShowConfetti(false);
      toast.dismiss();
    }, 5000);
  };

  const handleTransakClose = () => {
    console.log('Transak closed')
  }

  const handleCloseReceipt = () => {
    setShowReceipt(false)
    setTransactionData(null)
  }

  const currentPrice =
    coinData.market_data?.current_price?.[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ] || 0

  return (
    <div className="w-full xl:w-[50%] md:border-l border-b border-gray-200">
      {showConfetti && <Confetti />}
      <AnimatePresence>
        {showReceipt && transactionData && (
          <TransactionReceipt orderData={transactionData} onClose={handleCloseReceipt} />
        )}
      </AnimatePresence>
      <div className="m-auto w-full py-6 md:py-12 p-4 md:p-6">
        <Breadcrumb className="xl:hidden my-2" />
        <p className="text-2xl md:text-3xl font-isola mb-4 md:mb-6">
          Buy {coinData.name} in minutes
        </p>
        <div className="w-full flex flex-col gap-3">
          <div className="flex xl:flex-col gap-3">
            <div className="relative w-full">
              <input
                type="text"
                name="dollars"
                className="input-field text-right w-full p-3 md:p-4 border rounded-lg"
                placeholder="Enter amount"
                value={currencyAmount}
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
                value={coinAmount}
                onChange={handleCoinChange}
              />
            </div>
          </div>

          <p className="text-color-text-body asset-price-calc text-sm md:text-base">
            1 {coinData.symbol.toUpperCase()} = ${currentPrice.toLocaleString()}{' '}
            <span className="currency-set">
              {selectedCurrency.toUpperCase()}
            </span>
          </p>
          {session?.user ? (
            <TransakPaymentComponent
              fiatAmount={Number(currencyAmount)}
              cryptoCurrency={coinData.symbol.toUpperCase()}
              cryptoAmount={Number(coinAmount)}
              onSuccess={handleTransakSuccess}
              onClose={handleTransakClose}
            />
          ) : (
            <PrimaryButton link="/auth/signin" className="w-full">
              Login to Buy
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssetCalculator
