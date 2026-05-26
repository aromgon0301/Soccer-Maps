"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Monitor, Globe, Check } from "lucide-react"
import { useThemeStore, type Theme } from "@/lib/stores/theme-store"
import { useI18nStore, type Locale } from "@/lib/stores/i18n-store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useThemeStore()
  const { t } = useI18nStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use default labels during SSR to prevent hydration mismatch
  const ssrSafeLabel = mounted ? t("theme.title") : "Theme"

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: mounted ? t("theme.light") : "Light" },
    { value: "dark", icon: Moon, label: mounted ? t("theme.dark") : "Dark" },
    { value: "system", icon: Monitor, label: mounted ? t("theme.system") : "System" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">{ssrSafeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{ssrSafeLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(({ value, icon: Icon, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="cursor-pointer"
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
            {theme === value && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18nStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use default labels during SSR to prevent hydration mismatch
  const ssrSafeLabel = mounted ? t("lang.title") : "Language"

  const languages: { value: Locale; flag: string; label: string }[] = [
    { value: "es", flag: "ES", label: mounted ? t("lang.spanish") : "Spanish" },
    { value: "en", flag: "EN", label: mounted ? t("lang.english") : "English" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">{ssrSafeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{ssrSafeLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map(({ value, flag, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setLocale(value)}
            className="cursor-pointer"
          >
            <span className="mr-2 text-xs font-bold bg-muted px-1.5 py-0.5 rounded">
              {flag}
            </span>
            {label}
            {locale === value && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SettingsControls() {
  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      <LanguageToggle />
    </div>
  )
}
