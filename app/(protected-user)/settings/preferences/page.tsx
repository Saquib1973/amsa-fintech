'use client'

import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import {
  Monitor,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

export default function PreferencesPage() {
  const { theme, handleThemeChange } = useTheme()
  const mode = typeof theme === 'string' ? theme : theme;
  return (
    <AnimateWrapper>
      <div className="min-h-screen bg-white text-black dark:text-white dark:bg-black">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <h1 className="text-4xl font-light">Preferences</h1>
              <p className="text-xl text-gray-500 mt-2 font-light">
                Customize your account settings
              </p>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="py-6 md:py-16">
          <div className="space-y-12">
            <div className="rounded-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sun className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-light">Appearance</h2>
              </div>

              <div className="max-w-3xl">
                <div className="mb-6">
                  <p className="block text-sm font-medium text-gray-700 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      className={`flex flex-col items-center justify-center p-4 border rounded-md ${
                        mode === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-800'
                          : 'border-gray-300 dark:border-gray-800'
                      }`}
                      onClick={() => handleThemeChange('light')}
                    >
                      <Sun className={`w-8 h-8 mb-2 ${mode === 'light' ? 'text-blue-500' : 'text-gray-500'}`} />
                      <span className={`text-sm ${mode === 'light' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                        Light
                      </span>
                    </button>

                    <button
                      className={`flex flex-col items-center justify-center p-4 border rounded-md ${
                        mode === 'dark'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-800'
                          : 'border-gray-300 dark:border-gray-800'
                      }`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <Moon className={`w-8 h-8 mb-2 ${mode === 'dark' ? 'text-blue-500' : 'text-gray-500'}`} />
                      <span className={`text-sm ${mode === 'dark' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                        Dark
                      </span>
                    </button>

                    <button
                      className={`flex flex-col items-center justify-center p-4 border rounded-md ${
                        mode === 'system'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-800'
                          : 'border-gray-300 dark:border-gray-800'
                      }`}
                      onClick={() => handleThemeChange('system')}
                    >
                      <Monitor className={`w-8 h-8 mb-2 ${mode === 'system' ? 'text-blue-500' : 'text-gray-500'}`} />
                      <span className={`text-sm ${mode === 'system' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                        System
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}