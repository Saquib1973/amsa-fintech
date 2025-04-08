'use client'

import { useGlobalContext } from '@/context/global-context'

export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useGlobalContext()

  return {
    theme,
    setTheme,
    toggleTheme,
    isDarkMode: theme.mode === 'dark'
  }
}