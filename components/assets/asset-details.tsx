'use client'
import Loader from '@/components/loader-component'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import useCoingecko from '@/context/coingecko-context'
import { useEffect, useState } from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import AssetHeader from './asset-header'
import AssetOverview from './asset-overview'
import AssetChart from './asset-chart'
import TrendingCoins from './trending-coins'
import AssetCalculator from './asset-calculator'
import { useRouter, useSearchParams } from 'next/navigation'
interface AssetDetailsProps {
  id: string
}

const AssetDetails = ({ id }: AssetDetailsProps) => {
  const { coinData, loadingCoinData, fetchCoinById } = useCoingecko()
  const [selectedCurrency, setSelectedCurrency] = useState('aud')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'overview')

  useEffect(() => {
    fetchCoinById(id)
  }, [id])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newUrl = tab ? `/assets/${id}?tab=${tab}` : `/assets/${id}`
    router.push(newUrl,{scroll:false})
  }

  if (loadingCoinData) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center page-container">
        <Loader message={`Loading ${id} data...`} />
      </div>
    )
  }

  if ((!coinData && !loadingCoinData) || coinData === null) {
    return (
      <div className="flex justify-center items-center page-container">
        <div className="text-red-500 text-3xl font-light">
          Failed to load {id} data
        </div>
      </div>
    )
  }

  const currencySymbol =
    coinData.market_data.current_price[
      selectedCurrency as keyof typeof coinData.market_data.current_price
    ]
      ?.toString()
      .charAt(0) || '$'

  return (
    <AnimateWrapper className="bg-gradient-to-b from-white via-blue-50/80 to-white">
      <SectionWrapper className="py-0 md:py-0">
        <div className="flex flex-col xl:flex-row justify-between gap-4 md:gap-0">
          <AssetHeader
            coinData={coinData}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <AssetCalculator coinData={coinData} selectedCurrency={selectedCurrency} />
        </div>
      </SectionWrapper>
      <SectionWrapper className="flex flex-col lg:flex-row gap-4">
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

export default AssetDetails
