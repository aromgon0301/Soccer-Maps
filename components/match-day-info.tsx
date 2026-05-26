"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Navigation2,
  MapPin,
  Car,
  Bus,
  Train,
  Calendar,
  CloudSun,
  Thermometer,
  Wind,
  Share2,
  Heart,
  Info,
  Shield,
  DoorOpen,
  Timer,
  ChevronRight,
  Star,
  Phone,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Team } from "@/lib/teams-data"

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  competition: string
  stadium: string
  isHome: boolean
}

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  wind: number
  icon: string
}

export function MatchDayInfo({ team }: { team: Team }) {
  const [savedMatches, setSavedMatches] = useState<string[]>([])
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Mock upcoming matches
  const upcomingMatches: Match[] = [
    {
      id: "1",
      homeTeam: team.name,
      awayTeam: "Real Madrid CF",
      date: "2026-06-01",
      time: "21:00",
      competition: "La Liga",
      stadium: team.stadium.name,
      isHome: true,
    },
    {
      id: "2",
      homeTeam: "FC Barcelona",
      awayTeam: team.name,
      date: "2026-06-08",
      time: "18:30",
      competition: "La Liga",
      stadium: "Estadi Olímpic Lluís Companys",
      isHome: false,
    },
    {
      id: "3",
      homeTeam: team.name,
      awayTeam: "Sevilla FC",
      date: "2026-06-15",
      time: "20:00",
      competition: "La Liga",
      stadium: team.stadium.name,
      isHome: true,
    },
  ]

  // Mock weather data
  const weather: WeatherData = {
    temperature: 22,
    condition: "Parcialmente nublado",
    humidity: 45,
    wind: 12,
    icon: "partly-cloudy",
  }

  // Countdown effect
  useEffect(() => {
    const nextMatch = upcomingMatches[0]
    const matchDate = new Date(`${nextMatch.date}T${nextMatch.time}:00`)

    const interval = setInterval(() => {
      const now = new Date()
      const diff = matchDate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setCountdown({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleSaveMatch = (matchId: string) => {
    setSavedMatches((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    )
  }

  const shareMatch = async (match: Match) => {
    const text = `${match.homeTeam} vs ${match.awayTeam} - ${match.date} a las ${match.time} en ${match.stadium}`
    if (navigator.share) {
      await navigator.share({
        title: "Partido de fútbol",
        text,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(text)
      alert("Enlace copiado al portapapeles")
    }
  }

  const alerts = [
    {
      type: "warning",
      title: "Tráfico intenso esperado",
      message: "Se recomienda llegar con 2 horas de antelación debido al tráfico en zona norte.",
    },
    {
      type: "info",
      title: "Metro reforzado",
      message: "Servicio de metro con frecuencia cada 3 minutos desde las 17:00.",
    },
    {
      type: "success",
      title: "Puertas abiertas",
      message: "Las puertas del estadio abrirán 3 horas antes del partido.",
    },
  ]

  const accessPoints = [
    {
      name: "Puerta Norte",
      status: "recommended",
      waitTime: "10 min",
      sectors: ["Tribuna Norte", "Lateral Norte"],
      tips: "Menos aglomeración, acceso PMR disponible",
    },
    {
      name: "Puerta Sur",
      status: "moderate",
      waitTime: "20 min",
      sectors: ["Tribuna Sur", "Fondo Sur"],
      tips: "Acceso principal, cerca del transporte público",
    },
    {
      name: "Puerta Este",
      status: "busy",
      waitTime: "35 min",
      sectors: ["Lateral Este", "VIP"],
      tips: "Zona de mayor afluencia, evitar si es posible",
    },
    {
      name: "Puerta Oeste",
      status: "moderate",
      waitTime: "25 min",
      sectors: ["Lateral Oeste", "Fondo Norte"],
      tips: "Buena opción alternativa, parking cercano",
    },
  ]

  const transportOptions = [
    {
      type: "metro",
      icon: Train,
      name: "Metro",
      lines: ["Línea 7", "Línea 10"],
      station: "Estadio",
      frequency: "Cada 3-5 min",
      tips: "Servicio reforzado 2h antes y después del partido",
      lastService: "01:30",
    },
    {
      type: "bus",
      icon: Bus,
      name: "Autobús",
      lines: ["15", "43", "67", "124"],
      station: "Parada Estadio",
      frequency: "Cada 10 min",
      tips: "Líneas especiales desde el centro",
      lastService: "00:30",
    },
    {
      type: "car",
      icon: Car,
      name: "Coche",
      parkings: ["Parking Norte (800 plazas)", "Parking Sur (500 plazas)", "Parking Centro Comercial (300 plazas)"],
      tips: "Reserva tu plaza con antelación",
      price: "8-15€",
    },
  ]

  const stadiumRules = [
    { rule: "No se permite la entrada con botellas de vidrio", important: true },
    { rule: "Prohibido el uso de paraguas", important: true },
    { rule: "Cámaras profesionales no permitidas", important: false },
    { rule: "Mascotas no permitidas (excepto perros guía)", important: false },
    { rule: "Bolsos máximo 20x20x20 cm", important: true },
    { rule: "Fumar prohibido en todo el recinto", important: false },
  ]

  const visitorTips = [
    { tip: "Llega al menos 90 minutos antes del partido", category: "timing" },
    { tip: "Descarga la app oficial del club para acceso digital", category: "tech" },
    { tip: "Los colores del equipo visitante solo en la zona designada", category: "safety" },
    { tip: "Hidratación: puedes entrar con botellas de plástico vacías", category: "comfort" },
    { tip: "Si vienes con niños, el servicio de atención está en Puerta Norte", category: "family" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended":
        return "text-accent bg-accent/10 border-accent"
      case "moderate":
        return "text-yellow-600 bg-yellow-500/10 border-yellow-500"
      case "busy":
        return "text-red-500 bg-red-500/10 border-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "recommended":
        return "Recomendado"
      case "moderate":
        return "Moderado"
      case "busy":
        return "Saturado"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Next Match Highlight */}
      <Card className="border-accent bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-accent text-accent-foreground mb-3">Próximo Partido</Badge>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                {upcomingMatches[0].homeTeam} vs {upcomingMatches[0].awayTeam}
              </h2>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(upcomingMatches[0].date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {upcomingMatches[0].time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {upcomingMatches[0].stadium}
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex gap-3">
              {[
                { value: countdown.days, label: "Días" },
                { value: countdown.hours, label: "Horas" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Seg" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-14 h-14 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">{item.value.toString().padStart(2, "0")}</span>
                  </div>
                  <span className="text-xs mt-1 block text-primary-foreground/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-primary-foreground/20">
            <Button
              size="sm"
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              onClick={() => toggleSaveMatch(upcomingMatches[0].id)}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${savedMatches.includes(upcomingMatches[0].id) ? "fill-current" : ""}`}
              />
              {savedMatches.includes(upcomingMatches[0].id) ? "Guardado" : "Guardar"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              onClick={() => shareMatch(upcomingMatches[0])}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Comprar Entradas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weather Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display flex items-center gap-2 text-lg">
            <CloudSun className="w-5 h-5 text-accent" />
            Previsión para el Día del Partido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <CloudSun className="w-8 h-8 text-accent" />
              </div>
              <div>
                <div className="text-3xl font-bold">{weather.temperature}°C</div>
                <div className="text-muted-foreground">{weather.condition}</div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <Thermometer className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <div className="text-sm font-medium">{weather.humidity}%</div>
                <div className="text-xs text-muted-foreground">Humedad</div>
              </div>
              <div className="text-center">
                <Wind className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <div className="text-sm font-medium">{weather.wind} km/h</div>
                <div className="text-xs text-muted-foreground">Viento</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertas del Día de Partido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, idx) => (
            <Alert
              key={idx}
              className={
                alert.type === "warning"
                  ? "border-orange-500/50 bg-orange-500/5"
                  : alert.type === "success"
                    ? "border-accent/50 bg-accent/5"
                    : "border-blue-500/50 bg-blue-500/5"
              }
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              ) : alert.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-accent" />
              ) : (
                <Info className="w-4 h-4 text-blue-500" />
              )}
              <AlertDescription>
                <div className="font-semibold">{alert.title}</div>
                <div className="text-sm text-muted-foreground">{alert.message}</div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="access" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="access">Accesos</TabsTrigger>
          <TabsTrigger value="transport">Transporte</TabsTrigger>
          <TabsTrigger value="rules">Normas</TabsTrigger>
          <TabsTrigger value="tips">Consejos</TabsTrigger>
        </TabsList>

        {/* Access Points */}
        <TabsContent value="access">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <DoorOpen className="w-5 h-5 text-accent" />
                Puertas de Acceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessPoints.map((access, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${getStatusColor(access.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {access.name}
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              access.status === "recommended"
                                ? "bg-accent text-accent-foreground"
                                : access.status === "busy"
                                  ? "bg-red-500 text-white"
                                  : ""
                            }`}
                          >
                            {getStatusLabel(access.status)}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{access.tips}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          <span className="font-bold">{access.waitTime}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">espera</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {access.sectors.map((sector) => (
                        <Badge key={sector} variant="outline" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-accent" />
                  Horarios Recomendados de Llegada
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Para disfrutar del ambiente previo:</span>
                    <span className="font-medium">3 horas antes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Llegada cómoda sin prisas:</span>
                    <span className="font-medium">2 horas antes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Llegada ajustada:</span>
                    <span className="font-medium">1 hora antes</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport */}
        <TabsContent value="transport">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Navigation2 className="w-5 h-5 text-accent" />
                Cómo Llegar al Estadio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transportOptions.map((option, idx) => {
                  const Icon = option.icon
                  return (
                    <div key={idx} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{option.name}</h4>
                          {option.lines && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {option.lines.map((line) => (
                                <Badge key={line} variant="secondary" className="text-xs">
                                  {line}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {option.parkings && (
                            <ul className="text-sm text-muted-foreground space-y-1 mb-2">
                              {option.parkings.map((parking) => (
                                <li key={parking} className="flex items-center gap-1">
                                  <ChevronRight className="w-3 h-3" />
                                  {parking}
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="text-sm text-muted-foreground">{option.tips}</p>
                          {option.frequency && (
                            <div className="flex gap-4 mt-2 text-xs">
                              <span>
                                <strong>Frecuencia:</strong> {option.frequency}
                              </span>
                              <span>
                                <strong>Último servicio:</strong> {option.lastService}
                              </span>
                            </div>
                          )}
                          {option.price && (
                            <div className="mt-2 text-xs">
                              <strong>Precio:</strong> {option.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                Ver en Google Maps
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-accent" />
                Normas del Estadio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stadiumRules.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      item.important ? "bg-red-500/10 border border-red-500/30" : "bg-muted"
                    }`}
                  >
                    {item.important ? (
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={item.important ? "font-medium" : ""}>{item.rule}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Contacto de Emergencias
                </h4>
                <p className="text-sm text-muted-foreground">
                  En caso de emergencia dentro del estadio, contacta con el personal de seguridad o llama al
                  <strong className="text-foreground"> 112</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips */}
        <TabsContent value="tips">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-accent" />
                Consejos para Visitantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visitorTips.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-foreground font-bold text-sm">{idx + 1}</span>
                    </div>
                    <span className="pt-1">{item.tip}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Zona Familiar
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Acceso PMR
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Matches List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-accent" />
            Próximos Partidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={match.isHome ? "default" : "secondary"} className="text-xs">
                      {match.isHome ? "Local" : "Visitante"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {match.competition}
                    </Badge>
                  </div>
                  <h4 className="font-semibold">
                    {match.homeTeam} vs {match.awayTeam}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(match.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {match.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {match.stadium}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleSaveMatch(match.id)}
                    className={savedMatches.includes(match.id) ? "text-red-500" : ""}
                  >
                    <Heart className={`w-4 h-4 ${savedMatches.includes(match.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => shareMatch(match)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
