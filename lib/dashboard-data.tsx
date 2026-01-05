import { NavSection } from '@/components/dashboard/sidebar/types'
import {
  Bitcoin,
  ChartBar,
  Coins,
  CreditCard,
  Globe,
  History,
  Home,
  Lock,
  RefreshCw,
  Settings,
  User,
  Users,
  Wallet,
  WalletCards as Holdings
} from 'lucide-react'


export const dashboardSidebarItems: NavSection[] = [
  {
    title: 'General',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 1,
      },
      {
        name: 'Assets',
        href: '/assets',
        icon: <Coins className="w-5 h-5" />,
        roles: ['USER'],
        order: 2,
      },
      // {
      //   name: 'Wallets',
      //   href: '/wallets',
      //   icon: <Wallet className="w-5 h-5" />,
      //   roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      //   order: 3,
      // },
      {
          name: 'Holdings',
          href: '/holdings',
          icon: <Holdings className="w-5 h-5" />,
          roles: ['USER'],
          order: 3,

      },
      {
        name: 'Transactions',
        href: '/transactions',
        icon: <CreditCard className="w-5 h-5" />,
        roles: ['USER'],
        order: 4,
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: <ChartBar className="w-5 h-5" />,
        roles: ['USER'],
        order: 5,
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: <User className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 6,
      },
    ],
  },
  {
    title: 'Admin Tools',
    items: [
      {
        name: 'Users',
        href: '/users',
        icon: <Users className="w-5 h-5" />,
        roles: ['ADMIN', 'SUPER_ADMIN'],
        order: 1,
      },
      {
        name: 'Config',
        href: '/config',
        icon: <Settings className="w-5 h-5" />,
        roles: ['SUPER_ADMIN', 'ADMIN'],
        order: 2,
      },
      {
        name: 'All Transactions',
        href: '/admin/all-transactions',
        icon: <CreditCard className="w-5 h-5" />,
        roles: ['SUPER_ADMIN'],
        order: 3,
      },
      {
        name: 'Transak',
        href: '/transak',
        icon: <Bitcoin className="w-5 h-5" />,
        hasSubmenu: true,
        submenuItems: [
          {
            name: 'Transak',
            href: '/transak',
            icon: <Wallet className="w-5 h-5" />,
            order: 1,
          },
          {
            name: 'Refresh Token',
            href: '/transak/refresh-token',
            icon: <RefreshCw className="w-5 h-5" />,
            order: 2,
          },
        ],
        order: 4,
        roles: ['SUPER_ADMIN'],
      },
    ],
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Security',
        href: '/settings/security/password',
        icon: <Lock className="w-5 h-5" />,
        hasSubmenu: true,
        submenuItems: [
          {
            order: 1,
            name: 'Change Password',
            href: '/settings/security/password',
            icon: <Lock className="w-5 h-5" />,
          },
          {
            order: 2,
            name: 'Login History',
            href: '/settings/security/history',
            icon: <History className="w-5 h-5" />,
          },
        ],
        order: 1,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      },
      {
        order: 2,
        name: 'Preferences',
        href: '/settings/preferences',
        icon: <Globe className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
  },
]
