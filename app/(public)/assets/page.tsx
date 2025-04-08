import AssetsTable from '@/components/table/assets-table'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Image from 'next/image'
import CtaSectionTwo from '@/components/home-page/cta-section-two'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import TrendingCoins from '@/components/assets/trending-coins'
import SearchCoins from '@/components/assets/search-coins'
const AssetsPage = () => {
  return (
    <AnimateWrapper>
      <div className="bg-gradient-to-b from-white via-blue-50 to-white">
        <SectionWrapper>
          <div className="flex max-md:flex-col-reverse gap-4 justify-between items-center">
            <div className="md:w-1/2 flex flex-col gap-10">
              <h1 className="text-6xl font-light text-gray-900">
                All crypto assets for
                <span className="italic block">trading</span>
              </h1>
              <p className="text-gray-700 font-light">
                Below is a comprehensive list of crypto assets you can buy,
                sell, and swap directly within our platform, presented with
                real-time prices in Australian dollars (AUD). You can also
                access exclusive insights into top traded assets on Swyftx and
                top moving cryptocurrencies based on their AUD price.
              </p>
              <SearchCoins />
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

          <div className="md:my-20 my-10 max-md:flex-col flex gap-6 justify-between">
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
