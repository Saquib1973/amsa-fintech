import DashboardNavbar from '@/components/dashboard/dashboard-navbar'
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar'
import AuthCheckWrapper from '@/components/wrapper/auth-check-wrapper'

export default function ProtectedUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthCheckWrapper>
      <div className="bg-white w-full dark:bg-black flex flex-col lg:flex-row h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <DashboardNavbar />
          {children}
        </main>
      </div>
    </AuthCheckWrapper>
  )
}
