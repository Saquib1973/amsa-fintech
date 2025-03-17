import React, { useEffect, useRef } from 'react'
import SecondaryButton from './button/secondary-button'
const Modal = ({ message,closeModal,onSubmit }: { message: string,closeModal: () => void,onSubmit: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [closeModal])
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div ref={ref} className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <div className='flex gap-2 mt-8'>

        <SecondaryButton className='max-w-fit' onClick={closeModal}>
          Close
        </SecondaryButton>
          <SecondaryButton className='max-w-fit bg-green-500 text-white border-green-800' onClick={() => {
            onSubmit()
        }}>
          Submit
        </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default Modal