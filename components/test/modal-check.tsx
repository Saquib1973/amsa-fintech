'use client'
import React, { useState } from 'react'
import Modal from '../modal'
import SecondaryButton from '../button/secondary-button'
import AnimateWrapper from '../wrapper/animate-wrapper'
const ModalCheck = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {isOpen && (
        <AnimateWrapper>
        <Modal
          message="Are you sure you want to delete this item?"
          closeModal={() => setIsOpen(false)}
          onSubmit={() => {
            alert('submitted')
          }}
        />
        </AnimateWrapper>
      )}
      <SecondaryButton onClick={() => setIsOpen(true)}>Open Modal</SecondaryButton>
    </div>
  )
}

export default ModalCheck