import AvailableAssetsClient from '@/components/assets/available-assets-client'
import TransakPopularClient from '@/components/assets/transak-popular-client'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Assets | AMSA Fintech and IT solutions',
  description:
    'A comprehensive list of crypto assets you can buy, sell, and swap directly within our platform, presented with real-time prices in Australian dollars (AUD).',
  keywords: 'assets, crypto, trading, AMSA Fintech and IT solutions',
}


export default async function AvailableAssetsPage() {

  return (
    <div className="bg-gradient-to-b from-white dark:from-gray-950 via-blue-50 dark:via-gray-900 to-white dark:to-gray-950">
      <AnimateWrapper>
        <SectionWrapper>
        <div className="flex max-md:flex-col-reverse gap-4 justify-between items-center">
          <div className="md:w-1/2 flex flex-col gap-6">
            <h1 className="text-5xl font-light text-gray-900 dark:text-white">
              All crypto assets for
              <span className="italic block">trading</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-300 font-light">
              Below is a comprehensive list of crypto assets you can buy, sell,
              and swap directly within our platform, presented with real-time
              prices in Australian dollars (AUD). You can also access exclusive
              insights into top traded assets on Swyftx and top moving
              cryptocurrencies based on their AUD price.
            </p>
            <div className="mt-2" />
          </div>
          <div className="md:w-1/2 flex items-center justify-center">
            <Image
              src="/images/assets-search.png"
              alt="assets"
              width={350}
              height={350}
            />
          </div>
        </div>

        <div className="my-10 max-lg:flex-col flex gap-6 justify-between">
          <div className="w-full bg-white py-4 flex flex-col gap-4">
            <h2 className="text-3xl font-light px-4 text-gray-900">
              Available crypto assets
            </h2>
            <AvailableAssetsClient />
          </div>

          <div className="w-full lg:w-1/3 gap-6 h-full flex flex-col items-stretch justify-start">
            <TransakPopularClient />
          </div>
        </div>
        </SectionWrapper>
      </AnimateWrapper>
    </div>
  )
}
