"use client"

import { useState } from "react"
import {
  Shield,
  AlertTriangle,
  MapPin,
  Navigation,
  Users,
  Coffee,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  MessageCircle,
  Clock,
  Star,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Team } from "@/lib/teams-data"

interface VisitorModeProps {
  team: Team
}

interface SafeZone {
  id: string
  name: string
  type: "safe" | "caution" | "avoid"
  description: string
  tips: string[]
}

interface LocalTip {
  id: string
  title: string
  content: string
  category: "transport" | "food" | "behavior" | "safety"
  votes: number
}

const safeZones: Record<string, SafeZone[]> = {
  default: [
    {
      id: "zone-1",
      name: "Zona Familiar",
      type: "safe",
      description: "Área tranquila con ambiente familiar, ideal para visitantes con niños.",
      tips: ["Buenos restaurantes", "Presencia policial", "Menos aglomeraciones"],
    },
    {
      id: "zone-2",
      name: "Zona de Encuentro Neutral",
      type: "safe",
      description: "Punto de encuentro recomendado para aficionados visitantes.",
      tips: ["Bares mixtos", "Fácil acceso al estadio", "Ambiente relajado"],
    },
    {
      id: "zone-3",
      name: "Grada de Animación Local",
      type: "caution",
      description: "Zona de la hinchada local más activa. Evitar colores visitantes.",
      tips: ["Ambiente muy intenso", "No recomendado con niños", "Evitar provocaciones"],
    },
    {
      id: "zone-4",
      name: "Alrededores Grada Ultra",
      type: "avoid",
      description: "Zona próxima a la grada de animación local. No recomendada para visitantes.",
      tips: ["Evitar 2h antes y después", "No usar colores visitantes", "Usar rutas alternativas"],
    },
  ],
}

const localTips: LocalTip[] = [
  {
    id: "tip-1",
    title: "Llega temprano al metro",
    content: "Las estaciones cercanas al estadio se saturan 1h antes del partido. Llega con 90 min de antelación.",
    category: "transport",
    votes: 234,
  },
  {
    id: "tip-2",
    title: "Guarda los colores discretos",
    content:
      "Si vienes de visitante, es mejor llevar los colores de tu equipo en la mochila hasta llegar a tu zona del estadio.",
    category: "behavior",
    votes: 189,
  },
  {
    id: "tip-3",
    title: "Comida antes en el centro",
    content: "Los bares junto al estadio tienen precios inflados. Come en el centro y luego ve al partido.",
    category: "food",
    votes: 156,
  },
  {
    id: "tip-4",
    title: "Evita la salida masiva",
    content: "Quédate 15 min después del pitido final para evitar aglomeraciones en el transporte.",
    category: "safety",
    votes: 312,
  },
  {
    id: "tip-5",
    title: "Taxi compartido de vuelta",
    content: "Las apps de taxi tienen zonas de recogida designadas. Compartir taxi es más rápido y económico.",
    category: "transport",
    votes: 98,
  },
]

const categoryIcons = {
  transport: Navigation,
  food: Coffee,
  behavior: Users,
  safety: Shield,
}

const categoryLabels = {
  transport: "Transporte",
  food: "Comida",
  behavior: "Comportamiento",
  safety: "Seguridad",
}

export function VisitorMode({ team }: VisitorModeProps) {
  const [isVisitorMode, setIsVisitorMode] = useState(false)
  const [showAvoidZones, setShowAvoidZones] = useState(true)
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null)

  const zones = safeZones.default

  const getZoneColor = (type: SafeZone["type"]) => {
    switch (type) {
      case "safe":
        return "bg-accent text-accent-foreground"
      case "caution":
        return "bg-yellow-500 text-white"
      case "avoid":
        return "bg-red-500 text-white"
    }
  }

  const getZoneBorder = (type: SafeZone["type"]) => {
    switch (type) {
      case "safe":
        return "border-accent"
      case "caution":
        return "border-yellow-500"
      case "avoid":
        return "border-red-500"
    }
  }

  const getZoneIcon = (type: SafeZone["type"]) => {
    switch (type) {
      case "safe":
        return Check
      case "caution":
        return Eye
      case "avoid":
        return AlertTriangle
    }
  }

  return (
    <div className="space-y-6">
      {/* Visitor Mode Toggle */}
      <Card className={isVisitorMode ? "border-accent bg-accent/5" : ""}>
        <CardHeader>
          <CardTitle className="font-display flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Modo Visitante
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="visitor-mode" className="text-sm font-normal text-muted-foreground">
                {isVisitorMode ? "Activado" : "Desactivado"}
              </Label>
              <Switch id="visitor-mode" checked={isVisitorMode} onCheckedChange={setIsVisitorMode} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isVisitorMode
              ? `Modo visitante activado. Te mostramos las mejores rutas y zonas seguras para tu visita al ${team.stadium.name}.`
              : "Activa el modo visitante para ver rutas seguras, zonas recomendadas y consejos locales si vienes como aficionado del equipo rival."}
          </p>
          {isVisitorMode && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                <Shield className="w-3 h-3 mr-1" />
                Rutas seguras activas
              </Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                <MapPin className="w-3 h-3 mr-1" />
                Zonas marcadas
              </Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                <MessageCircle className="w-3 h-3 mr-1" />
                Consejos locales
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {isVisitorMode && (
        <>
          {/* Zone Map Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-accent" />
                Mapa de Zonas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Mostrar zonas a evitar</span>
                <Switch checked={showAvoidZones} onCheckedChange={setShowAvoidZones} />
              </div>

              {/* Zone Legend */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                  <span className="text-xs font-medium">Segura</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded-lg">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs font-medium">Precaución</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium">Evitar</span>
                </div>
              </div>

              {/* Visual Map Representation */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                {/* Grid Background */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(0deg, transparent 24%, rgba(0, 43, 85, .1) 25%, rgba(0, 43, 85, .1) 26%, transparent 27%, transparent 74%, rgba(0, 43, 85, .1) 75%, rgba(0, 43, 85, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 43, 85, .1) 25%, rgba(0, 43, 85, .1) 26%, transparent 27%, transparent 74%, rgba(0, 43, 85, .1) 75%, rgba(0, 43, 85, .1) 76%, transparent 77%, transparent)",
                    backgroundSize: "50px 50px",
                  }}
                ></div>

                {/* Stadium Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-accent">
                    <div className="text-center">
                      <MapPin className="w-6 h-6 mx-auto mb-1 text-primary-foreground" />
                      <span className="text-xs font-bold text-primary-foreground">Estadio</span>
                    </div>
                  </div>
                </div>

                {/* Safe Zone - Top Right */}
                <div
                  className="absolute top-8 right-8 w-20 h-20 bg-accent/30 rounded-full border-2 border-accent border-dashed flex items-center justify-center cursor-pointer hover:bg-accent/40 transition-colors"
                  onClick={() => setSelectedZone(zones[0])}
                >
                  <span className="text-xs font-semibold text-accent">Segura</span>
                </div>

                {/* Safe Zone - Bottom Left */}
                <div
                  className="absolute bottom-8 left-8 w-16 h-16 bg-accent/30 rounded-full border-2 border-accent border-dashed flex items-center justify-center cursor-pointer hover:bg-accent/40 transition-colors"
                  onClick={() => setSelectedZone(zones[1])}
                >
                  <span className="text-xs font-semibold text-accent">Neutral</span>
                </div>

                {/* Caution Zone - Left */}
                <div
                  className="absolute top-1/2 left-8 -translate-y-1/2 w-16 h-24 bg-yellow-500/30 rounded-lg border-2 border-yellow-500 border-dashed flex items-center justify-center cursor-pointer hover:bg-yellow-500/40 transition-colors"
                  onClick={() => setSelectedZone(zones[2])}
                >
                  <span className="text-xs font-semibold text-yellow-600">Precaución</span>
                </div>

                {/* Avoid Zone - Bottom */}
                {showAvoidZones && (
                  <div
                    className="absolute bottom-4 right-1/4 w-24 h-12 bg-red-500/30 rounded-lg border-2 border-red-500 border-dashed flex items-center justify-center cursor-pointer hover:bg-red-500/40 transition-colors"
                    onClick={() => setSelectedZone(zones[3])}
                  >
                    <span className="text-xs font-semibold text-red-600">Evitar</span>
                  </div>
                )}

                {/* Safe Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                  <path
                    d="M 85% 20% Q 70% 30% 55% 45%"
                    stroke="rgb(62, 207, 94)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    opacity="0.8"
                  />
                  <text x="75%" y="15%" fill="rgb(62, 207, 94)" fontSize="10" fontWeight="bold">
                    Ruta Segura
                  </text>
                </svg>
              </div>

              {/* Selected Zone Details */}
              {selectedZone && (
                <div className={`p-4 rounded-lg border-2 ${getZoneBorder(selectedZone.type)} bg-background`}>
                  <div className="flex items-start gap-3">
                    {(() => {
                      const Icon = getZoneIcon(selectedZone.type)
                      return (
                        <div
                          className={`w-10 h-10 ${getZoneColor(selectedZone.type)} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      )
                    })()}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{selectedZone.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{selectedZone.description}</p>
                      <ul className="space-y-1">
                        {selectedZone.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-accent" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)}>
                      <EyeOff className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zone List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Zonas Detalladas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.map((zone) => {
                const Icon = getZoneIcon(zone.type)
                return (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                      selectedZone?.id === zone.id ? getZoneBorder(zone.type) : "border-border"
                    }`}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${getZoneColor(zone.type)} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Local Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-accent" />
                Consejos Locales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consejos de otros aficionados visitantes que han estado en el {team.stadium.name}
              </p>
              <div className="space-y-4">
                {localTips.map((tip) => {
                  const Icon = categoryIcons[tip.category]
                  return (
                    <div key={tip.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{tip.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {categoryLabels[tip.category]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tip.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Útil ({tip.votes})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:border-accent transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Generar Ruta Segura</h3>
                    <p className="text-sm text-muted-foreground">Desde tu ubicación al estadio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-accent transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Plan de Salida Segura</h3>
                    <p className="text-sm text-muted-foreground">Evita aglomeraciones al salir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
