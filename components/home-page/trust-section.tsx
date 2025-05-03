import React from 'react'

const TrustSection = () => {
  const trustItems = [
    {
      title: 'AUSTRAC',
      description: 'Registered crypto exchange',
    },
    {
      title: 'Australian',
      description: 'Owned and operated',
    },
    {
      title: '440+',
      description: 'Assets for trading',
    },
    {
      title: '4.5/5',
      description: 'Rating on TrustPilot',
    },
  ]
  return (
    <div className="w-full h-full relative py-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div className="text-center" key={item.title}>
              <h3 className="text-3xl sm:text-5xl leading-tighter font-extralight">
                {item.title}
              </h3>
              <p className="text-base sm:text-lg text-primary-main font-extralight">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustSection
