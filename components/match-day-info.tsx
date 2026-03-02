"use client"

import { AlertTriangle, CheckCircle2, Clock, Users, Navigation2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Team } from "@/lib/teams-data"

export function MatchDayInfo({ team }: { team: Team }) {
  const alerts = [
    {
      type: "warning",
      title: "Tráfico intenso",
      message: "Se espera tráfico alto 2 horas antes del partido en zona norte",
    },
    {
      type: "info",
      title: "Metro reforzado",
      message: "Servicio de metro con frecuencia cada 5 minutos",
    },
  ]

  const recommendedAccess = [
    {
      name: "Acceso Norte",
      status: "Recomendado",
      waitTime: "15 min",
      icon: CheckCircle2,
      color: "text-accent",
    },
    {
      name: "Acceso Sur",
      status: "Moderado",
      waitTime: "25 min",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      name: "Acceso Este",
      status: "Saturado",
      waitTime: "40 min",
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ]

  const atmosphereZones = [
    {
      zone: "Tribuna Norte",
      atmosphere: "Alta",
      description: "Zona de animación intensa, ambiente vibrante",
      level: 90,
    },
    {
      zone: "Lateral Este",
      atmosphere: "Media",
      description: "Equilibrio entre ambiente y comodidad",
      level: 60,
    },
    {
      zone: "Tribuna VIP",
      atmosphere: "Tranquila",
      description: "Zona premium, ambiente relajado",
      level: 30,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertas del Día de Partido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, idx) => (
            <Alert key={idx} className={alert.type === "warning" ? "border-orange-500/50" : "border-accent/50"}>
              <AlertDescription>
                <div className="font-semibold mb-1">{alert.title}</div>
                <div className="text-sm text-muted-foreground">{alert.message}</div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Recommended Access */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Navigation2 className="w-5 h-5 text-accent" />
            Accesos Recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendedAccess.map((access, idx) => {
              const Icon = access.icon
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${access.color}`} />
                    <div>
                      <div className="font-semibold">{access.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        {access.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Tiempo de espera</div>
                    <div className="font-bold">{access.waitTime}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Transport Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Horarios de Transporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent">
                <div className="font-semibold mb-1.5 sm:mb-2 text-sm">Metro</div>
                <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                  <li>Antes del partido: cada 5 min</li>
                  <li>Despues del partido: cada 3 min</li>
                  <li>Ultimo metro: 01:30h</li>
                </ul>
              </div>
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <div className="font-semibold mb-1.5 sm:mb-2 text-sm">Autobuses especiales</div>
                <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                  <li>Lineas reforzadas: 15, 43, 67</li>
                  <li>Frecuencia: cada 10 min</li>
                  <li>Parada: Puerta Principal</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atmosphere by Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Ambiente por Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atmosphereZones.map((zone, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold">{zone.zone}</div>
                    <div className="text-sm text-muted-foreground">{zone.description}</div>
                  </div>
                  <Badge variant="secondary">{zone.atmosphere}</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${zone.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
