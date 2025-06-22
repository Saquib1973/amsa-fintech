'use client'
import { Transak, TransakConfig } from '@transak/transak-sdk'
import { useState, useEffect, useRef } from 'react'
import PrimaryButton from './button/primary-button'
import Loader from './loader-component'

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

interface TransakPaymentProps {
  exchangeScreenTitle?: string
  fiatAmount?: number
  fiatCurrency?: string
  cryptoCurrency?: string
  cryptoAmount?: number
  onSuccess?: (orderData: TransakOrderData) => void
  onClose?: () => void
  buttonText?: {
    start?: string
    close?: string
  }
  className?: string
}

const DEFAULT_FIAT_AMOUNT = 30
const POLLING_INTERVAL = 5000 // 5 seconds
const MAX_POLLING_ATTEMPTS = 60 // 5 minutes maximum polling time

const TransakPaymentComponent = ({
  exchangeScreenTitle = 'Buy Crypto To Your Wallet',
  fiatAmount = 0,
  fiatCurrency = 'AUD',
  cryptoCurrency = 'BTC',
  cryptoAmount = 0,
  onSuccess,
  onClose,
  buttonText = {
    start: `Buy ${cryptoCurrency}`,
    close: 'Close Payment',
  },
  className = '',
}: TransakPaymentProps) => {
  const [transak, setTransak] = useState<Transak | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef(0)

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Waiting for payment confirmation...'
      case 'PROCESSING':
        return 'Processing your transaction...'
      case 'COMPLETED':
        return 'Transaction completed successfully!'
      case 'FAILED':
        return 'Transaction failed. Please try again.'
      case 'CANCELLED':
        return 'Transaction was cancelled.'
      case 'EXPIRED':
        return 'Transaction has expired.'
      default:
        return 'Processing your transaction...'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600'
      case 'FAILED':
      case 'CANCELLED':
      case 'EXPIRED':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    pollingAttemptsRef.current = 0
  }

  const checkTransactionStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/transaction/status?orderId=${orderId}`)
      const data = await response.json()

      if (response.ok && data.data) {
        const status = data.data.status
        setTransactionStatus(status)
        setIsProcessing(true)

        // Check if transaction is in a final state
        if (['COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(status)) {
          stopPolling()
          setIsProcessing(false)

          // Update the saved transaction with final status and history
          await updateTransaction(orderId, data.data)

          if (status === 'COMPLETED') {
            // Handle successful transaction
            const orderData: TransakOrderData = {
              eventName: 'TRANSACTION_COMPLETED',
              status: data.data
            }
            console.log('Transaction completed')
            onSuccess?.(orderData)
          }
        }
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
    }
  }

  const updateTransaction = async (orderId: string, statusData: TransakOrderData['status']) => {
    console.log('Updating transaction')

    const payload = {
      id: orderId,
      status: statusData.status,
      statusHistories: statusData.statusHistories ?? [],
      fiatAmount: statusData.fiatAmount ?? 0,
      fiatCurrency: statusData.fiatCurrency ?? 'AUD',
      cryptoCurrency: statusData.cryptoCurrency ?? 'BTC',
      walletLink: statusData.walletLink ?? '',
      walletAddress: statusData.walletAddress ?? '',
      network: statusData.network ?? '',
      paymentOptionId: statusData.paymentOptionId ?? '',
      fiatAmountInUsd: statusData.fiatAmountInUsd?.toString() ?? '',
    }

    try {
      const response = await fetch('/api/transaction', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log('Transaction updated successfully')
      } else {
        const errorText = await response.text()
        console.error('Failed to update transaction:', errorText)
      }
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const saveTransaction = async (orderData: TransakOrderData) => {
    console.log('Saving transaction')

    const statusData = orderData.status || orderData

    const payload = {
      id: statusData.id,
      isBuyOrSell: statusData.isBuyOrSell ?? 'BUY',
      fiatAmount: statusData.fiatAmount ?? 0,
      fiatCurrency: statusData.fiatCurrency ?? 'AUD',
      cryptoCurrency: statusData.cryptoCurrency ?? 'BTC',
      walletLink: statusData.walletLink ?? '',
      walletAddress: statusData.walletAddress ?? '',
      network: statusData.network ?? '',
      status: 'PENDING', // Always set as PENDING initially
      paymentOptionId: statusData.paymentOptionId ?? '',
      fiatAmountInUsd: statusData.fiatAmountInUsd?.toString() ?? '',
      statusHistories: [], // Empty initially, will be updated on completion
    }

    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log('Transaction saved successfully:', payload)
      } else {
        const errorText = await response.text()
        console.error('Failed to save transaction:', errorText)
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const startPolling = (orderId: string) => {
    stopPolling()
    pollingAttemptsRef.current = 0

    pollingRef.current = setInterval(() => {
      pollingAttemptsRef.current += 1

      if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) {
        stopPolling()
        return
      }

      checkTransactionStatus(orderId)
    }, POLLING_INTERVAL)
  }

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  const initializeTransak = () => {
    setIsLoading(true)
    const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API || ''
    const transakConfig: TransakConfig = {
      apiKey: apiKey,
      themeColor: '#0099ff',
      fiatAmount,
      fiatCurrency,
      defaultFiatAmount: DEFAULT_FIAT_AMOUNT,
      cryptoCurrencyCode: cryptoCurrency,
      cryptoAmount,
      hideMenu: true,
      isFeeCalculationHidden: true,
      exchangeScreenTitle: exchangeScreenTitle,
      environment: Transak.ENVIRONMENTS.STAGING,
    }

    const newTransak = new Transak(transakConfig)
    setTransak(newTransak)
    newTransak.init()

    Transak.on('*', (data) => {
      console.log(data)
    })

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      newTransak.close()
      setTransak(null)
      setIsLoading(false)
      stopPolling()
      onClose?.()
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, async (data: unknown) => {
      const orderData = data as TransakOrderData
      console.log('Order created')
      if (orderData.status?.id) {
        await saveTransaction(orderData)
        startPolling(orderData.status.id)
      }
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, async (data: unknown) => {
      const orderData = data as TransakOrderData
      if (orderData.status?.id) {
        await checkTransactionStatus(orderData.status.id)
      }
      newTransak.close()
      setTransak(null)
      setIsLoading(false)
      onSuccess?.(orderData)
      onClose?.()
    })
  }

  const handleClose = () => {
    if (transak) {
      transak.close()
      setTransak(null)
      setIsLoading(false)
      stopPolling()
      onClose?.()
    }
  }

  const disabledCondition = isLoading || fiatAmount <= 0

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {!transak ? (
        <PrimaryButton
          className="w-full"
          onClick={initializeTransak}
          disabled={disabledCondition}
        >
          {isLoading ? (
            <>
              <Loader noMessage size="sm" darker />
              Initializing...
            </>
          ) : (
            buttonText.start
          )}
        </PrimaryButton>
      ) : (
        <div className="w-full space-y-4">
          {isProcessing && (
            <div className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader noMessage size="sm" darker />
                <span className={`text-sm font-medium ${getStatusColor(transactionStatus)}`}>
                  {getStatusMessage(transactionStatus)}
                </span>
              </div>
              {transactionStatus && !['COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(transactionStatus) && (
                <div className="text-xs text-gray-500">
                  This may take a few minutes. Please don&apos;t close this window.
                </div>
              )}
            </div>
          )}
          <PrimaryButton
            className="w-full"
            onClick={handleClose}
            disabled={disabledCondition}
          >
            {isLoading ? (
              <>
                <Loader noMessage size="sm" darker />
                Processing...
              </>
            ) : (
              buttonText.close
            )}
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}

export default TransakPaymentComponent
