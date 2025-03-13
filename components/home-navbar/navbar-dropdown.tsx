import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

interface MenuItem {
  title: string
  href?: string
  target?: string
  children?: MenuItem[]
}

interface NavbarDropdownProps {
  items: MenuItem[]
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  activeItem: string | null
  navbarHeight: number
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
  items,
  isOpen,
  onClose,
  position,
  activeItem,
  navbarHeight,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
  }, [isOpen, onClose])

  if (!isOpen || !activeItem) return null

  const activeMenuItem = items.find((item) => item.title === activeItem)

  if (!activeMenuItem) return null

  return (
    <>
      <div
        className="fixed bg-black/50 z-40"
        style={{
          top: navbarHeight,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={onClose}
      />

      <div
        ref={dropdownRef}
        className="fixed bg-white border border-gray-200 z-50 min-w-[700px]"
        style={{
          top: position.y - 6,
          left: position.x,
        }}
      >
        <div className="flex">
          <h3 className="font-semibold min-h-[400px] min-w-[300px] text-lg bg-blue-50">Image</h3>
          {activeMenuItem.children && (
            <div className="flex flex-col gap-2 w-full">
              <div className="bg-blue-400 text-white p-6 text-xl">
                Discover all {activeMenuItem.title}
              </div>
              <div className="grid gap-2 py-4">
                {activeMenuItem.children.map((child, index) => (
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
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NavbarDropdown
