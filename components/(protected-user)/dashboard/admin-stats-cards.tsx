import { Users, CreditCard, AlertCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

interface AdminStatsCardsProps {
  totalUsers: number
  totalTransactions: number
  pendingVerifications: number
  totalVolume: number
  buyVolume: number
  sellVolume: number
}

export default function AdminStatsCards({
  totalUsers,
  totalTransactions,
  pendingVerifications,
  totalVolume,
  buyVolume,
  sellVolume,
}: AdminStatsCardsProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* First Row - Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-md border border-gray-100 p-4 transition-shadow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
            <p className="text-2xl font-light ml-10">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-100 p-4 transition-shadow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-500">Transactions</p>
            </div>
            <p className="text-2xl font-light ml-10">{totalTransactions}</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-100 p-4 transition-shadow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500">Pending KYC</p>
            </div>
            <p className="text-2xl font-light ml-10">{pendingVerifications}</p>
          </div>
        </div>
      </div>

      {/* Second Row - Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-md border border-gray-100 p-4 transition-shadow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs text-gray-500">Total Volume</p>
            </div>
            <p className="text-2xl font-light ml-10">${totalVolume.toFixed(0)}</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-100 p-4 transition-shadow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-500">Buy Volume</p>
            </div>
            <p className="text-2xl font-light text-emerald-600 ml-10">${buyVolume.toFixed(0)}</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-100 p-4 transition-shadow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-xs text-gray-500">Sell Volume</p>
            </div>
            <p className="text-2xl font-light text-rose-600 ml-10">${sellVolume.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
