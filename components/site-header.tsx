"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  BarChart3,
  Crown,
  LogIn,
  LogOut,
  UserPlus,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useTheme } from "@/lib/theme"
import { useI18n } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SiteHeaderProps {
  backHref?: string
  backLabel?: string
  subtitle?: string
  showNav?: boolean
}

export function SiteHeader({ backHref, backLabel, subtitle, showNav = false }: SiteHeaderProps) {
  const { subscription } = useSubscriptionStore()
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isPremium = subscription && subscription.status === "active" && subscription.plan !== "free"
  const resolvedSubtitle = subtitle ?? t("laLiga")
  const resolvedBackLabel = backLabel ?? t("back")

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push("/")
  }

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left side - Back button or Logo */}
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 hover:text-accent transition-colors text-primary-foreground shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">{resolvedBackLabel}</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 relative flex-shrink-0">
                <Image
                  src="/logo-soccer-maps.png"
                  alt="Soccer Maps Logo"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight group-hover:text-accent transition-colors font-sans leading-none">
                  {t("soccerMaps")}
                </h1>
                <p className="text-[10px] sm:text-xs text-primary-foreground/80 leading-none mt-0.5">
                  {resolvedSubtitle}
                </p>
              </div>
            </Link>
          )}

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {backHref && (
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <div className="w-9 h-9 relative flex-shrink-0">
                  <Image
                    src="/logo-soccer-maps.png"
                    alt="Soccer Maps Logo"
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold group-hover:text-accent transition-colors font-sans">
                    {t("soccerMaps")}
                  </p>
                  <p className="text-[10px] text-primary-foreground/80">{resolvedSubtitle}</p>
                </div>
              </Link>
            )}

            {showNav && (
              <>
                <Link
                  href="/premium"
                  className="flex items-center gap-1 hover:text-accent transition-colors text-primary-foreground"
                >
                  <Crown className={`w-4 h-4 ${isPremium ? "text-amber-400" : ""}`} />
                  <span className="text-sm">{t("premium")}</span>
                  {isPremium && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 text-xs hidden lg:flex">
                      {subscription?.plan?.toUpperCase()}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/comparator"
                  className="flex items-center gap-1 hover:text-accent transition-colors text-primary-foreground"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">{t("comparator")}</span>
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors"
              aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">{language}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => setLanguage("es")}
                  className={language === "es" ? "font-semibold text-accent" : ""}
                >
                  {t("spanish")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "font-semibold text-accent" : ""}
                >
                  {t("english")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {showNav && (
              isAuthenticated && currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 hover:text-accent transition-colors focus:outline-none">
                      <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium max-w-[80px] truncate hidden lg:block">
                        {currentUser.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        {t("myProfile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/premium" className="cursor-pointer">
                        <Crown className="w-4 h-4 mr-2" />
                        {t("subscription")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10 h-8 px-2"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/registro">
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground h-8 px-2"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-1">
            {/* Theme toggle - always visible on mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
              aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pt-2 border-t border-primary-foreground/20 space-y-1">
            {showNav && (
              <>
                <Link
                  href="/premium"
                  className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Crown className={`w-4 h-4 ${isPremium ? "text-amber-400" : ""}`} />
                  <span className="text-sm">{t("premium")}</span>
                </Link>
                <Link
                  href="/comparator"
                  className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">{t("comparator")}</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{t("myProfile")}</span>
                </Link>
              </>
            )}

            {/* Language switcher in mobile menu */}
            <div className="flex items-center gap-2 py-2 px-2">
              <Globe className="w-4 h-4 shrink-0" />
              <span className="text-sm">{t("language")}:</span>
              <button
                onClick={() => { setLanguage("es"); setMobileMenuOpen(false) }}
                className={`text-sm px-2 py-0.5 rounded ${language === "es" ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"}`}
              >
                ES
              </button>
              <button
                onClick={() => { setLanguage("en"); setMobileMenuOpen(false) }}
                className={`text-sm px-2 py-0.5 rounded ${language === "en" ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"}`}
              >
                EN
              </button>
            </div>

            {/* Auth in mobile menu */}
            {showNav && (
              isAuthenticated && currentUser ? (
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-sm text-primary-foreground/70">
                    {currentUser.name} · {currentUser.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-2 px-2 rounded-md hover:bg-primary-foreground/10 transition-colors text-left text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">{t("logout")}</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
                    >
                      <LogIn className="w-4 h-4 mr-1.5" />
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/registro" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <UserPlus className="w-4 h-4 mr-1.5" />
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </header>
  )
}
