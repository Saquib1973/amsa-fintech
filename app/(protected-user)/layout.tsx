import DashboardSidebar from '@/components/dashboard/dashboard-sidebar'
import AuthCheckWrapper from '@/components/wrapper/auth-check-wrapper'

export default function ProtectedUserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheckWrapper>
      <div className="bg-white dark:bg-black flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </AuthCheckWrapper>
  )
}
