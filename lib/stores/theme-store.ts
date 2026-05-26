"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark" | "system"

interface ThemeState {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",

      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === "system" 
          ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
          : theme
        
        set({ theme, resolvedTheme })
        
        // Apply theme to document
        if (typeof window !== "undefined") {
          const root = document.documentElement
          root.classList.remove("light", "dark")
          root.classList.add(resolvedTheme)
        }
      },

      initializeTheme: () => {
        const { theme } = get()
        const resolvedTheme = theme === "system"
          ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
          : theme
        
        set({ resolvedTheme })
        
        // Apply theme to document
        if (typeof window !== "undefined") {
          const root = document.documentElement
          root.classList.remove("light", "dark")
          root.classList.add(resolvedTheme)
          
          // Listen for system theme changes
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
          const handleChange = (e: MediaQueryListEvent) => {
            const { theme } = get()
            if (theme === "system") {
              const newResolved = e.matches ? "dark" : "light"
              set({ resolvedTheme: newResolved })
              root.classList.remove("light", "dark")
              root.classList.add(newResolved)
            }
          }
          mediaQuery.addEventListener("change", handleChange)
        }
      },
    }),
    {
      name: "soccer-maps-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
