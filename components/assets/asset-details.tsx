'use client'
import Loader from '@/components/loader-component'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import { useCoingecko } from '@/hooks/use-coingecko'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AssetCalculator from './asset-calculator'
import AssetChart from './asset-chart'
import AssetHeader from './asset-header'
import AssetOverview from './asset-overview'
import TrendingCoins from './trending-coins'
import { HelpCircle } from 'lucide-react'

interface AssetDetailsProps {
  id: string
}

const AssetDetails = ({ id }: AssetDetailsProps) => {
  const { coinData, loadingCoinData, fetchCoinById, error } = useCoingecko()
  const [selectedCurrency, setSelectedCurrency] = useState('aud')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') ?? 'overview'
  )

  useEffect(() => {
    fetchCoinById(id)
  }, [id])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const newUrl = tab ? `/assets/${id}?tab=${tab}` : `/assets/${id}`
    router.push(newUrl, { scroll: false })
  }

  if (loadingCoinData || (!coinData && !error)) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center page-container">
        <Loader message={`Fetching ${id} data...`} />
      </div>
    )
  }

  if (error && !coinData) {
    return (
      <AnimateWrapper className="bg-gray-50/50 min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="p-8 max-w-md w-full">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mx-auto">
                  <HelpCircle className="size-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-light text-gray-900 mb-2">
                    Unable to load data
                  </h3>
                  <p className="text-sm text-gray-500">
                    We couldn&apos;t fetch information for {id.toUpperCase()}.
                    Please try again.
                  </p>
                </div>
                <button
                  onClick={() => fetchCoinById(id)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white rounded-full cursor-pointer transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimateWrapper>
    )
  }

  if (coinData) {
    const currencySymbol =
      coinData.market_data.current_price[
        selectedCurrency as keyof typeof coinData.market_data.current_price
      ]
        ?.toString()
        .charAt(0) || '$'

    return (
      <AnimateWrapper className="bg-gradient-to-b from-white via-blue-50/80 to-white">
        <SectionWrapper className="max-md:px-0 py-0 md:py-0">
          <div className="flex flex-col-reverse xl:flex-row justify-between gap-4 md:gap-0">
            <AssetHeader
              coinData={coinData}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />
            <AssetCalculator
              coinData={coinData}
              selectedCurrency={selectedCurrency}
            />
          </div>
        </SectionWrapper>
        <SectionWrapper className="max-md:px-0 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3">
            {activeTab === 'overview' && <AssetOverview coinData={coinData} />}
            {activeTab === 'chart' && (
              <AssetChart
                coinData={coinData}
                selectedCurrency={selectedCurrency}
                currencySymbol={currencySymbol}
              />
            )}
          </div>
          <TrendingCoins />
        </SectionWrapper>
      </AnimateWrapper>
    )
  }
}

export default AssetDetails
