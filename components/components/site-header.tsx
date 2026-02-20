"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, BarChart3, Crown, LogIn, LogOut, UserPlus } from "lucide-react"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { useAuthStore } from "@/lib/stores/auth-store"
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

export function SiteHeader({ backHref, backLabel, subtitle = "La Liga", showNav = false }: SiteHeaderProps) {
  const { subscription } = useSubscriptionStore()
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const isPremium = subscription && subscription.status === "active" && subscription.plan !== "free"

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-2 hover:text-accent transition-colors text-primary-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{backLabel || "Volver"}</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 relative flex-shrink-0">
                <Image
                  src="/logo-soccer-maps.png"
                  alt="Soccer Maps Logo"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight group-hover:text-accent transition-colors font-sans">
                  Soccer Maps
                </h1>
                <p className="text-sm text-primary-foreground/80">{subtitle}</p>
              </div>
            </Link>
          )}

          {/* Right side */}
          {backHref ? (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="/logo-soccer-maps.png"
                  alt="Soccer Maps Logo"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold group-hover:text-accent transition-colors font-sans">
                  Soccer Maps
                </h1>
                <p className="text-xs text-primary-foreground/80">{subtitle}</p>
              </div>
            </Link>
          ) : showNav ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/premium"
                className="flex items-center gap-1.5 hover:text-accent transition-colors text-primary-foreground"
              >
                <Crown className={`w-5 h-5 ${isPremium ? "text-amber-400" : ""}`} />
                <span className="hidden sm:inline text-sm">Premium</span>
                {isPremium && (
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 text-xs">
                    {subscription?.plan?.toUpperCase()}
                  </Badge>
                )}
              </Link>
              <Link
                href="/comparator"
                className="flex items-center gap-1.5 hover:text-accent transition-colors text-primary-foreground"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Comparador</span>
              </Link>

              {/* Auth-aware section */}
              {isAuthenticated && currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:text-accent transition-colors focus:outline-none">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
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
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/premium" className="cursor-pointer">
                        <Crown className="w-4 h-4 mr-2" />
                        Suscripcion
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
                    >
                      <LogIn className="w-4 h-4 mr-1.5" />
                      <span className="hidden sm:inline">Entrar</span>
                    </Button>
                  </Link>
                  <Link href="/registro">
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <UserPlus className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Registro</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
