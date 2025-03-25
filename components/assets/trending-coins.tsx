'use client'
import useCoingecko from '@/context/coingecko-context'
import Loader from '../loader-component'
const TrendingCoins = () => {
  const { loadingTrendingCoinsData, trendingCoinsData } = useCoingecko()
  if (loadingTrendingCoinsData) {
    return (
      <div className="flex items-center flex-col gap-2">
        <h2 className="text-3xl font-light mb-4">Trending Assets</h2>
        <Loader />
        <div className="h-20" />
        <h2 className="text-3xl font-light mb-4">Trending NFTs</h2>
        <Loader />
      </div>
    )
  }

  if (
    !trendingCoinsData?.[0]?.coins?.length &&
    !trendingCoinsData?.[0]?.nfts?.length
  ) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-light">Trending Assets</h2>
        <div className="text-sm text-gray-500">No data available</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {trendingCoinsData[0]?.coins?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-light mb-4">Trending Coins</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {trendingCoinsData[0].coins.map((coin) => (
              <div
                key={coin.item.id}
                className="py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={coin.item.thumb}
                      alt={coin.item.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-light text-sm">
                          {coin.item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {coin.item.symbol.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{coin.item.market_cap_rank}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="">
                      $
                      {coin.item.data.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={`${
                        coin.item.data.price_change_percentage_24h.usd >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {coin.item.data.price_change_percentage_24h.usd.toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trendingCoinsData[0]?.nfts?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-light mb-4">Trending NFTs</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {trendingCoinsData[0].nfts.map((nft) => (
              <div
                key={nft.id}
                className="py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={nft.thumb}
                      alt={nft.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-light text-sm truncate">
                          {nft.name}
                        </span>
                        <span className="truncate max-w-[50px] text-xs text-gray-500">
                          {nft.symbol.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="truncate">
                      {nft.native_currency_symbol}{' '}
                      {nft.floor_price_in_native_currency.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )}
                    </span>
                    <span
                      className={`truncate ${
                        nft.floor_price_24h_percentage_change >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {nft.floor_price_24h_percentage_change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrendingCoins
