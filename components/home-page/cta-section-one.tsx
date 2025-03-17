import PrimaryButton from '../button/primary-button'

const CtaSectionOne = () => {
  return (
    <div className="w-full h-full flex relative border border-gray-200 bg-white">
      <div className="flex max-md:flex-col gap-4 justify-between max-w-[1400px] p-10 md:p-24 mx-auto w-full">
        <h1 className="text-5xl md:text-6xl font-normal md:w-1/2 ">
          Trade 440+ cryptocurrencies
        </h1>
        <div className="flex flex-col items-start justify-center gap-2 md:w-1/2">
          <h1 className="md:text-lg font-light leading-5">
            Buy, sell, swap, track and analyse hundreds of cryptocurrencies on
            Australia’s most trusted crypto exchange
          </h1>
          <PrimaryButton className='mt-4'>View All Assets</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default CtaSectionOne
