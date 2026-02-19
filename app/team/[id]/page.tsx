import { notFound } from "next/navigation"
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

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)

  if (!team) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader backHref="/" backLabel="Volver a equipos" />

      {/* Hero Section with Team Info */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
            <div className="w-32 h-32 md:w-48 md:h-48 relative flex-shrink-0 bg-background/10 rounded-2xl p-6">
              <Image src={team.badge || "/placeholder.svg"} alt={team.name} fill className="object-contain p-4" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-3">{team.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {team.colors.map((color, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-accent text-accent-foreground">
                    {color}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-primary-foreground/10 rounded-lg p-3">
                  <Calendar className="w-5 h-5 mb-1 mx-auto md:mx-0" />
                  <div className="text-2xl font-bold">{team.founded}</div>
                  <div className="text-xs text-primary-foreground/70">Fundado</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-3">
                  <Building2 className="w-5 h-5 mb-1 mx-auto md:mx-0" />
                  <div className="text-2xl font-bold">{team.stadium.capacity.toLocaleString()}</div>
                  <div className="text-xs text-primary-foreground/70">Capacidad</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-3">
                  <MapPin className="w-5 h-5 mb-1 mx-auto md:mx-0" />
                  <div className="text-lg font-bold">{team.stadium.distanceToCenter}</div>
                  <div className="text-xs text-primary-foreground/70">Del centro</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-3">
                  <Users className="w-5 h-5 mb-1 mx-auto md:mx-0" />
                  <div className="text-lg font-bold">{team.region}</div>
                  <div className="text-xs text-primary-foreground/70">Región</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-8">
            <Link href={`/planner/${id}`}>
              <div className="bg-accent text-accent-foreground rounded-lg p-6 hover:bg-accent/90 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Planifica tu Día de Partido</h3>
                    <p className="text-sm text-accent-foreground/90">
                      Guía paso a paso personalizada para tu visita al {team.stadium.name}
                    </p>
                  </div>
                  <div className="bg-accent-foreground/10 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <Tabs defaultValue="club" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="club">Club</TabsTrigger>
              <TabsTrigger value="city">Ciudad</TabsTrigger>
              <TabsTrigger value="stadium">Estadio</TabsTrigger>
              <TabsTrigger value="reservas">Reservas</TabsTrigger>
              <TabsTrigger value="visitante">Visitante</TabsTrigger>
              <TabsTrigger value="matchday">Día Partido</TabsTrigger>
              <TabsTrigger value="community">Comunidad</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            {/* Club Tab */}
            <TabsContent value="club">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">Historia del Club</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{team.history}</p>
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-semibold mb-3">Datos del Club</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Nombre completo:</dt>
                          <dd className="font-medium">{team.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Apodo:</dt>
                          <dd className="font-medium">{team.shortName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Fundación:</dt>
                          <dd className="font-medium">{team.founded}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Colores:</dt>
                          <dd className="font-medium">{team.colors.join(", ")}</dd>
                        </div>
                      </dl>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">Estadio {team.stadium.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden relative">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt={team.stadium.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <dt className="text-muted-foreground mb-1">Capacidad</dt>
                          <dd className="font-semibold">{team.stadium.capacity.toLocaleString()} espectadores</dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <dt className="text-muted-foreground mb-1">Ubicación</dt>
                          <dd className="font-semibold">
                            {team.city}, {team.region}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <dt className="text-muted-foreground mb-1">Distancia al centro</dt>
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
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">Sobre {team.city}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">{team.cityInfo.description}</p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">Clima</h4>
                          <p className="text-sm text-muted-foreground">{team.cityInfo.climate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">Distancia del estadio al centro</h4>
                          <p className="text-sm text-muted-foreground">{team.stadium.distanceToCenter}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">Zonas Recomendadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Las mejores zonas para aficionados en {team.city}
                    </p>
                    <ul className="space-y-3">
                      {team.cityInfo.recommendedAreas.map((area, idx) => (
                        <li key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-accent-foreground font-bold text-sm">{idx + 1}</span>
                          </div>
                          <span className="font-medium">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stadium Tab */}
            <TabsContent value="stadium">
              <StadiumMap team={team} />
            </TabsContent>

            {/* Reservas Tab */}
            <TabsContent value="reservas">
              <ReservationsSystem team={team} />
            </TabsContent>

            {/* Visitante Tab */}
            <TabsContent value="visitante">
              <VisitorMode team={team} />
            </TabsContent>

            {/* Match Day Tab */}
            <TabsContent value="matchday">
              <MatchDayInfo team={team} />
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community">
              <CommunitySection team={team} />
            </TabsContent>

            {/* Premium Tab */}
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
