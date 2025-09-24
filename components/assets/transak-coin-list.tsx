import Image from 'next/image'
import type { TransakCryptoCurrency } from '@/types/transak'

interface Props {
  readonly coins: ReadonlyArray<TransakCryptoCurrency>
}

export default function TransakCoinList({ coins }: Props) {
  const allowedCoins = Array.isArray(coins)
    ? coins.filter((c) => c.isPayInAllowed)
    : []

  if (!allowedCoins.length) {
    return (
      <div className="w-full p-6 text-center text-gray-600 dark:text-gray-300">
        No cryptocurrencies available for pay-in.
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
          <tr className="text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wide">
            <th className="text-left px-4 py-2 w-1/2">Name</th>
            <th className="text-left px-4 py-2 w-1/4">Symbol</th>
            <th className="text-left px-4 py-2 w-1/4">Network</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {allowedCoins.map((c) => {
            const img = c.image?.small || c.image?.thumb || c.image?.large
            return (
              <tr key={c.uniqueId || c._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {img ? (
                      <Image src={img} alt={c.name} width={20} height={20} className="rounded-full" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                    <span className="text-gray-900 dark:text-gray-100 truncate">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-200 uppercase">
                    {c.symbol}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {c.network?.name ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 px-2 py-0.5 text-[11px]">
                      {c.network.name}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">-</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}


