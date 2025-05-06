'use client'
import { Transak, TransakConfig } from '@transak/transak-sdk'
import { useState } from 'react'
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
  const saveTransaction = async (orderData: TransakOrderData) => {
    const payload = {
      isBuyOrSell: orderData.status.isBuyOrSell ?? 'BUY',
      fiatAmount: orderData.status.fiatAmount ?? 0,
      fiatCurrency: orderData.status.fiatCurrency ?? 'AUD',
      cryptoCurrency: orderData.status.cryptoCurrency ?? 'BTC',
      cryptoAmount: orderData.status.cryptoAmount ?? 0,
      walletLink: orderData.status.walletLink ?? '',
      walletAddress: orderData.status.walletAddress ?? '',
      network: orderData.status.network ?? '',
    }
    try {
      await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      console.log('Transaction saved successfully')
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const initializeTransak = () => {
    setIsLoading(true)
    const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API || ''
    console.log(apiKey)
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
      console.log('Transak SDK closed!')
      newTransak.close()
      setTransak(null)
      setIsLoading(false)
      onClose?.()
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      console.log(orderData)
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, async (orderData ) => {

      console.log(orderData)
      await saveTransaction(orderData as TransakOrderData)
      newTransak.close()
      setTransak(null)
      setIsLoading(false)
      onSuccess?.(orderData as TransakOrderData)
      onClose?.()
    })
  }
  const handleClose = () => {
    if (transak) {
      transak.close()
      setTransak(null)
      setIsLoading(false)
      onClose?.()
    }
  }

  const disabledCondition = isLoading || fiatAmount<=0

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
      )}
    </div>
  )
}

export default TransakPaymentComponent
