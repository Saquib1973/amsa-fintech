'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<string>('PENDING')

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

      await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inferredId,
          isBuyOrSell: 'SELL',
          fiatAmount: d.fiatAmount,
          fiatCurrency: d.fiatCurrency || fiatCurrency,
          cryptoCurrency: d.cryptoCurrency || cryptoCurrency,
          walletLink: d.walletLink,
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
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const teardown = (skipClose?: boolean) => {
    stopPolling()
    try {
      if (!skipClose) transakRef.current?.close()
    } catch {}
    transakRef.current = null
    initializedRef.current = false
    setIsLoading(false)
    setIsProcessing(false)
  }

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
        } catch {}
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

    if (initializedRef.current) return
    initializedRef.current = true
    setIsLoading(true)

    const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API || ''

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
      // Keep users inside the Transak modal to see checkout screens
      walletRedirection: false,
      // redirectURL intentionally omitted to avoid early modal closure
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
      console.log("ORDER CREATED",orderData)
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
        } catch {}
        startPolling(id)
        const initialStatus = mapTransakStatusToDbStatus(d?.status?.status || 'PENDING')
        setTransactionStatus(initialStatus)
        setIsProcessing(true)
      }
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, async (data: unknown) => {
      log('ORDER_SUCCESSFUL', data)
      const d = data as TransakOrderLike
      const id = d?.status?.id || d?.status?.orderId
      if (id) {
        await checkTransactionStatus(id)
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
    return () => {
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
      {(isLoading || isProcessing) && (
        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <StatusLine />
          </div>
          <button
            type="button"
            onClick={() => {
              try { transakRef.current?.close() } catch {}
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