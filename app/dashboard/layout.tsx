import AuthCheckWrapper from '@/components/auth-check-wrapper'
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return <AuthCheckWrapper>{children}</AuthCheckWrapper>
}
