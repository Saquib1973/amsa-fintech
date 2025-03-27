import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
interface MenuItem {
  title: string
  href?: string
  target?: string
  image?: string
  children?: MenuItem[]
}

interface NavbarDropdownProps {
  items: MenuItem[]
  isOpen: boolean
  onClose: () => void
  activeItem: string | null
  navbarHeight: number
  mainLinks: string[]
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
  items,
  isOpen,
  onClose,
  activeItem,
  navbarHeight,
  mainLinks,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.id === 'overlay') {
        onClose()
      } else if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !mainLinks.includes(dropdownRef.current.id)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, mainLinks])

  if (!isOpen || !activeItem) return null

  const activeMenuItem = items.find((item) => item.title === activeItem)

  if (!activeMenuItem) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-1/2 top-0 -translate-x-1/2 bg-white z-50 min-w-[700px]"
    >
      <motion.div
        ref={dropdownRef}
        id={activeItem}
        className="fixed left-1/2 -translate-x-1/2 bg-white z-50 min-w-[700px]"
        style={{
          top: navbarHeight,
        }}
      >
        {activeMenuItem.children && (
          <div className="flex">
            <div className="font-semibold min-h-[400px] min-w-[300px] text-lg bg-blue-50">
              <Image
                src={activeMenuItem.image || '/images/navbar-image.png'}
                className="bg-gray-50 w-full h-full object-cover"
                alt="logo"
                unoptimized
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="grid items-place-center gap-2">
                {activeMenuItem.children &&
                  activeMenuItem.children.length > 0 && (
                    <Link
                      href={activeMenuItem.children[0].href || '#'}
                      target={activeMenuItem.children[0].target}
                      className="bg-blue-400 flex justify-between hover:bg-blue-500 transition-colors text-white p-6 text-xl"
                      onClick={onClose}
                    >
                      {activeMenuItem.children[0].title}
                      <ChevronRight className="size-6" />
                    </Link>
                  )}
              </div>
              {activeMenuItem.children &&
                activeMenuItem.children.length > 1 && (
                  <div className="grid gap-2 py-4">
                    {activeMenuItem.children.slice(1).map((child, index) => (
                      <Link
                        key={index}
                        href={child.href || '#'}
                        target={child.target}
                        className="text-gray-600 hover:text-gray-900 transition-colors text-xl block px-3 rounded-md hover:underline"
                        onClick={onClose}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default NavbarDropdown
