'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
  symbol?: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const CurrencyDropdown = ({ options, value, onChange, className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={`inline-flex items-center justify-between w-full rounded-md border border-gray-200 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            {selectedOption?.symbol && (
              <span className="text-gray-500">{selectedOption.symbol}</span>
            )}
            {selectedOption?.label || 'Select option'}
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option.value}
                className={`${
                  value === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                role="menuitem"
              >
                {option.symbol && (
                  <span className="text-gray-500">{option.symbol}</span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencyDropdown