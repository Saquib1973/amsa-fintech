import { CoinData } from '@/types/coingecko-types'
import CurrencyDropdown from '@/components/dropdown/currency-dropdown'
import { formatLargeNumber } from '@/utils/format-large-number'
import Image from 'next/image'
interface AssetHeaderProps {
  coinData: CoinData
  selectedCurrency: string
  setSelectedCurrency: (currency: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'aud', label: 'AUD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'gbp', label: 'GBP', symbol: '£' },
]

const AssetHeader = ({ coinData, selectedCurrency, setSelectedCurrency, activeTab, setActiveTab }: AssetHeaderProps) => {
  const getCurrentPrice = () => {
    if (!coinData?.market_data?.current_price) return '0.00'
    return coinData.market_data.current_price[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ]
  }

  return (
    <div className="flex flex-col items-center justify-between w-full md:p-4 md:pb-0 pb-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 border-gray-200 w-full border-b">
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
                  CURRENCY_OPTIONS.find((opt) => opt.value === selectedCurrency)
                    ?.symbol
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
      <div className="w-full border-gray-200 border-b overflow-x-auto overflow-y-visible">
        <div className="flex min-w-max gap-4 py-4">
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 border-r border-gray-200">
            <h3 className="font-light text-sm sm:text-base text-gray-600">
              Global Rank
            </h3>
            <h1 className="text-lg sm:text-3xl font-medium">
              #{coinData.market_data.market_cap_rank}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 border-r border-gray-200">
            <h3 className="font-light text-sm sm:text-base text-gray-600">
              Market Cap
            </h3>
            <h1 className="text-lg sm:text-3xl font-medium">
              {formatLargeNumber(coinData.market_data.market_cap.usd)}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 border-r border-gray-200">
            <h3 className="font-light text-sm sm:text-base text-gray-600">
              24H Volume
            </h3>
            <h1 className="text-lg sm:text-3xl font-medium">
              {formatLargeNumber(coinData.market_data.total_volume.usd)}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 border-gray-200">
            <h3 className="font-light text-sm sm:text-base text-gray-600">
              Fully Diluted Market Cap
            </h3>
            <h1 className="text-lg sm:text-3xl font-medium">
              {formatLargeNumber(coinData.market_data.market_cap.usd)}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-auto items-center justify-center gap-2 px-3 sm:px-6 relative">
        <CurrencyDropdown
          options={CURRENCY_OPTIONS}
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          className="w-28"
        />
      </div>
      <div className="w-full mt-2 flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`cursor-pointer text-lg sm:text-3xl font-light border-b-4 p-4 sm:p-6 transition-colors ${
            activeTab === 'overview'
              ? 'border-b-blue-400 text-blue-600'
              : 'border-b-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`cursor-pointer text-lg sm:text-3xl font-light border-b-4 p-4 sm:p-6 transition-colors ${
            activeTab === 'chart'
              ? 'border-b-blue-400 text-blue-600'
              : 'border-b-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Charts
        </button>
      </div>
    </div>
  )
}

export default AssetHeader