import { UserRole } from '@/lib/dashboard-data'
import React from 'react'

export interface NavItem {
  name: string
  href?: string
  icon: React.ReactNode
  roles?: UserRole[]
  order?: number
  hasSubmenu?: boolean
  submenuItems?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
  roles?: UserRole[]
}

export interface NavLinkProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
  isCollapsed?: boolean
}

export interface MainMenuProps {
  navSections: NavSection[]
  userRole: UserRole
  isItemActive: (href?: string) => boolean
  handleNavItemClick: () => void
  handleSubmenuChange: (item: NavItem | null) => void
  isTransitioning: boolean
  setIsTransitioning: (value: boolean) => void
}

export interface SubMenuProps {
  activeSubmenu: NavItem | null
  isItemActive: (href?: string) => boolean
  handleNavItemClick: () => void
  handleSubmenuChange: (item: NavItem | null) => void
  isTransitioning: boolean
  setIsTransitioning: (value: boolean) => void
}

export interface CollapsedNavigationProps {
  activeSubmenu: NavItem | null
  filteredNavItems: NavItem[]
  isItemActive: (href?: string) => boolean
  handleNavItemClick: () => void
  handleSubmenuChange: (item: NavItem | null) => void
}

export interface NavigationContentProps {
  loading: boolean
  isCollapsed: boolean
  filteredNavItems: NavItem[]
  navSections: NavSection[]
  userRole: UserRole
  isItemActive: (href?: string) => boolean
  handleNavItemClick: () => void
}

export interface HeaderProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export interface LogoutButtonProps {
  isCollapsed: boolean
  handleSignOut: () => Promise<void>
}