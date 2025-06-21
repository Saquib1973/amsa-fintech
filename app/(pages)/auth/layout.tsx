import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GoBackButton from '../../../components/button/go-back-button'
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (session) {
    redirect('/')
  }
  return (
    <>
      <GoBackButton className="m-2 xl:ml-[30%]" redirect="/" />
      {children}
    </>
  )
}
