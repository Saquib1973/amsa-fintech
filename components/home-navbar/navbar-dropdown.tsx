import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    <div
      ref={dropdownRef}
      id={activeItem}
      className="fixed left-1/2 -translate-x-1/2 bg-white border border-gray-200 z-50 min-w-[700px]"
      style={{
        top: navbarHeight,
      }}
    >
      <div className="flex">
        <div className="font-semibold min-h-[400px] min-w-[300px] text-lg bg-blue-50">
          <Image src="/images/logo.png" className='bg-gray-50 w-full h-full object-cover' alt="logo" width={100} height={100} />
        </div>
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
  )
}

export default NavbarDropdown
