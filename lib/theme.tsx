"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("soccer-maps-theme") as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light")
    setThemeState(initial)
    applyTheme(initial)
    setMounted(true)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    if (t === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  const setTheme = (t: Theme) => {
    setThemeState(t)
    applyTheme(t)
    localStorage.setItem("soccer-maps-theme", t)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
