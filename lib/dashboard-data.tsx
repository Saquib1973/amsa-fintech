import { Bitcoin, ChartBar, Coins, CreditCard, Database, Globe, Home, Lock, Settings, User, Users } from 'lucide-react';
import React from 'react';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenuItems?: NavItem[];
  roles?: UserRole[];
  isAdminOnly?: boolean;
  order?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  roles?: UserRole[];
}

export const navSections: NavSection[] = [
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
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 2,
      },
      {
        name: 'Transactions',
        href: '/transactions',
        icon: <CreditCard className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 3,
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: <ChartBar className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 4,
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: <User className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 5,
      },
    ],
  },
  {
    title: 'Admin Tools',
    items: [
      {
        name: 'User Management',
        href: '/users-management',
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
        name: 'System Settings',
        href: '/system',
        icon: <Database className="w-5 h-5" />,
        roles: ['SUPER_ADMIN'],
        order: 3,
      },
    ],
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    title: 'Super Admin',
    items: [
      {
        name: 'Transak',
        href: '/transak',
        icon: <Bitcoin className="w-5 h-5" />,
        roles: ['SUPER_ADMIN'],
        order: 1,
      },
    ],
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Security',
        href: '/settings/security',
        icon: <Lock className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 1,
      },
      {
        name: 'Preferences',
        href: '/settings/preferences',
        icon: <Globe className="w-5 h-5" />,
        roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        order: 2,
      },
    ],
  },
];
