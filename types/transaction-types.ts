export type TransactionStatus =
  | 'AWAITING_PAYMENT_FROM_USER'
  | 'ORDER_CREATED'
  | 'ORDER_PROCESSING'
  | 'ORDER_COMPLETED'
  | 'ORDER_FAILED'
  | 'ORDER_CANCELLED'
  | 'ORDER_EXPIRED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_CANCELLED'
  | 'PAYMENT_EXPIRED'
  | 'COMPLETED'
  | 'SUCCESS'
  | 'SUCCESSFUL'
  | 'DONE'
  | 'FINALIZED'
  | 'SETTLED'
  | 'CONFIRMED'
  | 'PENDING'
  | 'PROCESSING'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'PENDING_DELIVERY_FROM_TRANSAK'
  | 'PAYMENT_DONE_MARKED_BY_USER'
  | 'TIMEOUT';

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

export interface TransakOrderData {
  eventName: string;
  status: {
    id: string;
    userId: string;
    isBuyOrSell: string;
    fiatCurrency: string;
    cryptoCurrency: string;
    fiatAmount: number;
    status: TransactionStatus;
    amountPaid: number;
    paymentOptionId: string;
    walletAddress: string;
    walletLink: string;
    network: string;
    cryptoAmount: number;
    totalFeeInFiat: number;
    fiatAmountInUsd: string | null;
    countryCode: string;
    stateCode: string;
    createdAt: string;
    updatedAt: string;
    statusReason?: string;
    transakFeeAmount?: number;
    cardPaymentData?: {
      status: TransactionStatus;
      statusReason?: string;
      processedOn?: string;
    };
    statusHistories?: Array<{
      status: TransactionStatus;
      createdAt: string;
      message: string;
    }>;
  };
}