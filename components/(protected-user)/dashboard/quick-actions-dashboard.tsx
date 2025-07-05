import { Coins, Settings, History, BarChart3, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
const quickActions = [
  {
    name: 'Transactions',
    description: 'View your transaction history',
    icon: <History className="w-5 h-5" />,
    href: '/transactions',
  },
  {
    name: 'Analytics',
    description: 'View financial insights',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
  },
  {
    name: 'Assets',
    description: 'Browse available assets',
    icon: <Coins className="w-5 h-5" />,
    href: '/assets',
  },
  {
    name: 'Settings',
    description: 'Manage your account',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
  },
]
const QuickActionsDashboard = () => {
  return (
    <div className="bg-white rounded-md border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group p-3 sm:p-3 rounded-lg transition-all duration-200 border border-gray-100 min-h-[70px] sm:min-h-0 flex items-center"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0">
                  <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-sm group-hover:text-blue-700 transition-colors">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {action.description}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
                </div>
                <div className="sm:hidden">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickActionsDashboard
