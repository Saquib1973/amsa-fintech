"use client"
import { RightArrow, UserSvg } from '@/public/svg'
import { useRouter } from 'next/navigation'
import PrimaryButton from '../button/primary-button'
import SecondaryButton from '../button/secondary-button'
import { useSession } from 'next-auth/react'
const NavbarHomeCta =  () => {
  const {data:session} = useSession();
  const router = useRouter();
  return (
    <div className="w-fit flex max-xl:hidden items-center gap-4">
      {session ? (
      <PrimaryButton onClick={() => router.push("/dashboard")} prefixIcon={<UserSvg />}>Dashboard</PrimaryButton>
      ) : (
          <>
           <SecondaryButton onClick={() => router.push("/auth/signin")} prefixIcon={<UserSvg className="size-5" />}>
        Log in
      </SecondaryButton>
        <PrimaryButton
          onClick={() => router.push('/auth/signup')}
          suffixIcon={<RightArrow />}
        >
          Get Started
        </PrimaryButton>
        </>
      )}
    </div>
  )
}

export default NavbarHomeCta
