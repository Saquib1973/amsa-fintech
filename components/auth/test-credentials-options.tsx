import React, { useState } from 'react'
import { ChevronRight, User, Shield } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion';

interface TestCredentialsOptionsProps {
  onSelectCredentials: (credentials: { email: string; password: string }) => void
}

const TestCredentialsOptions = ({ onSelectCredentials }: TestCredentialsOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const testCredentials = {
    normalUser: {
      email: 'testuser@gmail.com',
      password: 'testuser',
      role: 'Normal User',
      description: 'Regular user access with standard permissions'
    },
    superAdmin: {
      email: 'super@admin.com',
      password: 'amsa@2025',
      role: 'Super Admin',
      description: 'Full system access with administrative privileges'
    }
  }

  const handleCredentialSelect = (credentials: { email: string; password: string }) => {
    onSelectCredentials(credentials)
  }
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-sm cursor-pointer"
      >
        Use test credentials
        <ChevronRight className={`size-4 transition-transform duration-200 ${isOpen ? '-rotate-90' : ''}`} />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <React.Fragment>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -8 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 bottom-[28px] rounded-lg left-0 bg-white shadow-lg min-w-[400px] border border-gray-100 duration-200"
            >
              <div className="p-4">
              <h3 className="text-xl font-light  mb-4">Test Credentials</h3>
              <div className="space-y-3">
                <button
                    onClick={(e) => {
                      handleToggle(e)
                    handleCredentialSelect(testCredentials.normalUser)
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 hover:border-primary-main/20 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <User className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="">{testCredentials.normalUser.role}</div>
                      <div className="text-sm text-gray-600 mt-1">{testCredentials.normalUser.email}</div>
                      <div className="text-xs text-gray-500 mt-1">{testCredentials.normalUser.description}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    handleToggle(e)
                    handleCredentialSelect(testCredentials.superAdmin)
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 hover:border-primary-main/20 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <Shield className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="">{testCredentials.superAdmin.role}</div>
                      <div className="text-sm text-gray-600 mt-1">{testCredentials.superAdmin.email}</div>
                      <div className="text-xs text-gray-500 mt-1">{testCredentials.superAdmin.description}</div>
                    </div>
                  </div>
                </button>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  These credentials are for testing purposes only. Select an option to auto-fill the login form.
                </p>
              </div>
            </div>
          </motion.div>
          <button
            className="fixed inset-0 h-screen w-screen bg-black/5 animate-in fade-in duration-200"
            onClick={(e) => {
              e.preventDefault()
              handleToggle(e)
            }}
          />
        </React.Fragment>
        )}
        </AnimatePresence>
    </div>
  )
}

export default TestCredentialsOptions
