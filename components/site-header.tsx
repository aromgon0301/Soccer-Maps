"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, User, BarChart3, Crown } from "lucide-react"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { Badge } from "@/components/ui/badge"

interface SiteHeaderProps {
  backHref?: string
  backLabel?: string
  subtitle?: string
  showNav?: boolean
}

export function SiteHeader({ backHref, backLabel, subtitle = "La Liga", showNav = false }: SiteHeaderProps) {
  const { subscription } = useSubscriptionStore()
  const isPremium = subscription && subscription.status === "active" && subscription.plan !== "free"

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
                <h1 className="text-2xl font-display font-bold tracking-tight group-hover:text-accent transition-colors">
                  Soccer Maps
                </h1>
                <p className="text-sm text-primary-foreground/80">{subtitle}</p>
              </div>
            </Link>
          )}

          {/* Right side - Logo (when back button shown) or Navigation */}
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
                <h1 className="text-xl font-display font-bold group-hover:text-accent transition-colors">
                  Soccer Maps
                </h1>
                <p className="text-xs text-primary-foreground/80">{subtitle}</p>
              </div>
            </Link>
          ) : showNav ? (
            <div className="flex items-center gap-3">
              <Link
                href="/premium"
                className="flex items-center gap-2 hover:text-accent transition-colors text-primary-foreground"
              >
                <Crown className={`w-5 h-5 ${isPremium ? "text-amber-400" : ""}`} />
                <span className="hidden sm:inline">Premium</span>
                {isPremium && (
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 text-xs">
                    {subscription?.plan?.toUpperCase()}
                  </Badge>
                )}
              </Link>
              <Link
                href="/comparator"
                className="flex items-center gap-2 hover:text-accent transition-colors text-primary-foreground"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Comparador</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:text-accent transition-colors text-primary-foreground"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Mi Perfil</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
