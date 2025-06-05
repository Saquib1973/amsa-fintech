'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DashboardSidebarLoadingSkeleton } from './loading-skeleton'
import { MainMenu, SubMenu, CollapsedNavigation } from './navigation'
import { NavigationContentProps, NavItem } from './types'

export const NavigationContent = ({
  loading,
  isCollapsed,
  filteredNavItems,
  navSections,
  userRole,
  isItemActive,
  handleNavItemClick
}: NavigationContentProps) => {
  const pathname = usePathname()
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const findSubmenu = () => {
      for (const section of navSections) {
        for (const item of section.items) {
          if (item.hasSubmenu && item.submenuItems) {
            const hasActiveSubmenu = item.submenuItems.some(subItem =>
              pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
            )
            if (hasActiveSubmenu) {
              return item
            }
          }
        }
      }
      return null
    }
    const newSubmenu = findSubmenu()
    if (newSubmenu !== activeSubmenu) {
      setIsTransitioning(true)
    }
    setActiveSubmenu(newSubmenu)
  }, [pathname, navSections])

  const handleSubmenuChange = (item: NavItem | null) => {
    setIsTransitioning(true)
    setActiveSubmenu(item)
  }

  if (loading) {
    return <DashboardSidebarLoadingSkeleton isCollapsed={isCollapsed} />
  }

  if (isCollapsed) {
    return (
      <CollapsedNavigation
        activeSubmenu={activeSubmenu}
        filteredNavItems={filteredNavItems}
        isItemActive={isItemActive}
        handleNavItemClick={handleNavItemClick}
        handleSubmenuChange={handleSubmenuChange}
      />
    )
  }

  return (
    <AnimatePresence mode="wait">
      {activeSubmenu ? (
        <SubMenu
          key="submenu"
          activeSubmenu={activeSubmenu}
          isItemActive={isItemActive}
          handleNavItemClick={handleNavItemClick}
          handleSubmenuChange={handleSubmenuChange}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
        />
      ) : (
        <MainMenu
          key="main"
          navSections={navSections}
          userRole={userRole}
          isItemActive={isItemActive}
          handleNavItemClick={handleNavItemClick}
          handleSubmenuChange={handleSubmenuChange}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
        />
      )}
    </AnimatePresence>
  )
}