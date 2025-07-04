import SearchCoins from '@/components/assets/search-coins'
import TrendingCoins from '@/components/assets/trending-coins'
import CtaSectionTwo from '@/components/home-page/cta-section-two'
import AssetsTable from '@/components/table/assets-table'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import Image from 'next/image'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assets | AMSA Fintech and IT solutions',
  description: 'A comprehensive list of crypto assets you can buy, sell, and swap directly within our platform, presented with real-time prices in Australian dollars (AUD).',
  keywords: 'assets, crypto, trading, AMSA Fintech and IT solutions',
}

const AssetsPage = () => {
  return (
    <AnimateWrapper>
      <div className="bg-gradient-to-b from-white dark:from-gray-950 via-blue-50 dark:via-gray-900 to-white dark:to-gray-950">
        <SectionWrapper>
          <div className="flex max-md:flex-col-reverse gap-4 justify-between items-center">
            <div className="md:w-1/2 flex flex-col gap-10">
              <h1 className="text-6xl font-light text-gray-900 dark:text-white">
                All crypto assets for
                <span className="italic block">trading</span>
              </h1>
              <p className="text-gray-700 dark:text-gray-300 font-light">
                Below is a comprehensive list of crypto assets you can buy,
                sell, and swap directly within our platform, presented with
                real-time prices in Australian dollars (AUD). You can also
                access exclusive insights into top traded assets on Swyftx and
                top moving cryptocurrencies based on their AUD price.
              </p>
              <Suspense fallback={<div>Loading...</div>}>
                <SearchCoins />
              </Suspense>
            </div>
            <div className="md:w-1/2 flex items-center justify-center">
              <Image
                src="/images/assets-search.png"
                alt="help"
                width={350}
                height={350}
              />
            </div>
          </div>

          <div className="md:my-20 my-10 max-lg:flex-col flex gap-6 justify-between">
            <AssetsTable />
            <TrendingCoins />
          </div>
        </SectionWrapper>
        <CtaSectionTwo />
      </div>
    </AnimateWrapper>
  )
}

export default AssetsPage
