export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'

export interface StatusHistory {
  status: string
  createdAt: string
  message?: string
}

export type Transaction = {
  id: string
  isBuyOrSell: 'BUY' | 'SELL'
  cryptoCurrency: string
  fiatAmount: number
  fiatCurrency: string
  status: TransactionStatus
  createdAt: Date
  network?: string
  walletAddress?: string
  walletLink?: string
  paymentOptionId?: string | null
  fiatAmountInUsd?: string | null
  statusHistories?: StatusHistory[]
  userId?: string
}