"use client"

import Link from "next/link"
import { UserPlus, LogIn, Star, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useI18n } from "@/lib/i18n"

export function AuthBanner() {
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()

  if (isAuthenticated) return null

  return (
    <section className="py-3 sm:py-4 bg-accent/5 border-b border-accent/20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground text-xs sm:text-sm">{t("registerFree")}</span>
            <span className="hidden sm:flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs">{t("saveFavorites")}</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs">{t("checkIn")}</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs">{t("postCommunity")}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-8 text-xs sm:text-sm">
                <LogIn className="w-3.5 h-3.5 mr-1" />
                {t("login")}
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground h-8 text-xs sm:text-sm">
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                {t("createAccount")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
