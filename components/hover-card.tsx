"use client"
import React from 'react'
import { motion } from 'framer-motion'

interface HoverCardProps {
  title: string
  content: string | React.ReactNode
  actionButton?: string | React.ReactNode
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  onClick?: () => void
}

const HoverCard: React.FC<HoverCardProps> = ({
  title = "Dynamic",
  content = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem doloremque vitae minima.",
  actionButton = "LET'S GO",
  backgroundColor = "bg-white",
  textColor = "text-black",
  borderColor = "border-black",
  onClick
}) => {
  // Use React state only for hover tracking
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <section
      className="relative w-full min-w-[350px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={title + ' card'}
    >
      {/* Background layers for stacked effect */}
      <motion.div
        className={`absolute inset-0 border-2 ${borderColor} ${backgroundColor} z-0`}
        animate={isHovered ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        aria-hidden="true"
      />
      <motion.div
        className={`absolute inset-0 border-2 ${borderColor} ${backgroundColor} z-10`}
        animate={isHovered ? { x: -7, y: -7 } : { x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        aria-hidden="true"
      />
      {/* Main card */}
      <motion.article
        className={`group relative z-20 border-2 ${borderColor} ${backgroundColor} ${textColor} px-8 py-10 flex flex-col justify-between h-80 overflow-hidden`}
        tabIndex={0}
        animate={isHovered ? { x: -14, y: -14 } : { x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Circular text at top right, animated on hover */}
        <motion.div
          className="absolute"
          style={{ top: '-1.5rem', right: '-1.5rem' }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={isHovered ? { opacity: 1, rotate: 360 } : { opacity: 0, rotate: 0 }}
          transition={{ opacity: { duration: 0.3 }, rotate: { repeat: Infinity, duration: 6, ease: 'linear' } }}
          aria-hidden="true"
        >
          <svg width="90" height="90" viewBox="0 0 200 200">
            <path
              id="circlePath"
              d="M100,100 m-80,0 a80,80 0 1,0 160,0 a80,80 0 1,0 -160,0"
              fill="none"
            />
            <text>
              <textPath
                href="#circlePath"
                className="fill-black text-xl font-black uppercase"
                startOffset="0"
              >
                HOVER CARD • HOVER CARD • HOVER CARD • HOVER CARD • HOVER CARD • HOVER CARD •
              </textPath>
            </text>
          </svg>
        </motion.div>
        <header className="flex flex-col flex-1 justify-center">
          <h2 className="flex items-center text-2xl font-bold uppercase mb-4">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="-ml-8 mr-2 opacity-0 transition-all duration-300 ease-in-out group-hover:ml-0 group-hover:opacity-100"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            {title}
          </h2>
          <div className="mb-8 text-base font-normal leading-relaxed">
            {content}
          </div>
        </header>
        <button
          className={`w-full border-2 outline-none ${borderColor} bg-white ${textColor} py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-black hover:text-white font-semibold mt-auto`}
          type="button"
          onClick={onClick}
        >
          {actionButton}
        </button>
      </motion.article>
    </section>
  )
}

export default HoverCard
