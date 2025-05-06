'use client'
import { RightArrow, UserSvg } from '@/public/svg'
import { useRouter } from 'next/navigation'
import PrimaryButton from '../button/primary-button'
import SecondaryButton from '../button/secondary-button'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

const NavbarHomeCta = () => {
  const { status } = useSession()
  const router = useRouter()

  const renderButtons = () => {
    if (status === 'loading') {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-4"
        >
          <SecondaryButton disabled className="cursor-not-allowed animate-pulse w-[120px] min-h-fit h-[46px]">
            {` `}
          </SecondaryButton>
          <PrimaryButton disabled className="cursor-not-allowed animate-pulse w-[164px] min-h-fit h-[48px]">
            {` `}
          </PrimaryButton>
        </motion.div>
      )
    }

    if (status === 'unauthenticated') {
      return (
        <motion.div
          key="unauthenticated"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-4"
        >
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
        </motion.div>
      )
    }

    return (
      <motion.div
        key="authenticated"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-4"
      >
        <PrimaryButton
          onClick={() => router.push('/dashboard')}
          prefixIcon={<UserSvg />}
        >
          Dashboard
        </PrimaryButton>
      </motion.div>
    )
  }

  return (
    <div className="w-fit flex max-xl:hidden items-center gap-4">
      <AnimatePresence mode="wait">
        {renderButtons()}
      </AnimatePresence>
    </div>
  )
}

export default NavbarHomeCta
