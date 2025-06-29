'use client'
import { Transak, TransakConfig } from '@transak/transak-sdk'
import { useState, useEffect, useRef } from 'react'
import PrimaryButton from './button/primary-button'
import Loader from './loader-component'

// Map Transak statuses to our database enum values
const mapTransakStatusToDbStatus = (transakStatus: string): string => {
  const statusMap: Record<string, string> = {
    'AWAITING_PAYMENT_FROM_USER': 'PENDING',
    'ORDER_CREATED': 'PENDING',
    'ORDER_PROCESSING': 'PROCESSING',
    'ORDER_COMPLETED': 'COMPLETED',
    'ORDER_FAILED': 'FAILED',
    'ORDER_CANCELLED': 'CANCELLED',
    'ORDER_EXPIRED': 'EXPIRED',
    'PAYMENT_PENDING': 'PENDING',
    'PAYMENT_PROCESSING': 'PROCESSING',
    'PAYMENT_COMPLETED': 'COMPLETED',
    'PAYMENT_FAILED': 'FAILED',
    'PAYMENT_CANCELLED': 'CANCELLED',
    'PAYMENT_EXPIRED': 'EXPIRED',
    'COMPLETED': 'COMPLETED',
    'SUCCESS': 'COMPLETED',
    'SUCCESSFUL': 'COMPLETED',
    'DONE': 'COMPLETED',
    'FINALIZED': 'COMPLETED',
    'SETTLED': 'COMPLETED',
    'CONFIRMED': 'COMPLETED',
  }

  return statusMap[transakStatus] || 'PENDING'
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
    fiatAmountInUsd: string | null
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

  const handleTransactionCompletion = (orderData: TransakOrderData, status: string) => {
    console.log('Handling transaction completion with status:', status);

    // Stop polling
    stopPolling()

    // Close Transak widget
    if (transak) {
      console.log('Closing Transak widget');
      transak.close()
      setTransak(null)
    }

    // Update UI state
    setIsLoading(false)
    setIsProcessing(false)
    setTransactionStatus(status)

    // Call success callback
    if (status === "COMPLETED") {
      console.log('Transaction completed successfully, calling onSuccess');
      onSuccess?.(orderData)
    }

    // Call close callback with a small delay to ensure UI updates
    setTimeout(() => {
      console.log('Calling onClose callback');
      onClose?.()
    }, 100)
  }

  const checkTransactionStatus = async (orderId: string) => {
    try {
      console.log('Checking transaction status for orderId:', orderId);
      const response = await fetch(`/api/transaction/status?orderId=${orderId}`)
      const data = await response.json()
      console.log('Transaction status API response:', data);

      if (response.ok && data.data) {
        const status = data.data.status
        const mappedStatus = mapTransakStatusToDbStatus(status)
        console.log('Transaction status:', status, 'Mapped status:', mappedStatus);
        console.log('Full transaction data:', data.data);
        setTransactionStatus(mappedStatus)
        setIsProcessing(true)

        // Update the local database transaction with the latest status
        try {
          const updateResponse = await fetch('/api/transaction', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: orderId,
              status: mappedStatus,
              statusHistories: data.data.statusHistories || [],
              fiatAmount: data.data.fiatAmount,
              fiatCurrency: data.data.fiatCurrency,
              cryptoCurrency: data.data.cryptoCurrency,
              walletLink: data.data.walletLink,
              walletAddress: data.data.walletAddress,
              network: data.data.network,
              paymentOptionId: data.data.paymentOptionId,
              fiatAmountInUsd: data.data.fiatAmountInUsd?.toString() || null,
            }),
          })

          if (updateResponse.ok) {
            console.log('Transaction status updated in database:', mappedStatus)
          } else {
            console.error('Failed to update transaction status in database')
          }
        } catch (updateError) {
          console.error('Error updating transaction status:', updateError)
        }

        // Check if transaction is in a final state using mapped status
        console.log('Checking if status is final:', mappedStatus, 'Final states:', ["COMPLETED", "FAILED", "CANCELLED", "EXPIRED"]);
        if (["COMPLETED", "FAILED", "CANCELLED", "EXPIRED"].includes(mappedStatus)) {
          console.log('Transaction is in final state:', mappedStatus);
          handleTransactionCompletion({
            eventName: "TRANSACTION_COMPLETED",
            status: data.data
          }, mappedStatus)
        } else {
          console.log('Transaction is still in progress:', mappedStatus);
        }
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
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
      status: mapTransakStatusToDbStatus(statusData.status ?? 'PENDING'), // Use actual status from Transak
      paymentOptionId: statusData.paymentOptionId ?? '',
      fiatAmountInUsd: statusData.fiatAmountInUsd?.toString() ?? null,
      statusHistories: statusData.statusHistories || [],
      amountPaid: statusData.amountPaid ?? 0,
      cryptoAmount: statusData.cryptoAmount ?? 0,
      totalFeeInFiat: statusData.totalFeeInFiat ?? 0,
      countryCode: statusData.countryCode ?? 'US',
      stateCode: statusData.stateCode ?? '',
      statusReason: statusData.statusReason,
      transakFeeAmount: statusData.transakFeeAmount,
      cardPaymentData: statusData.cardPaymentData,
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
        console.log('Max polling attempts reached, forcing completion');
        // Force close after max attempts
        handleTransactionCompletion({
          eventName: "TRANSACTION_TIMEOUT",
          status: {
            id: orderId,
            status: "TIMEOUT",
            // Add other required fields with defaults
            userId: "",
            isBuyOrSell: "BUY",
            fiatCurrency: "AUD",
            cryptoCurrency: "BTC",
            fiatAmount: 0,
            amountPaid: 0,
            paymentOptionId: "",
            walletAddress: "",
            walletLink: "",
            network: "",
            cryptoAmount: 0,
            totalFeeInFiat: 0,
            fiatAmountInUsd: null,
            countryCode: "US",
            stateCode: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }, "EXPIRED")
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

  // Debug effect to log status changes
  useEffect(() => {
    console.log('Transaction status state changed to:', transactionStatus);
  }, [transactionStatus])

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
      console.log('Order created:', orderData);
      if (orderData.status?.id) {
        console.log('Starting polling for order ID:', orderData.status.id);
        await saveTransaction(orderData)
        startPolling(orderData.status.id)
        // Set initial status
        const initialStatus = mapTransakStatusToDbStatus(orderData.status.status || 'PENDING')
        console.log('Setting initial status:', initialStatus);
        setTransactionStatus(initialStatus)
        setIsProcessing(true)
        onSuccess?.(orderData)
      }
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, async (data: unknown) => {
      const orderData = data as TransakOrderData
      console.log('Order successful event received:', orderData);
      if (orderData.status?.id) {
        // Immediately check the status and handle completion
        await checkTransactionStatus(orderData.status.id)
      }
      // Do NOT close the widget or call onSuccess here; let polling handle it
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
