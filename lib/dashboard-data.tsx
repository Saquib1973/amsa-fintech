import { CreditCard, User, Settings, Lock, Globe, Home, Coins } from 'lucide-react';


export const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: <Coins className="w-5 h-5" />,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: <User className="w-5 h-5" />,
  },
  {
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    hasSubmenu: true,
    submenuItems: [
      {
        name: 'Security',
        href: '/settings/security',
        icon: <Lock className="w-5 h-5" />,
      },
      {
        name: 'Preferences',
        href: '/settings/preferences',
        icon: <Globe className="w-5 h-5" />,
      },
    ],
  },
]
