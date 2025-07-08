import {
  Bitcoin,
  Coins,
  DollarSign,
  ChevronRight,
  Settings,
  Shield,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
const popularAssetsDashboard = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: <Bitcoin className="w-5 h-5" />,
    href: '/assets/bitcoin?tab=overview',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: <Coins className="w-5 h-5" />,
    href: '/assets/ethereum?tab=overview',
  },
  {
    name: 'US Dollar',
    symbol: 'USD',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/assets/usd?tab=overview',
  },
]

const PopularAssetsSettingsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-primary-main rounded-t-md text-white">
          <h2 className="text-xl">Assets</h2>
        </div>
        <div className="">
          <div className="space-y-3">
            {popularAssetsDashboard.map((asset) => (
              <Link
                key={asset.symbol}
                href={asset.href}
                className="flex items-center group justify-between p-3 px-4 group hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 group-hover:text-primary-main transition-all flex items-center justify-center">
                    {asset.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500">{asset.symbol}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:text-primary-main ransition-all group-hover:translate-x-0.5 text-gray-400" />
              </Link>
            ))}
          </div>
            <Link
              href="/assets"
              className="flex w-full items-center hover:text-primary-main hover:bg-gray-50 justify-center gap-2 rounded-b-md px-4 py-4 text-sm font-medium  transition-colors group"
            >
              <span>All assets</span>
              <ChevronRight className="h-4 w-4 group-hover:text-primary-main transition-all group-hover:translate-x-0.5" />
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-100">
        <div className="p-4 bg-primary-main rounded-t-md border-b border-gray-100">
          <h2 className="text-xl text-white">
            Settings
          </h2>
        </div>
        <div className="">
          <div className="space-y-2">
            <Link
              href="/profile"
              className="flex items-center group justify-between p-4 px-4 group hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 group-hover:text-primary-main transition-all flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-gray-900 text-sm">Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:text-primary-main transition-all group-hover:translate-x-0.5 text-gray-400" />
            </Link>
            <Link
              href="/profile/security"
              className="flex items-center group justify-between p-4 px-4 group hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 group-hover:text-primary-main transition-all flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-gray-900 text-sm">Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-main transition-all group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/support"
              className="flex items-center group justify-between p-4 px-4 group hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 group-hover:text-primary-main transition-all flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-gray-900 text-sm">Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-main transition-all group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopularAssetsSettingsDashboard
