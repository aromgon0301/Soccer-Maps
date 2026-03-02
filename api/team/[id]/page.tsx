"use client"

import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, Users, Building2 } from "lucide-react"
import { getTeamById } from "@/lib/teams-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StadiumMap } from "@/components/stadium-map"
import { MatchDayInfo } from "@/components/match-day-info"
import { PremiumSection } from "@/components/premium-section"
import { CommunitySection } from "@/components/community-section"
import { ReservationsSystem } from "@/components/reservations-system"
import { VisitorMode } from "@/components/visitor-mode"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useI18n } from "@/lib/i18n"

export default function TeamPage() {
  const params = useParams()
  const id = params.id as string
  const { t } = useI18n()
  const team = getTeamById(id)

  if (!team) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader backHref="/" backLabel={t("backToTeams")} />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative flex-shrink-0 bg-background/10 rounded-2xl p-4">
              <Image src={team.badge || "/placeholder.svg"} alt={team.name} fill className="object-contain p-2 sm:p-3 md:p-4" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2 sm:mb-3">
                {team.name}
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start mb-3 sm:mb-4">
                {team.colors.map((color, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-accent text-accent-foreground text-xs">
                    {color}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 sm:mt-6">
                <div className="bg-primary-foreground/10 rounded-lg p-2 sm:p-3">
                  <Calendar className="w-4 h-4 mb-1 mx-auto sm:mx-0" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{team.founded}</div>
                  <div className="text-[10px] sm:text-xs text-primary-foreground/70">{t("founded")}</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2 sm:p-3">
                  <Building2 className="w-4 h-4 mb-1 mx-auto sm:mx-0" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{team.stadium.capacity.toLocaleString()}</div>
                  <div className="text-[10px] sm:text-xs text-primary-foreground/70">{t("capacity")}</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2 sm:p-3">
                  <MapPin className="w-4 h-4 mb-1 mx-auto sm:mx-0" />
                  <div className="text-sm sm:text-base md:text-lg font-bold">{team.stadium.distanceToCenter}</div>
                  <div className="text-[10px] sm:text-xs text-primary-foreground/70">{t("fromCenter")}</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2 sm:p-3">
                  <Users className="w-4 h-4 mb-1 mx-auto sm:mx-0" />
                  <div className="text-sm sm:text-base md:text-lg font-bold">{team.region}</div>
                  <div className="text-[10px] sm:text-xs text-primary-foreground/70">{t("region")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-12 flex-1">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Plan Match Day Banner */}
          <div className="max-w-6xl mx-auto mb-6 sm:mb-8">
            <Link href={`/planner/${id}`}>
              <div className="bg-accent text-accent-foreground rounded-lg p-4 sm:p-5 sm:p-6 hover:bg-accent/90 transition-all cursor-pointer group">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-0.5 sm:mb-1">{t("planMatchDay")}</h3>
                    <p className="text-xs sm:text-sm text-accent-foreground/90 line-clamp-2">
                      {t("planMatchDayDesc")} {team.stadium.name}
                    </p>
                  </div>
                  <div className="bg-accent-foreground/10 rounded-full p-2 sm:p-3 group-hover:scale-110 transition-transform shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <Tabs defaultValue="club" className="max-w-6xl mx-auto">
            {/* Scrollable tabs on mobile */}
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 mb-6 sm:mb-8">
              <TabsList className="flex w-max min-w-full sm:grid sm:w-full sm:grid-cols-4 lg:grid-cols-8 gap-0">
                <TabsTrigger value="club" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("clubTab")}</TabsTrigger>
                <TabsTrigger value="city" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("cityTab")}</TabsTrigger>
                <TabsTrigger value="stadium" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("stadiumTab")}</TabsTrigger>
                <TabsTrigger value="reservas" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("reservationsTab")}</TabsTrigger>
                <TabsTrigger value="visitante" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("visitorTab")}</TabsTrigger>
                <TabsTrigger value="matchday" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("matchdayTab")}</TabsTrigger>
                <TabsTrigger value="community" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("communityTab")}</TabsTrigger>
                <TabsTrigger value="premium" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("premiumTab")}</TabsTrigger>
              </TabsList>
            </div>

            {/* Club Tab */}
            <TabsContent value="club">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="font-display text-base sm:text-lg">Historia del Club</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{team.history}</p>
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                      <h4 className="font-semibold mb-2 sm:mb-3 text-sm">Datos del Club</h4>
                      <dl className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground shrink-0">Nombre completo:</dt>
                          <dd className="font-medium text-right">{team.name}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground shrink-0">Apodo:</dt>
                          <dd className="font-medium text-right">{team.shortName}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground shrink-0">Fundacion:</dt>
                          <dd className="font-medium text-right">{team.founded}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground shrink-0">Colores:</dt>
                          <dd className="font-medium text-right">{team.colors.join(", ")}</dd>
                        </div>
                      </dl>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="font-display text-base sm:text-lg">Estadio {team.stadium.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg mb-3 sm:mb-4 overflow-hidden relative">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt={team.stadium.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <dl className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <dt className="text-muted-foreground mb-0.5">Capacidad</dt>
                          <dd className="font-semibold">{team.stadium.capacity.toLocaleString()} espectadores</dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <dt className="text-muted-foreground mb-0.5">Ubicacion</dt>
                          <dd className="font-semibold">{team.city}, {team.region}</dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <dt className="text-muted-foreground mb-0.5">Distancia al centro</dt>
                          <dd className="font-semibold">{team.stadium.distanceToCenter}</dd>
                        </div>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* City Tab */}
            <TabsContent value="city">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="font-display text-base sm:text-lg">Sobre {team.city}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">{team.cityInfo.description}</p>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1 text-sm">Clima</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{team.cityInfo.climate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1 text-sm">Distancia del estadio al centro</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{team.stadium.distanceToCenter}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="font-display text-base sm:text-lg">Zonas Recomendadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Las mejores zonas para aficionados en {team.city}
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {team.cityInfo.recommendedAreas.map((area, idx) => (
                        <li key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted rounded-lg">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-accent-foreground font-bold text-xs">{idx + 1}</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stadium">
              <StadiumMap team={team} />
            </TabsContent>

            <TabsContent value="reservas">
              <ReservationsSystem team={team} />
            </TabsContent>

            <TabsContent value="visitante">
              <VisitorMode team={team} />
            </TabsContent>

            <TabsContent value="matchday">
              <MatchDayInfo team={team} />
            </TabsContent>

            <TabsContent value="community">
              <CommunitySection team={team} />
            </TabsContent>

            <TabsContent value="premium">
              <PremiumSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
