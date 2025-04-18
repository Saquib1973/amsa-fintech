'use client'
import { Transak, TransakConfig } from '@transak/transak-sdk'
import { useState } from 'react'
import PrimaryButton from './button/primary-button'
import Loader from './loader-component'

interface TransakOrderData {
  orderId: string
  status: string
  transactionHash?: string
  paymentMethod: string
  amount: number
  currency: string
  timestamp: string
  [key: string]: unknown
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

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData)
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

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {!transak ? (
        <PrimaryButton
          className="w-full"
          onClick={initializeTransak}
          disabled={isLoading}
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
          disabled={isLoading}
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
