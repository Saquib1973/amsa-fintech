"use client"
import { DownSmallArrow } from '@/public/svg'
import Link from 'next/link'
import NavbarHomeCta from './navbar-home-cta'
import MobileNavbar from './mobile-navbar'
import NavbarDropdown from './navbar-dropdown'
import { useState, useRef, useEffect } from 'react'

const menuItems = [
  {
    title: 'Assets',
    children: [
      { title: 'Discover all assets', href: '/au/buy/' },
      { title: 'Bitcoin', href: '/au/buy/bitcoin/' },
      { title: 'Ethereum', href: '/au/buy/ethereum/' },
      { title: 'Solana', href: '/au/buy/solana/' },
      { title: 'USDT', href: '/au/buy/usd-tether/' },
    ],
  },
  {
    title: 'Resources',
    children: [
      { title: 'Learn & Earn', href: '#', target: '_blank' },
      { title: 'Research & analysis', href: '#', target: '_blank' },
    ],
  },
  {
    title: 'About',
    children: [
      { title: 'About us', href: '#', target: '_blank' },
      { title: 'Blog', href: '#', target: '_blank' },
      { title: 'Fees', href: '#', target: '_blank' },
      { title: 'Security', href: '#', target: '_blank' },
    ],
  },
]

const NavbarHome = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
  const [navbarHeight, setNavbarHeight] = useState(0)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const navbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.getBoundingClientRect().height)
      }
    }

    updateNavbarHeight()
    window.addEventListener('resize', updateNavbarHeight)

    return () => {
      window.removeEventListener('resize', updateNavbarHeight)
    }
  }, [])

  const handleDropdownClick = (itemTitle: string) => {
    const button = buttonRefs.current[itemTitle]
    const navbar = navbarRef.current
    if (button && navbar) {
      const rect = button.getBoundingClientRect()
      const navbarRect = navbar.getBoundingClientRect()
      setDropdownPosition({
        x: rect.left,
        y: navbarRect.bottom + 5,
      })
      setActiveDropdown(itemTitle)
    }
  }

  return (
    <div className="w-full py-6 max-xl:px-4 px-6 bg-white border border-gray-200 flex-1 relative" ref={navbarRef}>
      <div className="w-full xl:max-w-[1400px] text-lg mx-auto flex items-center justify-between xl:justify-around">
        <Link
          href={'/'}
          className="text-3xl tracking-tighter font-bold text-center flex flex-col items-center"
        >
          AMSA<span className="text-sm font-normal tracking-normal">
            Fintech and IT Solutions
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-10">
          {menuItems.map((item) => (
            <div key={item.title} className="relative">
              <button
                ref={(el) => {
                  buttonRefs.current[item.title] = el
                }}
                onClick={() => handleDropdownClick(item.title)}
                className={`flex items-center gap-1 justify-center cursor-pointer ${
                  activeDropdown === item.title ? 'text-blue-600' : ''
                }`}
              >
                {item.title} <DownSmallArrow className="size-5" />
              </button>
            </div>
          ))}
          <Link href="/support" className="">
            Support
          </Link>
        </div>

        <div className="hidden xl:block">
          <NavbarHomeCta />
        </div>

        <div className="xl:hidden flex items-center">
          <NavbarHomeCta />
          <MobileNavbar />
        </div>
      </div>

      <NavbarDropdown
        items={menuItems}
        isOpen={activeDropdown !== null}
        onClose={() => setActiveDropdown(null)}
        position={dropdownPosition}
        activeItem={activeDropdown}
        navbarHeight={navbarHeight}
      />
    </div>
  )
}

export default NavbarHome
