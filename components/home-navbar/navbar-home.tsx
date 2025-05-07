'use client'
import { DownSmallArrow } from '@/public/svg'
import Link from 'next/link'
import NavbarHomeCta from './navbar-home-cta'
import MobileNavbar from './mobile-navbar'
import NavbarDropdown from './navbar-dropdown'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { menuItems } from '@/lib/data'
import Image from 'next/image'

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full py-2 md:py-4 max-xl:px-4 px-6 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 dark:text-white flex-1 relative"
      ref={navbarRef}
    >
      <div className="w-full xl:max-w-[1400px] text-lg mx-auto flex items-center justify-between xl:justify-around">
        <motion.div
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link
            href={'/'}
            className="text-3xl flex-col text-center font-light flex items-center"
            onClick={() => setActiveDropdown(null)}
          >
            <span className="flex w-full md:items-center md:justify-center">
              <Image
                src={'/images/logo.png'}
                alt="logo"
                width={30}
                height={30}
              />
              {/* <span className="text-primary-main font-bold ">A</span> */}
              <span className='max-md:hidden'>
                MSA
              </span>
            </span>
            <span className="text-xs font-normal tracking-normal">
              Fintech and IT Solutions
            </span>
          </Link>
        </motion.div>

        <div className="hidden xl:flex items-center gap-10">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div id={item.title} className="relative">
                <button
                  ref={(el) => {
                    buttonRefs.current[item.title] = el
                  }}
                  onClick={() => handleDropdownClick(item.title)}
                  className={`flex items-center gap-1 justify-center cursor-pointer ${
                    activeDropdown === item.title ? 'text-blue-600' : ''
                  }`}
                >
                  {item.title}
                  <motion.span
                    animate={{ rotate: activeDropdown === item.title ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DownSmallArrow className="size-5" />
                  </motion.span>
                </button>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: menuItems.length * 0.05 }}
          >
            <Link
              href="/support"
              className=""
              onClick={() => setActiveDropdown(null)}
            >
              Support
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (menuItems.length + 1) * 0.05 }}
          >
            <Link
              href="/support#faqs"
              className=""
              onClick={() => setActiveDropdown(null)}
            >
              FAQs
            </Link>
          </motion.div>
        </div>

        <div className="hidden xl:block">
          <NavbarHomeCta />
        </div>

        <div className="xl:hidden flex items-center">
          <NavbarHomeCta />
          <MobileNavbar />
        </div>
      </div>
      <div className="relative">
        <AnimatePresence>
          {activeDropdown !== null && (
            <motion.div
              id="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-black/60 z-40 inset-0"
              style={{
                top: navbarHeight,
              }}
            />
          )}
        </AnimatePresence>
        <NavbarDropdown
          mainLinks={mainLinks}
          items={menuItems}
          isOpen={activeDropdown !== null}
          onClose={() => setActiveDropdown(null)}
          activeItem={activeDropdown}
          navbarHeight={navbarHeight}
        />
      </div>
    </motion.div>
  )
}

export default NavbarHome
