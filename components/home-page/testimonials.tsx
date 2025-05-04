import Image from 'next/image'
import React from 'react'

const testimonials = [
  {
    text: `AMSA has provided me with great services. Including my currency exchange problems.`,
    name: 'Alexa Young',
    title: 'VIC',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    text: `AMSA gave me amazing solutions which put a stop to the hardship my business and I were facing.`,
    name: 'Randall Jhons',
    title: 'NSW',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    text: `I recommend using AMSA because it has helped me navigate markets with ease.`,
    name: 'Claire Brooks',
    title: 'QLD',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    text: `The AMSA team is always responsive and professional. They made my international transfers seamless and stress-free.`,
    name: 'Michael Lee',
    title: 'WA',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    text: `I appreciate the transparency and low fees. AMSA is my go-to for all my business currency needs.`,
    name: 'Priya Patel',
    title: 'SA',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    text: `Switching to AMSA was the best decision for my small business. Their support is top-notch!`,
    name: 'Tom Nguyen',
    title: 'TAS',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
  },
  {
    text: `AMSA's platform is easy to use and their team is always ready to help. Highly recommended!`,
    name: 'Sophie Turner',
    title: 'ACT',
    avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
  },
  {
    text: `Fast, reliable, and secure. AMSA exceeded my expectations in every way.`,
    name: 'David Kim',
    title: 'NT',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
]

const Testimonials = () => {
  return (
    <section className="py-16 px-4 rounded-2xl">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-5xl mb-2">Proven track of satisfied clients</h2>
        <p className="text-lg text-gray-500">We cherish relations to blossom and last</p>
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-6xl mx-auto space-y-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-6 flex flex-col h-full border border-gray-100 mb-8 break-inside-avoid">
            <p className="text-gray-900 text-base mb-6">{t.text}</p>
            <div className="flex items-center mt-auto">
              <Image
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full mr-4 border-2 border-white shadow"
                width={40}
                height={40}
              />
              <div>
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials