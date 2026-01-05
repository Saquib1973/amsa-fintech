'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Transak, TransakConfig } from '@transak/transak-sdk'

interface TransakSellComponentProps {
  readonly cryptoCurrency: string
  readonly cryptoAmount: number
  readonly fiatCurrency?: string
  readonly walletAddress?: string
  readonly environment?: 'STAGING' | 'PRODUCTION'
  readonly redirectPath?: string
  readonly open?: boolean
  readonly autoOpen?: boolean
  readonly debug?: boolean
  readonly onSuccess?: (data: unknown) => void
  readonly onClose?: () => void
  readonly onError?: (error: unknown) => void
}

type TransakOrderLike = {
  status?: { id?: string; orderId?: string; status?: string }
  fiatAmount?: number
  fiatCurrency?: string
  cryptoCurrency?: string
  walletLink?: string
  walletAddress?: string
  network?: string
  paymentOptionId?: string
  fiatAmountInUsd?: number
  statusHistories?: unknown
  amountPaid?: number
  cryptoAmount?: number
  totalFeeInFiat?: number
  countryCode?: string
  stateCode?: string
  statusReason?: string
  transakFeeAmount?: number
  orderId?: string
  id?: string
}

export default function TransakSellComponent({
  cryptoCurrency,
  cryptoAmount,
  fiatCurrency = 'AUD',
  walletAddress,
  environment,
  open,
  autoOpen = true,
  debug = false,
  onSuccess,
  onClose,
  onError,
}: TransakSellComponentProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<string>('PENDING')
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  const transakRef = useRef<Transak | null>(null)
  const pollingIntervalRef = useRef<number | null>(null)
  const lastOrderIdRef = useRef<string | null>(null)
  const initializedRef = useRef<boolean>(false)


  const resolvedEnv = useMemo(() => {
    const env = environment || (process.env.NEXT_PUBLIC_TRANSAK_ENV as 'STAGING' | 'PRODUCTION') || 'STAGING'
    return env === 'PRODUCTION' ? Transak.ENVIRONMENTS.PRODUCTION : Transak.ENVIRONMENTS.STAGING
  }, [environment])

  const resolvedWalletAddress = useMemo(() => {
    return (
      walletAddress ||
      process.env.NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS ||
      '0xcd8857bA99B602212F679E3802Da48D98B195052'
    )
  }, [walletAddress])

  const log = (...args: unknown[]) => {
    if (debug) console.log('[Transak Sell]', ...args)
  }

  const mapTransakStatusToDbStatus = (transakStatus: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: 'PENDING',
      AWAITING_PAYMENT_FROM_USER: 'PENDING',
      ON_HOLD_PENDING_DELIVERY_FROM_TRANSAK: 'PENDING',
      PENDING_DELIVERY_FROM_TRANSAK: 'PENDING',
      ON_HOLD_PENDING_DELIVERY_FROM_USER: 'PENDING',
      PENDING_DELIVERY_FROM_USER: 'PENDING',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
      FAILED: 'FAILED',
      EXPIRED: 'CANCELLED',
      REFUNDED: 'CANCELLED',
      CONFIRMED: 'COMPLETED',
    }
    return statusMap[transakStatus] || 'PENDING'
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const startPolling = (orderId: string) => {
    stopPolling()
    pollingIntervalRef.current = setInterval(() => {
      void checkTransactionStatus(orderId)
    }, 5000) as unknown as number
  }

  const saveTransaction = async (orderData: unknown) => {
    try {
      const d = orderData as TransakOrderLike
      const inferredId =
        d?.status?.orderId || d?.status?.id || d?.orderId || d?.id || lastOrderIdRef.current

      console.log('Saving transaction with ID:', inferredId)
      console.log('Order data:', d)

      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inferredId,
          isBuyOrSell: 'SELL',
          fiatAmount: d.fiatAmount,
          fiatCurrency: d.fiatCurrency || fiatCurrency,
          cryptoCurrency: d.cryptoCurrency || cryptoCurrency,
          walletLink: d.walletLink || '',
          walletAddress: d.walletAddress || resolvedWalletAddress,
          network: d.network,
          status: d.status?.status,
          paymentOptionId: d.paymentOptionId,
          fiatAmountInUsd: d.fiatAmountInUsd,
          statusHistories: d.statusHistories,
          amountPaid: d.amountPaid,
          cryptoAmount: d.cryptoAmount || cryptoAmount,
          totalFeeInFiat: d.totalFeeInFiat,
          countryCode: d.countryCode,
          stateCode: d.stateCode,
          statusReason: d.statusReason,
          transakFeeAmount: d.transakFeeAmount,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Transaction API error:', response.status, errorText)
        throw new Error(`Transaction API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Transaction saved successfully:', result)
    } catch (error) {
      console.error('Error saving transaction:', error)
      // Don't throw the error, just log it to avoid breaking the flow
    }
  }

  const teardown = (skipClose?: boolean) => {
    stopPolling()
    try {
      if (!skipClose) transakRef.current?.close()
    } catch { }
    transakRef.current = null
    initializedRef.current = false
    setIsLoading(false)
    setIsProcessing(false)
    setIsWidgetOpen(false)
    // Reset transaction status to clear any processing state
    setTransactionStatus('PENDING')
  }

  console.log('TRANSACTION STATUS: ', transactionStatus);

  const checkTransactionStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/transaction/status?orderId=${orderId}`)
      const body = await response.json()
      const d = body?.data ?? body
      const rawStatus = d?.status ?? d?.orderStatus ?? 'PENDING'
      const mappedStatus = mapTransakStatusToDbStatus(rawStatus)
      setTransactionStatus(mappedStatus)

      if (mappedStatus === 'COMPLETED') {
        setIsProcessing(false)
        stopPolling()
        try {
          transakRef.current?.close()
        } catch { }
        onSuccess?.(d)
      } else if (mappedStatus === 'FAILED' || mappedStatus === 'CANCELLED') {
        setIsProcessing(false)
        stopPolling()
        onError?.(d)
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
    }
  }

  const initializeTransak = () => {
    console.log('COMPONENT RENDERED')
    console.log('Session data:', session)

    if (initializedRef.current) return
    initializedRef.current = true
    setIsLoading(true)

    const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API || ''
    const isStaging = resolvedEnv === Transak.ENVIRONMENTS.STAGING
    const stagingEmail = process.env.NEXT_PUBLIC_TRANSAK_TEST_EMAIL || 'test.user+staging@example.com'
    const email = (session?.user?.email || (isStaging ? stagingEmail : undefined))
    const partnerCustomerId = (session?.user as unknown as { id?: string })?.id || (isStaging ? (process.env.NEXT_PUBLIC_TRANSAK_PARTNER_CUSTOMER_ID || 'staging-customer-001') : undefined)
    const stagingUserData = ({
      firstName: 'Jane',
      lastName: 'Doe',
      dob: '1998-01-01',
      address: {
        addressLine1: '170 Rue du Faubourg Saint-Denis',
        city: 'Paris',
        state: 'Île-de-France',
        countryCode: 'FR',
        postCode: '75010',
      },
      nationality: 'FR',
      dialCode: '+33',
      phoneNumber: '791112345',
      email: stagingEmail,
      mobileNumber: '791112345',
    }) as unknown as TransakConfig['userData']
    const staticPartnerOrderId = `sell-${Date.now()}`

    // Debug: show identifiers we will pass into Transak
    console.log('[Transak Sell] identifiers', {
      email,
      partnerCustomerId,
      environment: isStaging ? 'STAGING' : 'PRODUCTION',
    })
    if (isStaging) {
      console.log('[Transak Sell] staging userData', stagingUserData)
    }

    const transakConfig: TransakConfig = {
      apiKey: apiKey,
      themeColor: '#0099ff',
      productsAvailed: 'SELL',
      cryptoCurrencyCode: cryptoCurrency,
      defaultCryptoAmount: cryptoAmount,
      fiatCurrency: fiatCurrency,
      hideMenu: true,
      isFeeCalculationHidden: true,
      environment: resolvedEnv,
      walletAddress: resolvedWalletAddress,
      disableWalletAddressForm: true,
      email,
      partnerCustomerId,
      isTransakStreamOffRamp:true,
      partnerOrderId: staticPartnerOrderId,
      exchangeScreenTitle: 'Sell Crypto',
      // Enable wallet redirection for sell flow
      walletRedirection: true,
      // Add redirect URL for sell flow - this is where users go after confirming payment
      // redirectURL: `${window.location.origin}/sell/complete`,
      ...(isStaging
        ? {
          userData: stagingUserData,
          isAutoFillUserData: true,
        }
        : {}),
    }

    log('Init with config', {
      productsAvailed: transakConfig.productsAvailed,
      cryptoCurrencyCode: transakConfig.cryptoCurrencyCode,
      defaultCryptoAmount: transakConfig.defaultCryptoAmount,
      fiatCurrency: transakConfig.fiatCurrency,
      environment: environment || 'STAGING',
    })

    const instance = new Transak(transakConfig)
    transakRef.current = instance
    instance.init()
    setIsWidgetOpen(true)
    // Best-effort: drop the initializing overlay shortly after init
    window.setTimeout(() => setIsLoading(false), 500)

    // Optional: log all events if debug
    if (debug) {
      Transak.on('*', (data) => log('event *', data))
    }

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, async () => {
      log('WIDGET_CLOSE')
      const id = lastOrderIdRef.current
      if (id) {
        await checkTransactionStatus(id)
      }
      teardown(true)
      onClose?.()
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, async (data: unknown) => {

      const orderData = data as TransakOrderLike
      const id = orderData?.status?.id || orderData?.status?.orderId || orderData?.orderId || orderData?.id
      console.log("ORDER CREATED", orderData)
      log('ORDER_CREATED', orderData)
      if (id) {
        lastOrderIdRef.current = id
        await saveTransaction(orderData)
        startPolling(id)
        const initialStatus = mapTransakStatusToDbStatus(orderData?.status?.status || 'PENDING')
        setTransactionStatus(initialStatus)
        setIsProcessing(true)
      }
    })

    Transak.on(Transak.EVENTS.TRANSAK_WALLET_REDIRECTION, async (data: unknown) => {
      log('WALLET_REDIRECTION', data)
      const d = data as TransakOrderLike
      const id = d?.status?.orderId || d?.status?.id || d?.orderId || d?.id || lastOrderIdRef.current
      if (id) {
        lastOrderIdRef.current = id
        try {
          await saveTransaction(data)
        } catch (error) {
          console.error('Error saving transaction in WALLET_REDIRECTION:', error)
        }
        startPolling(id)
        const initialStatus = mapTransakStatusToDbStatus(d?.status?.status || 'PENDING')
        setTransactionStatus(initialStatus)
        setIsProcessing(true)

        // Validate data before redirecting
        const finalCryptoAmount = d.cryptoAmount || cryptoAmount
        const finalCryptoCurrency = d.cryptoCurrency || cryptoCurrency
        const finalWalletAddress = d.walletAddress || resolvedWalletAddress
        const finalNetwork = d.network || 'polygon'

        console.log('Wallet redirection data validation:', {
          id,
          finalCryptoAmount,
          finalCryptoCurrency,
          finalWalletAddress,
          finalNetwork
        })

        // Only redirect if we have valid data
        if (finalCryptoAmount && finalCryptoCurrency && finalWalletAddress && finalNetwork) {
          // Perform the redirect to complete the transfer
          console.log('Wallet redirection event - redirecting to:', `${window.location.origin}/sell/complete`)
          const redirectUrl = `${window.location.origin}/sell/complete?orderId=${id}&cryptoAmount=${finalCryptoAmount}&cryptoCurrency=${finalCryptoCurrency}&walletAddress=${finalWalletAddress}&network=${finalNetwork}`
          console.log('Redirecting to:', redirectUrl)

          // Close the widget and redirect
          try {
            transakRef.current?.close()
          } catch (error) {
            console.error('Error closing Transak widget:', error)
          }
          teardown(true)

          // Perform the redirect with a small delay to ensure widget closes
          setTimeout(() => {
            console.log('Executing redirect to:', redirectUrl)
            window.location.href = redirectUrl
          }, 100)
        } else {
          console.error('Invalid data for redirect:', {
            cryptoAmount: finalCryptoAmount,
            cryptoCurrency: finalCryptoCurrency,
            walletAddress: finalWalletAddress,
            network: finalNetwork
          })
          onError?.(new Error('Invalid order data received from Transak'))
        }
      }
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, async (data: unknown) => {
      log('ORDER_SUCCESSFUL', data)
      const d = data as TransakOrderLike
      const id = d?.status?.id || d?.status?.orderId
      if (id) {
        await checkTransactionStatus(id)

        // Validate data before redirecting
        const finalCryptoAmount = d.cryptoAmount || cryptoAmount
        const finalCryptoCurrency = d.cryptoCurrency || cryptoCurrency
        const finalWalletAddress = d.walletAddress || resolvedWalletAddress
        const finalNetwork = d.network || 'polygon'

        console.log('Order successful data validation:', {
          id,
          finalCryptoAmount,
          finalCryptoCurrency,
          finalWalletAddress,
          finalNetwork
        })

        // Only redirect if we have valid data
        if (finalCryptoAmount && finalCryptoCurrency && finalWalletAddress && finalNetwork) {
          // Manual redirect as fallback if Transak doesn't redirect automatically
          console.log('Order successful - attempting manual redirect')
          const redirectUrl = `${window.location.origin}/sell/complete?orderId=${id}&cryptoAmount=${finalCryptoAmount}&cryptoCurrency=${finalCryptoCurrency}&walletAddress=${finalWalletAddress}&network=${finalNetwork}`
          console.log('Redirecting to:', redirectUrl)

          // Close the widget and redirect
          try {
            transakRef.current?.close()
          } catch (error) {
            console.error('Error closing Transak widget:', error)
          }
          teardown(true)

          // Perform the redirect with a small delay to ensure widget closes
          setTimeout(() => {
            console.log('Executing redirect to:', redirectUrl)
            window.location.href = redirectUrl
          }, 100)
        } else {
          console.error('Invalid data for successful order redirect:', {
            cryptoAmount: finalCryptoAmount,
            cryptoCurrency: finalCryptoCurrency,
            walletAddress: finalWalletAddress,
            network: finalNetwork
          })
          onError?.(new Error('Invalid order data received from Transak'))
        }
      }
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, async (data: unknown) => {
      log('ORDER_FAILED', data)
      setIsProcessing(false)
      stopPolling()
      onError?.(data)
    })

    // Safety: if widget did not open within 8s, surface an error
    window.setTimeout(() => {
      if (!transakRef.current) return
      if (isLoading && !isProcessing) {
        log('Widget did not open within timeout; tearing down')
        teardown()
        onError?.(new Error('Failed to open Transak widget. Please try again.'))
      }
    }, 8000)

    // Fallback redirect after 30 seconds if user is still on processing screen
    window.setTimeout(() => {
      if (isProcessing && lastOrderIdRef.current) {
        console.log('Fallback redirect triggered after 30 seconds')
        const redirectUrl = `${window.location.origin}/sell/complete?orderId=${lastOrderIdRef.current}`
        console.log('Fallback redirecting to:', redirectUrl)

        // Close the widget and redirect
        try {
          transakRef.current?.close()
        } catch (error) {
          console.error('Error closing Transak widget:', error)
        }
        teardown(true)

        // Perform the redirect with a small delay to ensure widget closes
        setTimeout(() => {
          console.log('Executing fallback redirect to:', redirectUrl)
          window.location.href = redirectUrl
        }, 100)
      }
    }, 30000)
  }

  // Backward compatibility: auto-open on mount when rendered, unless autoOpen=false
  useEffect(() => {
    if (autoOpen) {
      initializeTransak()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Controlled mode: open prop triggers init when true
  useEffect(() => {
    if (open && !initializedRef.current) {
      initializeTransak()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Cleanup on unmount
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isLoading || isProcessing || isWidgetOpen)) {
        try { transakRef.current?.close() } catch { }
        teardown()
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
      teardown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    log('status ->', transactionStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatus])

  const StatusLine = () => {
    const color = transactionStatus === 'COMPLETED' ? 'text-green-600' : transactionStatus === 'FAILED' || transactionStatus === 'CANCELLED' ? 'text-red-600' : 'text-blue-600'
    const msg = transactionStatus === 'COMPLETED' ? 'Sell completed successfully!' : transactionStatus === 'FAILED' ? 'Sell failed.' : transactionStatus === 'CANCELLED' ? 'Sell cancelled.' : 'Processing your sell order...'
    return (
      <div className={`text-sm ${color}`}>{msg}</div>
    )
  }

  return (
    <div className="space-y-3">
      {(isLoading || isProcessing || isWidgetOpen) && (
        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <StatusLine />
          </div>
          <button
            type="button"
            onClick={() => {
              try { transakRef.current?.close() } catch { }
              teardown()
              onClose?.()
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}