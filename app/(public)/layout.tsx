import NavbarHome from '@/components/home-navbar/navbar-home'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-50">
        <NavbarHome />
      </div>
      {children}
    </div>
  )
}
