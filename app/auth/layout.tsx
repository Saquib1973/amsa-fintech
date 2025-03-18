import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from "lucide-react"
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (session) {
    redirect('/')

  }
  return <>
    <div className='absolute top-0 left-0 w-full border-b b-200'>
      <Link href="/" className='flex items-center p-6 w-fit bg-gray-100 border-r b-200 hover:text-black text-gray-600 hover:bg-gray-300 transition-all gap-2'>
        <ArrowLeft className='w-6 h-6' />
        Home
      </Link>
    </div>
    {children}</>
}
