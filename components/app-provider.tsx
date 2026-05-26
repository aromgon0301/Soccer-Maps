"use client"

import { useEffect, type ReactNode } from "react"
import { useThemeStore } from "@/lib/stores/theme-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const { initializeTheme } = useThemeStore()
  const { initializeLocale } = useI18nStore()

  useEffect(() => {
    initializeTheme()
    initializeLocale()
  }, [initializeTheme, initializeLocale])

  return <>{children}</>
}
