"use client"
import { RightArrow, UserSvg } from '@/public/svg'
import { useRouter } from 'next/navigation'
import PrimaryButton from '../button/primary-button'
import SecondaryButton from '../button/secondary-button'
import { useSession } from 'next-auth/react'

const NavbarHomeCta =  () => {
  const {status} = useSession();
  const router = useRouter();

  const renderButtons = () => {
    if (status === "loading") {
      return <SecondaryButton disabled className='cursor-not-allowed'>Loading...</SecondaryButton>;
    }

    if (status === "unauthenticated") {
      return (
        <>
          <SecondaryButton onClick={() => router.push("/auth/signin")} prefixIcon={<UserSvg className="size-5" />}>
            Log in
          </SecondaryButton>
          <PrimaryButton onClick={() => router.push('/auth/signup')} suffixIcon={<RightArrow />}>
            Get Started
          </PrimaryButton>
        </>
      );
    }

    return <PrimaryButton onClick={() => router.push("/dashboard")} prefixIcon={<UserSvg />}>Dashboard</PrimaryButton>;
  };

  return (
    <div className="w-fit flex max-xl:hidden items-center gap-4">
      {renderButtons()}
    </div>
  );
}

export default NavbarHomeCta
