"use client"
import { RightArrow, UserSvg } from '@/public/svg'
import { useRouter } from 'next/navigation'
import PrimaryButton from '../button/primary-button'
import SecondaryButton from '../button/secondary-button'
const NavbarHomeCta = () => {
  const router = useRouter();
  return (
    <div className="w-fit flex max-xl:hidden items-center gap-4">
      <SecondaryButton onClick={() => router.push("/auth/signin")} prefixIcon={<UserSvg className="size-5" />}>
        Log in
      </SecondaryButton>
      <PrimaryButton onClick={() => router.push("/auth/signup")} suffixIcon={<RightArrow />}>Get Started</PrimaryButton>
    </div>
  )
}

export default NavbarHomeCta
