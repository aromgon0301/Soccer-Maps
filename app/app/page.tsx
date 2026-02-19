import Link from "next/link"
import { Search, MapPin, User, BarChart3, Crown } from "lucide-react"
import { teams } from "@/lib/teams-data"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GlobalCommunity } from "@/components/global-community"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SiteHeader showNav />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 relative mx-auto mb-4">
              <Image
                src="/logo-soccer-maps.png"
                alt="Soccer Maps Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-balance">
              Explora los estadios de La Liga
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/90 mb-6 leading-relaxed text-pretty">
              Información completa, mapas interactivos y comunidad de aficionados.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por equipo o ciudad..."
                  className="w-full pl-12 pr-4 py-5 text-base bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-3">
            <Link href="/comparator">
              <div className="bg-background border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-0.5 group-hover:text-accent transition-colors">
                      Comparar Estadios
                    </h3>
                    <p className="text-xs text-muted-foreground">Compara hasta 3 estadios</p>
                  </div>
                  <div className="bg-accent/10 rounded-full p-2.5 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/profile">
              <div className="bg-background border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-0.5 group-hover:text-accent transition-colors">Mi Perfil</h3>
                    <p className="text-xs text-muted-foreground">Visitas, insignias y progreso</p>
                  </div>
                  <div className="bg-accent/10 rounded-full p-2.5 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/premium">
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg p-4 hover:border-amber-500 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-0.5 group-hover:text-amber-600 transition-colors">Premium</h3>
                    <p className="text-xs text-muted-foreground">Desbloquea todas las funciones</p>
                  </div>
                  <div className="bg-amber-500/20 rounded-full p-2.5 group-hover:scale-110 transition-transform">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content - Two columns on desktop */}
      <section className="py-8 md:py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Teams Grid - 2 columns */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-xl font-display font-bold mb-1">Selecciona tu equipo</h3>
                <p className="text-sm text-muted-foreground">Los 20 equipos de LaLiga</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {teams.map((team) => (
                  <Link key={team.id} href={`/team/${team.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-accent overflow-hidden">
                      <div className="p-4 flex flex-col items-center text-center gap-2">
                        <div className="w-14 h-14 md:w-16 md:h-16 relative">
                          <Image
                            src={team.badge || "/placeholder.svg"}
                            alt={`${team.name} escudo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xs md:text-sm mb-0.5 group-hover:text-accent transition-colors line-clamp-1">
                            {team.shortName}
                          </h4>
                          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {team.city}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Feed - 1 column */}
            <div className="lg:col-span-1">
              <GlobalCommunity />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
