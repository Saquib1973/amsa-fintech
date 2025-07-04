import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const footerLinks = {
    company: [
      { href: '/about-us', label: 'About us' },
      { href: '/blog', label: 'Blog' },
    ],
    platform: [
      { href: '/features', label: 'Features' },
      { href: '/fees', label: 'Fees' },
      { href: '/networks', label: 'Network fees' },
    ],
    learn: [
      { href: '/learn-earn', label: 'Learning Center' },
      { href: '/courses', label: 'Courses' },
      { href: '/guides', label: 'Guides' },
    ],
    support: [
      { href: '/help', label: 'Help Center' },
      { href: '/docs', label: "API's" },
    ],

    more: [
      { href: '/terms-of-use', label: 'Terms of Use' },
      { href: '/support', label: 'Support' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/tnc', label: 'Terms and Conditions' },
    ],
    assets: [
      { href: '/assets', label: 'All Assets' },
      { href: '/assets/bitcoin', label: 'Buy Bitcoins' },
      { href: '/assets/ethereum', label: 'Buy Ethereum' },
      { href: '/assets/solana', label: 'Buy Solana' },
    ],
  }

  return (
    <footer className="">
      <div className="width-1600 flex gap-4  py-10 md:py-16">
        <div className="flex max-md:flex-col md:justify-between w-full px-6 gap-6">
          <div className=" flex flex-col max-w-[300px]">
            <Link href="/" className="mb-5">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width="176"
                height="43"
                priority
              />
            </Link>

            <p className="text-sm text-gray-500 mb-4">
              Unit 2, 27 Browning Street, South Brisbane Queensland 4101,
              Australia
            </p>
          </div>

          <div className="grid grid-cols-2 w-full lg:grid-cols-4 gap-4">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} className="">
                <h3 className="text-primary-main text-base md:text-2xl mb-4 capitalize">
                  {section}
                </h3>
                <ul>
                  {links.map((link) => (
                    <li key={link.href} className="font-light text-sm md:text-lg mb-1">
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="" />

      <div className="width-1240 px-4 text-gray-500 text-sm md:text-lg mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 py-4 md:py-6">
        <div className="copyright">
          © {new Date().getFullYear()} AMSA Fintech and IT solutions - All
          Rights Reserved.
        </div>
        <nav className="global-links footer-links">
          <ul className="global-footer-menu flex gap-4">
            <li>
              <Link href="/terms">Terms of Use</Link>
            </li>
            <li>
              <Link href="/sitemap.xml">Sitemap</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
