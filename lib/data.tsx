interface MenuItem {
  title: string
  href?: string
  target?: string
  image?: string
  children?: MenuItem[]
  logo?: string
  content?: React.ReactNode
}
export const menuItems: MenuItem[] = [
  {
    title: 'Assets',
    image: '/images/navbar-image.png',
    children: [
      { title: 'Discover all assets', href: '/assets', logo: '' },
      { title: 'Bitcoin', href: '/assets/bitcoin', logo: 'BTC' },
      { title: 'Ethereum', href: '/assets/ethereum', logo: 'ETH' },
      { title: 'Solana', href: '/assets/solana', logo: 'SOL' },
      { title: 'Tether', href: '/assets/tether', logo: 'USDT' },
      { title: 'Ripple', href: '/assets/ripple', logo: 'XRP' },
    ],
  },
  {
    title: 'About',
    image: '/images/cta-two.png',
    children: [
      { title: 'About us', href: '/about-us' },
      { title: 'Blog', href: '/blog' },
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Terms of Service', href: '/tnc' },
    ],
  },
  {
    title: 'Resources',
    image: '/images/assets-search.png',
    children: [{ title: 'Learn & Earn', href: '/learn-earn' }],
    content: (
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Discover what crypto’s all about</h2>
        <p className="text-gray-600">
          We have created guides to help you get started and spark your interest
        </p>
      </div>
    ),
  },
]
