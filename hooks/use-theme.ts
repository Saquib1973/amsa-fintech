"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/store."
import { setTheme } from "@/lib/store/features/theme/theme-slice"

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.theme)

  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    dispatch(setTheme(mode))
    localStorage.setItem("theme", mode)

    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      dispatch(setTheme(systemTheme))
      document.documentElement.classList.toggle('dark', systemTheme === 'dark')
    } else {
      document.documentElement.classList.toggle('dark', mode === 'dark')
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (savedTheme) {
      handleThemeChange(savedTheme)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [theme])

  return {
    theme,
    handleThemeChange,
    isDarkMode: theme === 'dark'
  }
}