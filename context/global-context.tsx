'use client'
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

interface ThemeState {
  mode: 'light' | 'dark' | 'system'
  loading: boolean
}

interface ThemeContextType {
  theme: ThemeState
  setTheme: (mode: 'light' | 'dark' | 'system') => void
  toggleTheme: (mode: 'light' | 'dark' | 'system') => void
}

const GlobalContext = createContext<ThemeContextType | undefined>(undefined)

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'light',
    loading: false,
  })

  const setTheme = useCallback((mode: 'light' | 'dark' | 'system') => {
    setThemeState((prev) => ({
      ...prev,
      mode,
    }))
    localStorage.setItem('theme', mode)

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', systemTheme === 'dark')
    } else {
      document.documentElement.classList.toggle('dark', mode === 'dark')
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (themeState.mode === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeState.mode])

  function toggleTheme(mode: 'light' | 'dark' | 'system') {
    setTheme(mode)
  }

  const contextValue = useMemo(() => ({
    theme: themeState,
    setTheme,
    toggleTheme
  }), [themeState, setTheme, toggleTheme])

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error(
      'useGlobalContext must be used within a GlobalContextProvider'
    )
  }
  return context
}
