import { CoinData } from '@/types/coingecko-types'
import CurrencyDropdown from '@/components/dropdown/currency-dropdown'
import { formatLargeNumber } from '@/utils/format-large-number'

interface AssetHeaderProps {
  coinData: CoinData
  selectedCurrency: string
  setSelectedCurrency: (currency: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'aud', label: 'AUD', symbol: 'A$' },
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
    <div className="flex flex-col items-center w-full gap-4 p-4 pb-0">
      <div className="flex items-center justify-between gap-4 py-4 border-gray-200 w-full border-b">
        <div className="flex items-center gap-4">
          <img
            src={coinData.image.large}
            alt={coinData.name}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-light flex items-center gap-2">
              {coinData.name} ({coinData.symbol.toUpperCase()})
              <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                {coinData.symbol.toUpperCase()}
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-5xl tracking-tight text-black">
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
      <div className="flex gap-4 w-full border-gray-200 border-b">
        <div className="flex flex-col items-center justify-center gap-2 px-6 my-4 border-r border-gray-200">
          <h3 className="font-light">Global Rank</h3>
          <h1 className="text-3xl">
            #{coinData.market_data.market_cap_rank}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-6 my-4 border-r border-gray-200">
          <h3 className="font-light">Market Cap</h3>
          <h1 className="text-3xl">
            {formatLargeNumber(coinData.market_data.market_cap.usd)}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-6 my-4 border-r border-gray-200">
          <h3 className="font-light">24H Volume</h3>
          <h1 className="text-3xl">
            {formatLargeNumber(coinData.market_data.total_volume.usd)}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-6 my-4">
          <h3 className="font-light">Fully Diluted Market Cap</h3>
          <h1 className="text-3xl">
            {formatLargeNumber(coinData.market_data.market_cap.usd)}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-6 my-4">
          <CurrencyDropdown
            options={CURRENCY_OPTIONS}
            value={selectedCurrency}
            onChange={setSelectedCurrency}
            className="w-28"
          />
        </div>
      </div>
      <div className="w-full mt-4 flex">
        <button
          onClick={() => setActiveTab('overview')}
          className={`cursor-pointer text-3xl font-light border-b-4 p-6 ${
            activeTab === 'overview'
              ? 'border-b-blue-400'
              : 'border-b-transparent'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`cursor-pointer text-3xl font-light border-b-4 p-6 ${
            activeTab === 'chart'
              ? 'border-b-blue-400'
              : 'border-b-transparent'
          }`}
        >
          Charts
        </button>
      </div>
    </div>
  )
}

export default AssetHeader