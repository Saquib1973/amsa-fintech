'use client'
import Loader from '@/components/loader-component'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import useCoingecko from '@/context/coingecko-context'
import { useEffect, useState } from 'react'
import PrimaryButton from '../button/primary-button'
import CurrencyDropdown from '@/components/dropdown/currency-dropdown'
import Link from 'next/link'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { formatLargeNumber } from '@/utils/format-large-number'

interface AssetDetailsProps {
  id: string
}

const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'aud', label: 'AUD', symbol: 'A$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'gbp', label: 'GBP', symbol: '£' },
]

const AssetDetails = ({ id }: AssetDetailsProps) => {
  const { coinData, loadingCoinData, fetchCoinById } = useCoingecko()
  const [selectedCurrency, setSelectedCurrency] = useState('usd')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCoinById(id)
  }, [id])

  const getCurrentPrice = () => {
    if (!coinData?.market_data?.current_price) return '0.00'
    return coinData.market_data.current_price[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ]
  }

  if (loadingCoinData) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center page-container">
        <Loader message={`Loading ${id} data...`} />
      </div>
    )
  }

  if (!coinData) {
    return (
      <div className="flex justify-center items-center page-container">
        <div className="text-red-500 text-3xl font-light">
          Failed to load {id} data
        </div>
      </div>
    )
  }

  return (
    <AnimateWrapper>
      <SectionWrapper className="md:py-0">
        <div className="flex justify-between">
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
                className={`cursor-pointer text-3xl font-light border-b-4 p-6 border-b-blue-400 ${
                  activeTab === 'overview'
                    ? 'border-b-blue-400'
                    : 'border-b-transparent'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`cursor-pointer text-3xl font-light border-b-4 p-6 border-b-blue-400 ${
                  activeTab === 'links'
                    ? 'border-b-blue-400'
                    : 'border-b-transparent'
                }`}
              >
                Links
              </button>
            </div>
          </div>
          <div className="md:border-l border-gray-200 flex gap-4 justify-center flex-col p-10 md:p-20">
            <h1 className="text-2xl font-light">
              Buy {coinData.name} in minutes
            </h1>
            <PrimaryButton>Buy Now</PrimaryButton>
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper>
        {activeTab === 'overview' && (
          <div className="md:max-w-[70%]">
            <h2 className="text-3xl font-light mb-4">About {coinData.name}</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: coinData.description.en }}
            />
          </div>
        )}
        {activeTab === 'links' && (
          <div className="">
            <h2 className="text-3xl font-light mb-4">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coinData.links.homepage[0] && (
                <Link
                  href={coinData.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Official Website
                </Link>
              )}
              {coinData.links.blockchain_site[0] && (
                <Link
                  href={coinData.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Blockchain Explorer
                </Link>
              )}
              {coinData.links.twitter_screen_name && (
                <Link
                  href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </Link>
              )}
              {coinData.links.subreddit_url && (
                <Link
                  href={coinData.links.subreddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Reddit
                </Link>
              )}
            </div>
          </div>
        )}
      </SectionWrapper>
    </AnimateWrapper>
  )
}

export default AssetDetails
