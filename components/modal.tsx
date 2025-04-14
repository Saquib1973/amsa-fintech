'use client'
import React, { useEffect, useRef } from 'react'
import SecondaryButton from './button/secondary-button'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({
  message,
  closeModal,
  onSubmit,
}: {
  message: string | React.ReactNode
  closeModal: () => void
  onSubmit: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeModal()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeModal])
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          ref={ref}
          className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg"
        >
          <div className="text-2xl font-bold mb-4">
            {typeof message === 'string' ? message : message}
          </div>
          <div className="flex gap-2 mt-8">
            <SecondaryButton className="max-w-fit" onClick={closeModal}>
              Close
            </SecondaryButton>
            <SecondaryButton
              className="max-w-fit bg-green-500 text-white border-green-800"
              onClick={() => {
                onSubmit()
                closeModal()
              }}
            >
              Submit
            </SecondaryButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Modal
