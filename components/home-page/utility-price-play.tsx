'use client'
import React from 'react'
import { motion } from 'framer-motion'
import useCoingecko from '@/context/coingecko-context'
import Loader from '../loader-component'
import SectionWrapper from '../wrapper/section-wrapper'

interface TrendingItem {
  id: string
  name: string
  symbol: string
  image: string
  price: number
  change: number
  type: 'coin' | 'nft'
  currency?: string
}

const UtilityPricePlay = () => {
  const { loadingTrendingCoinsData, trendingCoinsData } = useCoingecko()

  if (loadingTrendingCoinsData) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader />
      </div>
    )
  }

  if (
    !trendingCoinsData?.[0]?.coins?.length &&
    !trendingCoinsData?.[0]?.nfts?.length
  ) {
    return null
  }

  const allItems: TrendingItem[] = [
    ...(trendingCoinsData[0]?.coins || []).map((coin) => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      image: coin.item.thumb,
      price: coin.item.data.price,
      change: coin.item.data.price_change_percentage_24h.usd,
      type: 'coin' as const,
    })),
    ...(trendingCoinsData[0]?.nfts || []).map((nft) => ({
      id: nft.id,
      name: nft.name,
      symbol: nft.symbol,
      image: nft.thumb,
      price: nft.floor_price_in_native_currency,
      change: nft.floor_price_24h_percentage_change,
      currency: nft.native_currency_symbol,
      type: 'nft' as const,
    })),
  ]

  const duplicatedItems = [...allItems, ...allItems]

  return (
    <SectionWrapper className="md:py-10 py-6">
      <div className="w-full overflow-hidden bg-white">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -50 * allItems.length],
          }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="inline-flex items-center mx-2 min-w-[200px] p-4"
            >
              <div className="flex items-center justify-center gap-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col mr-2">
                  <span className="text-xl text-black font-light">
                    {item.symbol.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {item.type === 'nft' ? `${item.currency} ` : '$'}
                  {item.price.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}

export default UtilityPricePlay
