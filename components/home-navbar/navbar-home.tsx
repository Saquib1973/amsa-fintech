'use client'
import { DownSmallArrow } from '@/public/svg'
import Link from 'next/link'
import NavbarHomeCta from './navbar-home-cta'
import MobileNavbar from './mobile-navbar'
import NavbarDropdown from './navbar-dropdown'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { menuItems } from '@/lib/data'

const NavbarHome = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [navbarHeight, setNavbarHeight] = useState(0)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const navbarRef = useRef<HTMLDivElement>(null)
  const mainLinks = menuItems.map((item) => item.title)

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
    setActiveDropdown(itemTitle)
  }

  return (
    <AnimatePresence>
    <div
      className="w-full py-3 md:py-5 max-xl:px-4 px-6 bg-white border border-gray-200 flex-1 relative"
      ref={navbarRef}
    >
      <div className="w-full xl:max-w-[1400px] text-lg mx-auto flex items-center justify-between xl:justify-around">
        <Link
          href={'/'}
          className="text-4xl tracking-tighter text-center flex flex-col items-center"
          onClick={() => setActiveDropdown(null)}
        >
          AMSA
          <span className="text-sm font-normal tracking-normal">
            Fintech and IT Solutions
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-10">
          {menuItems.map((item) => (
            <div key={item.title} id={item.title} className="relative">
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
          <Link href="/support" className="" onClick={() => setActiveDropdown(null)}>
            Support
          </Link>
          <Link href="/support#faqs" className="" onClick={() => setActiveDropdown(null)}>
            FAQs
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
      <div className='relative'>
        {activeDropdown !== null && (
          <div
            id="overlay"
            className="fixed bg-black/60 z-40 inset-0"
            style={{
              top: navbarHeight,
            }}
          />
        )}
        <NavbarDropdown
          mainLinks={mainLinks}
          items={menuItems}
          isOpen={activeDropdown !== null}
          onClose={() => setActiveDropdown(null)}
          activeItem={activeDropdown}
          navbarHeight={navbarHeight}
        />
      </div>
    </div>
    </AnimatePresence>
  )
}

export default NavbarHome
