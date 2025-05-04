import CurrencyDropdown from '@/components/dropdown/currency-dropdown'
import { CoinData } from '@/types/coingecko-types'
import { formatLargeNumber } from '@/utils/format-large-number'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import Breadcrumb from '../bread-crumb'
interface AssetHeaderProps {
  coinData: CoinData
  selectedCurrency: string
  setSelectedCurrency: (currency: string) => void
  activeTab: string
  handleTabChange: (tab: string) => void
}

const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'aud', label: 'AUD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'gbp', label: 'GBP', symbol: '£' },
]

const AssetHeader = ({
  coinData,
  selectedCurrency,
  setSelectedCurrency,
  activeTab,
  handleTabChange,
}: AssetHeaderProps) => {
  const getCurrentPrice = () => {
    if (!coinData?.market_data?.current_price) return '0.00'
    return coinData.market_data.current_price[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ]
  }

  const overviewRef = useRef<HTMLButtonElement>(null)
  const chartRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    handleTabChange(activeTab)
  }, [activeTab, handleTabChange])
  return (
    <div className="flex  flex-col items-center justify-between w-full md:py-4 md:pb-0 pb-0">
      <div className=" w-full mb-2">
        <Breadcrumb className="max-xl:hidden" />
      </div>
      <div className="flex xl:flex-col  w-full">
        <div className=" flex flex-col sm:flex-row items-center justify-between gap-6 py-4 border-gray-200 w-full border-b">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={coinData.image.large}
              alt={coinData.name}
              width={64}
              height={64}
              className="rounded-full w-16 h-16 sm:w-20 sm:h-20"
            />
            <div className="flex flex-col gap-3 items-center sm:items-start">
              <h1 className="text-2xl sm:text-4xl font-light flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {coinData.name} ({coinData.symbol.toUpperCase()})
                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                  {coinData.symbol.toUpperCase()}
                </span>
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl sm:text-5xl tracking-tight text-black font-medium">
                  {
                    CURRENCY_OPTIONS.find(
                      (opt) => opt.value === selectedCurrency
                    )?.symbol
                  }
                  {getCurrentPrice().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-xl:border-b border-gray-200">
          <div className=" w-full border-gray-200 xl:border-b overflow-x-auto overflow-y-visible">
            <div className="flex min-w-max max-xl:flex-col gap-4 py-4">
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 xl:border-r border-gray-200">
                <h3 className="font-light text-sm sm:text-base text-gray-600">
                  Global Rank
                </h3>
                <h1 className="text-lg sm:text-3xl font-medium">
                  #{coinData.market_data.market_cap_rank}
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 xl:border-r border-gray-200">
                <h3 className="font-light text-sm sm:text-base text-gray-600">
                  Market Cap
                </h3>
                <h1 className="text-lg sm:text-3xl font-medium">
                  {formatLargeNumber(coinData.market_data.market_cap.usd)}
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 xl:border-r border-gray-200">
                <h3 className="font-light text-sm sm:text-base text-gray-600">
                  24H Volume
                </h3>
                <h1 className="text-lg sm:text-3xl font-medium">
                  {formatLargeNumber(coinData.market_data.total_volume.usd)}
                </h1>
              </div>
              <div className="flex flex-col max-xl:hidden items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 border-gray-200">
                <h3 className="font-light text-sm sm:text-base text-gray-600">
                  Fully Diluted Market Cap
                </h3>
                <h1 className="text-lg sm:text-3xl font-medium">
                  {formatLargeNumber(coinData.market_data.market_cap.usd)}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-auto items-end p-2 justify-end gap-2 px-3 sm:px-6 relative">
            <CurrencyDropdown
              options={CURRENCY_OPTIONS}
              value={selectedCurrency}
              onChange={setSelectedCurrency}
              className="w-28"
            />
          </div>
        </div>
      </div>

      <div className=" w-full mt-2 flex border-b relative border-gray-200">
        <motion.div
          className="h-1 absolute bottom-0 bg-primary-main"
          animate={{
            left:
              activeTab === 'overview' || activeTab === ''
                ? overviewRef.current?.offsetLeft
                : chartRef.current?.offsetLeft,
            width:
              activeTab === 'overview' || activeTab === ''
                ? overviewRef.current?.offsetWidth
                : chartRef.current?.offsetWidth,
          }}
        />
        <button
          ref={overviewRef}
          onClick={() => handleTabChange('overview')}
          className={`cursor-pointer text-lg sm:text-3xl font-light p-4 sm:p-6 transition-colors ${
            activeTab === 'overview'
              ? ' text-primary-main'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          ref={chartRef}
          onClick={() => handleTabChange('chart')}
          className={`cursor-pointer text-lg sm:text-3xl font-light p-4 sm:p-6 transition-colors ${
            activeTab === 'chart'
              ? ' text-primary-main'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Charts
        </button>
      </div>
    </div>
  )
}

export default AssetHeader
