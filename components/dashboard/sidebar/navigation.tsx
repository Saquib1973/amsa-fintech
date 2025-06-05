'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { NavLink } from './nav-link'
import { CollapsedNavigationProps, MainMenuProps, SubMenuProps } from './types'

export const MainMenu = ({
  navSections,
  userRole,
  isItemActive,
  handleNavItemClick,
  handleSubmenuChange,
  isTransitioning,
  setIsTransitioning
}: MainMenuProps) => (
  <motion.div
    initial={isTransitioning ? { opacity: 0, x: -10 } : undefined}
    animate={{ opacity: 1, x: 0 }}
    exit={isTransitioning ? { opacity: 0, x: 10 } : undefined}
    transition={{ duration: 0.2 }}
    onAnimationComplete={() => setIsTransitioning(false)}
  >
    {navSections
      .filter((section) => !section.roles || section.roles.includes(userRole))
      .map((section) => (
        <div key={section.title} className="mb-4">
          <div className="px-8 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {section.title}
          </div>
          <div className="w-full">
            {section.items
              .filter((item) => !item.roles || item.roles.includes(userRole))
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((item) => (
                <NavLink
                  key={item.name}
                  item={item}
                  isActive={isItemActive(item.href)}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      handleSubmenuChange(item)
                    } else {
                      handleNavItemClick()
                    }
                  }}
                />
              ))}
          </div>
        </div>
      ))}
  </motion.div>
)

export const SubMenu = ({
  activeSubmenu,
  isItemActive,
  handleNavItemClick,
  handleSubmenuChange,
  isTransitioning,
  setIsTransitioning
}: SubMenuProps) => (
  <motion.div
    initial={isTransitioning ? { opacity: 0, x: -10 } : undefined}
    animate={{ opacity: 1, x: 0 }}
    exit={isTransitioning ? { opacity: 0, x: 10 } : undefined}
    transition={{ duration: 0.2 }}
    onAnimationComplete={() => setIsTransitioning(false)}
    className="flex flex-col h-full"
  >
    <button
      onClick={() => handleSubmenuChange(null)}
      className="flex cursor-pointer items-center gap-2 px-8 py-4 text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back to Menu</span>
    </button>
    <div className="flex-1">
      {activeSubmenu?.submenuItems?.map((item) => (
        <NavLink
          key={item.name}
          item={item}
          isActive={isItemActive(item.href)}
          onClick={handleNavItemClick}
        />
      ))}
    </div>
  </motion.div>
)

export const CollapsedNavigation = ({
  activeSubmenu,
  filteredNavItems,
  isItemActive,
  handleNavItemClick,
  handleSubmenuChange
}: CollapsedNavigationProps) => (
  <div className="flex flex-col items-center">
    {activeSubmenu ? (
      <>
        <button
          onClick={() => handleSubmenuChange(null)}
          className="flex items-center justify-center w-full py-4 text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
          title="Back to Menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {activeSubmenu.submenuItems?.map((item) => (
          <NavLink
            key={item.name}
            item={item}
            isActive={isItemActive(item.href)}
            onClick={handleNavItemClick}
            isCollapsed={true}
          />
        ))}
      </>
    ) : (
      filteredNavItems.map((item) => (
        <NavLink
          key={item.name}
          item={item}
          isActive={isItemActive(item.href)}
          onClick={() => {
            if (item.hasSubmenu) {
              handleSubmenuChange(item)
            } else {
              handleNavItemClick()
            }
          }}
          isCollapsed={true}
        />
      ))
    )}
  </div>
)