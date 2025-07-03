import Link from 'next/link'
import Image from 'next/image'
import SearchComponent from '@/components/ui/search-component'
import { useSession } from 'next-auth/react'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import { useRouter } from 'next/navigation'
import UserSvg from '@/public/svg/user-svg'
import RightArrow from '@/public/svg/right-arrow'

export default function DocsHeader() {
  const { status } = useSession()
  const router = useRouter()

  let authButtons = null
  if (status === 'loading') {
    authButtons = (
      <div className="flex items-center gap-4">
        <SecondaryButton
          disabled
          className="cursor-not-allowed animate-pulse w-[100px] min-h-fit h-[40px]"
        >{` `}</SecondaryButton>
        <PrimaryButton
          disabled
          className="cursor-not-allowed animate-pulse w-[120px] min-h-fit h-[40px]"
        >{` `}</PrimaryButton>
      </div>
    )
  } else if (status === 'unauthenticated') {
    authButtons = (
      <div className="flex items-center gap-4">
        <SecondaryButton
          onClick={() => router.push('/auth/signin')}
          prefixIcon={<UserSvg className="size-5" />}
        >
          Log in
        </SecondaryButton>
        <PrimaryButton
          onClick={() => router.push('/auth/signup')}
          suffixIcon={<RightArrow />}
        >
          Get Started
        </PrimaryButton>
      </div>
    )
  } else {
    authButtons = (
      <div className="flex items-center gap-4">
        <PrimaryButton
          onClick={() => router.push('/dashboard')}
          prefixIcon={<UserSvg />}
        >
          Dashboard
        </PrimaryButton>
      </div>
    )
  }

  return (
    <header className="z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-bold text-lg text-gray-900">Docs</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 ml-8">
            <Link
              href="/docs"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/docs/ui-patterns"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              UI Patterns
            </Link>
            <Link
              href="/docs/apis"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              APIs
            </Link>
          </nav>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          <SearchComponent />
          {authButtons}
        </div>
      </div>
    </header>
  )
}
