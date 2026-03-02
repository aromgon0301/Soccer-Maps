"use client"

import Link from "next/link"
import { Search, MapPin, User, BarChart3, Crown, UserPlus } from "lucide-react"
import { teams } from "@/lib/teams-data"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GlobalCommunity } from "@/components/global-community"
import { AuthBanner } from "@/components/auth-banner"
import { useI18n } from "@/lib/i18n"

function HomeContent() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader showNav />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-8 sm:py-10 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative mx-auto mb-3 sm:mb-4">
              <Image
                src="/logo-soccer-maps.png"
                alt="Soccer Maps Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-3 sm:mb-4 text-balance">
              {t("exploreStadiums")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 mb-5 sm:mb-6 leading-relaxed text-pretty px-2">
              {t("heroSubtitle")}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto px-2 sm:px-0">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 text-sm sm:text-base bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-4 sm:py-6 bg-muted/30">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-2 sm:gap-3">
            <Link href="/comparator">
              <div className="bg-background border border-border rounded-lg p-2.5 sm:p-4 hover:border-accent hover:shadow-md transition-all group cursor-pointer h-full">
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xs sm:text-base font-bold sm:mb-0.5 group-hover:text-accent transition-colors leading-tight">
                      {t("compareStadiums")}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{t("compareSubtitle")}</p>
                  </div>
                  <div className="bg-accent/10 rounded-full p-1.5 sm:p-2.5 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-background border border-border rounded-lg p-2.5 sm:p-4 hover:border-accent hover:shadow-md transition-all group cursor-pointer h-full">
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xs sm:text-base font-bold sm:mb-0.5 group-hover:text-accent transition-colors leading-tight">
                      {t("myProfileTitle")}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{t("profileSubtitle")}</p>
                  </div>
                  <div className="bg-accent/10 rounded-full p-1.5 sm:p-2.5 group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/premium">
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg p-2.5 sm:p-4 hover:border-amber-500 hover:shadow-md transition-all group cursor-pointer h-full">
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xs sm:text-base font-bold sm:mb-0.5 group-hover:text-amber-600 transition-colors leading-tight">
                      {t("premiumTitle")}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{t("premiumSubtitle")}</p>
                  </div>
                  <div className="bg-amber-500/20 rounded-full p-1.5 sm:p-2.5 group-hover:scale-110 transition-transform">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Banner */}
      <AuthBanner />

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-12 flex-1">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Teams Grid */}
            <div className="lg:col-span-2">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-display font-bold mb-0.5">{t("selectTeam")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{t("laLigaTeams")}</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-3">
                {teams.map((team) => (
                  <Link key={team.id} href={`/team/${team.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-accent overflow-hidden">
                      <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center text-center gap-1.5 sm:gap-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 relative">
                          <Image
                            src={team.badge || "/placeholder.svg"}
                            alt={`${team.name} escudo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-[10px] sm:text-xs md:text-sm mb-0.5 group-hover:text-accent transition-colors line-clamp-1">
                            {team.shortName}
                          </h4>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                            <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            {team.city}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Feed */}
            <div className="lg:col-span-1">
              <GlobalCommunity />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default function HomePage() {
  return <HomeContent />
}
