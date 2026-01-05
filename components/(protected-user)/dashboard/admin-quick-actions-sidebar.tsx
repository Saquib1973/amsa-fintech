import {
  Users,
  CreditCard,
  ChevronRight,
  Settings,
  BarChart3,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const quickActions = [
  {
    name: 'View All Users',
    description: 'Manage all platform users',
    icon: <Users className="w-5 h-5" />,
    href: '/users',
  },
  {
    name: 'View All Transactions',
    description: 'Monitor all transactions',
    icon: <CreditCard className="w-5 h-5" />,
    href: '/admin/all-transactions',
  },
  {
    name: 'Analytics',
    description: 'View platform insights',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
  },
  {
    name: 'Configuration',
    description: 'Platform settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/config',
  },
  {
    name: 'Security',
    description: 'Security settings',
    icon: <Shield className="w-5 h-5" />,
    href: '/settings/security',
  },
]

const AdminQuickActionsSidebar = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md border border-gray-100">
        <div className="p-4 bg-primary-main rounded-t-md border-b border-gray-100 text-white">
          <h2 className="text-xl">Quick Actions</h2>
        </div>
        <div>
          <div className="space-y-0">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center group justify-between p-3 px-4 group hover:bg-gray-50 transition-all border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 group-hover:text-primary-main transition-all flex items-center justify-center">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{action.name}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:text-primary-main transition-all group-hover:translate-x-0.5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminQuickActionsSidebar
