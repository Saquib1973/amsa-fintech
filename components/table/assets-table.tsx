'use client'
import useCoingecko from '@/context/coingecko-context'
import React from 'react'
import Loader from '../loader-component'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
interface CoinData {
  id: string
  name: string
  symbol: string
  image?: string
  large?: string
  market_cap_rank: number
  current_price?: number
  market_cap?: number
  total_volume?: number
  price_change_percentage_24h?: number
}

const AssetsTable: React.FC = () => {
  const router = useRouter()
  const {
    coinsData,
    queryCoinsData,
    currentPage,
    setCurrentPage,
    sortConfig,
    setSortConfig,
    loadingCoinsData,
    loadingQueryCoinsData,
  } = useCoingecko()

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatPercentage = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A'
    return `${num.toFixed(2)}%`
  }
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loadingCoinsData) {
    return (
      <div className="w-full bg-white h-fit max-w-3xl overflow-x-auto">
        <h2 className="text-3xl font-light border-b border-gray-200 mb-4 p-3">
          {queryCoinsData ? 'Search Results' : 'Crypto Market Prices'}
        </h2>
        <div className="w-full text-sm flex-col py-10 min-h-[680px] flex items-center justify-center">
          <Loader message="Loading crypto market prices..." />
        </div>
      </div>
    )
  }
  if (loadingQueryCoinsData) {
    return (
      <div className="w-full bg-white h-fit max-w-3xl overflow-x-auto">
        <h2 className="text-3xl font-light mb-4 border-b border-gray-200 p-3">
          {queryCoinsData ? 'Search Results' : 'Crypto Market Prices'}
        </h2>
          <div className="w-full text-sm flex-col py-10 min-h-[680px] flex items-center justify-center">
            <Loader message="Loading crypto market prices..." />
          </div>
      </div>
    )
  }

  const displayData = queryCoinsData ? queryCoinsData.coins : coinsData || []

  return (
    <div className="w-full bg-white h-fit max-w-3xl overflow-x-auto">
      <h2 className="text-3xl font-light mb-4 border-b border-gray-200 p-3">
        {queryCoinsData ? 'Search Results' : 'Crypto Market Prices'}
      </h2>
      <table className="min-w-full">
        <thead className="">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-light light-text uppercase tracking-wider">
              #
            </th>
            <th className="px-2 py-3 text-left text-xs font-light light-text uppercase tracking-wider">
              Name
            </th>
            <th
              className="px-2 py-3 text-left text-xs font-light light-text uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => !queryCoinsData && handleSort('current_price')}
            >
              Price {!queryCoinsData && getSortIcon('current_price')}
            </th>
            <th
              className="px-2 py-3 text-left max-md:hidden text-xs font-light light-text uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => !queryCoinsData && handleSort('market_cap')}
            >
              Market Cap {!queryCoinsData && getSortIcon('market_cap')}
            </th>
            <th
              className="px-2 py-3 text-left max-md:hidden text-xs font-light light-text uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => !queryCoinsData && handleSort('total_volume')}
            >
              Volume {!queryCoinsData && getSortIcon('total_volume')}
            </th>
            <th
              className="px-2 py-3 text-left text-xs font-light light-text uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() =>
                !queryCoinsData && handleSort('price_change_percentage_24h')
              }
            >
              24h{' '}
              {!queryCoinsData && getSortIcon('price_change_percentage_24h')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayData.length <= 0 ? (
            <tr>
              <td colSpan={6} className="px-2 py-2 text-center">
                <div className="text-red-500 text-xl font-light">
                  No assets found
                </div>
              </td>
            </tr>
          ) : (
            displayData.map((coin: CoinData | { item: CoinData }) => {
              const coinData = 'item' in coin ? coin.item : coin
              const getValidImageUrl = (url: string | undefined) => {
                if (!url) return '/images/missing_large.png'
                if (url.startsWith('http')) return url
                return url.startsWith('/') ? url : `/${url}`
              }
              const imageUrl = getValidImageUrl(coinData.large || coinData.image)
              return (
                <tr
                  key={coinData.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/assets/${coinData.id}`)}
                >
                  <td className="px-2 py-2 whitespace-nowrap text-sm light-text">
                    {coinData.market_cap_rank || 'N/A'}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={imageUrl}
                          alt={coinData.name}
                          width={32}
                          height={32}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/missing_large.png';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-light text-gray-900">
                          {coinData.name}
                        </div>
                        <div className="text-sm light-text">
                          {coinData.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(coinData.current_price)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 max-md:hidden">
                    {formatNumber(coinData.market_cap)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 max-md:hidden">
                    {formatNumber(coinData.total_volume)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    <span
                      className={`${
                        (coinData.price_change_percentage_24h ?? 0) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatPercentage(coinData.price_change_percentage_24h)}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {!queryCoinsData && (
        <div className="flex items-center justify-center mt-6 px-4 py-3 sm:px-6">
          <nav
            className="relative flex items-center gap-4 z-0"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="size-6" />
            </button>
            <div>
              <p className="text-sm text-gray-700">
                Page No. <span className="font-medium">{currentPage}</span>
              </p>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="relative cursor-pointer disabled:opacity-50"
            >
              <ChevronRight className="size-6" />
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default AssetsTable
