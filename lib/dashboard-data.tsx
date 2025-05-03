import { Coins, CreditCard, Database, Globe, Home, Lock, Settings, Shield, User, Users } from 'lucide-react';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface NavItem {
  name: string
  href?: string
  icon: React.ReactNode
  hasSubmenu?: boolean
  submenuItems?: NavItem[]
  roles?: UserRole[]
  isAdminOnly?: boolean
}

export const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: <Coins className="w-5 h-5" />,
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: <User className="w-5 h-5" />,
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Admin Panel',
    icon: <Shield className="w-5 h-5" />,
    hasSubmenu: true,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    isAdminOnly: true,
    submenuItems: [
      {
        name: 'User Management',
        href: '/users-management',
        icon: <Users className="w-5 h-5" />,
        roles: ['ADMIN', 'SUPER_ADMIN'],
      },
      {
        name: 'System Settings',
        href: '/system',
        icon: <Database className="w-5 h-5" />,
        roles: ['SUPER_ADMIN'],
      },
    ],
  },
  {
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    hasSubmenu: true,
    roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
    submenuItems: [
      {
        name: 'Security',
        href: '/settings/security',
        icon: <Lock className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      },
      {
        name: 'Preferences',
        href: '/settings/preferences',
        icon: <Globe className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
  },
];
