'use client'
import React, { useState } from 'react'
import type { UIComponent } from './types'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import Modal from '@/components/ui/modal-component'
import { ColorSwatch } from '@/components/ui/color-swatch'

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
  {
    id: 'color-scheme',
    title: 'Color Scheme',
    category: 'Foundation',
    description: 'A comprehensive overview of the color palette used throughout the application.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Primary Colors</h3>
          <div className="space-y-2">
            <ColorSwatch name="Primary Main" color="var(--color-primary-main)" />
            <ColorSwatch name="Primary Main Hover" color="var(--color-primary-main-hover)" />
            <ColorSwatch name="Primary Main Dark" color="var(--color-primary-main-dark)" />
            <ColorSwatch name="Primary Main Dark Hover" color="var(--color-primary-main-dark-hover)" />
          </div>
        </div>

        {/* Primary Alt Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Primary Alt Colors</h3>
          <div className="space-y-2">
            <ColorSwatch name="Primary Alt" color="var(--color-primary-alt)" />
            <ColorSwatch name="Primary Alt Hover" color="var(--color-primary-alt-hover)" />
            <ColorSwatch name="Primary Alt Dark" color="var(--color-primary-alt-dark)" />
            <ColorSwatch name="Primary Alt Dark Hover" color="var(--color-primary-alt-dark-hover)" />
          </div>
        </div>

        {/* Accent Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Accent Colors</h3>
          <div className="space-y-2">
            <ColorSwatch name="Accent Main" color="var(--color-accent-main)" />
            <ColorSwatch name="Accent Hover" color="var(--color-accent-hover)" />
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Neutral Colors</h3>
          <div className="space-y-2">
            <ColorSwatch name="Black" color="var(--color-black)" />
            <ColorSwatch name="Black Hover" color="var(--color-black-hover)" />
            <ColorSwatch name="White" color="var(--color-white)" />
            <ColorSwatch name="White Hover" color="var(--color-white-hover)" />
          </div>
        </div>

        {/* Surface Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Surface Colors</h3>
          <div className="space-y-2">
            <ColorSwatch name="Surface Main" color="var(--color-surface-main)" />
            <ColorSwatch name="Surface Alt" color="var(--color-surface-alt)" />
            <ColorSwatch name="Surface Hover" color="var(--color-surface-hover)" />
          </div>
        </div>

        {/* Special Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Special Colors</h3>
          <div className="space-y-2">
            <ColorSwatch name="Off White" color="var(--color-off-white)" />
          </div>
        </div>
      </div>
    ),
    usage: `// Color Swatch Component
const ColorSwatch = ({ name, color }: { name: string; color: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-12 h-12 rounded-lg border border-gray-200"
      style={{ backgroundColor: color }}
    />
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{color}</p>
    </div>
  </div>
);`
  },
]
