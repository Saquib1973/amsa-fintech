"use client"
import { CoinData } from '@/types/coingecko-types'
import Image from 'next/image'
import { useState } from 'react'
import TransakPaymentComponent from '../transak-payment-component'
import { useSession } from 'next-auth/react'
import PrimaryButton from '../button/primary-button'
interface AssetCalculatorProps {
  coinData: CoinData
  selectedCurrency: string
}

const AssetCalculator = ({
  coinData,
  selectedCurrency,
}: AssetCalculatorProps) => {
  const [currencyAmount, setCurrencyAmount] = useState('')
  const [coinAmount, setCoinAmount] = useState('')
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

  const handleTransakSuccess = (orderData: {
    orderId: string
    status: string
    transactionHash?: string
    paymentMethod: string
    amount: number
    currency: string
    timestamp: string
    [key: string]: unknown
  }) => {
    console.log('Transaction successful:', orderData)
  }

  const handleTransakClose = () => {
    console.log('Transak closed')
  }

  const currentPrice =
    coinData.market_data?.current_price?.[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ] || 0

  return (
    <div className="hidden xl:block md:w-[50%] border-l border-gray-200">
      <div className="max-w-80 m-auto py-12 p-6">
        <p className="text-3xl font-isola mb-6">
          Buy {coinData.name} in minutes
        </p>
        <div className="asset-calculator flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              name="dollars"
              className="input-field text-right w-full p-4 border rounded-lg"
              placeholder="Enter amount"
              value={currencyAmount}
              onChange={handleAmountChange}
            />
          </div>

          <svg
            className="text-black block m-auto fill-current"
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
            <div className="asset-icon absolute left-6 top-1/2 -translate-y-1/2">
              <Image
                width={24}
                height={24}
                src={coinData.image.large}
                alt={coinData.name}
                className="w-6 h-6"
              />
            </div>
            <input
              type="text"
              name="asset-value"
              className="input-field text-right w-full p-4 border rounded-lg pl-12"
              placeholder="0.00"
              value={coinAmount}
              onChange={handleCoinChange}
            />
          </div>
          <p className="text-color-text-body asset-price-calc">
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
