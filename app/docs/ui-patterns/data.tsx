'use client'
import React, { useState } from 'react'
import type { UIComponent } from './types'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import Modal from '@/components/ui/modal-component'

const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <PrimaryButton onClick={() => setIsOpen(true)}>Open Modal</PrimaryButton>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a sample modal content. The modal includes a title, close
            button, and animated transitions.
          </p>
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setIsOpen(false)}>
              Close
            </SecondaryButton>
            <PrimaryButton>Confirm</PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export const uiComponents: UIComponent[] = [
  {
    id: 'buttons',
    title: 'Buttons',
    description: 'Primary and secondary variants',
    category: 'Basic',
    content: (
      <div className="flex gap-4">
        <PrimaryButton>Primary Button</PrimaryButton>
        <SecondaryButton>Secondary Button</SecondaryButton>
        <SecondaryButton
          className="bg-red-400 text-white"
          onClick={() => alert('clicked')}
        >
          Click me
        </SecondaryButton>
      </div>
    ),
    usage: `import PrimaryButton from '@/components/button/primary-button';
import SecondaryButton from '@/components/button/secondary-button';

// Primary Button
<PrimaryButton>
  Click me
</PrimaryButton>

// Secondary Button
<SecondaryButton>
  Click me
</SecondaryButton>

// Custom Button with onClick handler
<SecondaryButton className='bg-red-400 text-white' onClick={() => alert('clicked')}>
  Click me
</SecondaryButton>`,
  },
  {
    id: 'input-fields',
    title: 'Input Fields',
    description: 'Input fields',
    category: 'Input',
    content: (
        <input
          type="email"
          className="input-field"
          placeholder="Enter your email"
        />
    ),
    usage: `// Basic input field
<input type="email" className="input-field" placeholder="Enter your email" />
`,
  },
  {
    id: 'modals',
    title: 'Modals',
    description: 'Dialog boxes and popups with animations',
    category: 'Overlay',
    content: <ModalExample />,
    usage: `import Modal from '@/components/ui/modal-component';
import { useState } from 'react';

// Basic usage
const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
      >
        <div>
          <p>Modal content goes here</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsOpen(false)}>Close</button>
            <button>Confirm</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};`,
  },
]
