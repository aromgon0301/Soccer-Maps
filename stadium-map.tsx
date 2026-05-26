"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Plus, TrendingUp, Navigation, Eye, Shield, Coffee, Star, Building2, Users } from "lucide-react"
import Image from "next/image"
import { teams, type Team } from "@/lib/teams-data"

interface StadiumRatings {
  accessibility: number
  atmosphere: number
  transport: number
  visibility: number
  services: number
  safety: number
}

const stadiumRatings: Record<string, StadiumRatings> = {
  "fc-barcelona": { accessibility: 85, atmosphere: 95, transport: 90, visibility: 88, services: 92, safety: 90 },
  "real-madrid": { accessibility: 90, atmosphere: 92, transport: 95, visibility: 90, services: 95, safety: 95 },
  "atletico-madrid": { accessibility: 88, atmosphere: 90, transport: 85, visibility: 92, services: 88, safety: 92 },
  "sevilla-fc": { accessibility: 80, atmosphere: 88, transport: 75, visibility: 85, services: 80, safety: 85 },
  "real-betis": { accessibility: 82, atmosphere: 92, transport: 78, visibility: 83, services: 82, safety: 88 },
  "valencia-cf": { accessibility: 78, atmosphere: 85, transport: 80, visibility: 82, services: 78, safety: 82 },
  "athletic-club": { accessibility: 92, atmosphere: 95, transport: 88, visibility: 90, services: 90, safety: 92 },
  "real-sociedad": { accessibility: 85, atmosphere: 88, transport: 82, visibility: 88, services: 85, safety: 90 },
  "villarreal-cf": { accessibility: 80, atmosphere: 82, transport: 70, visibility: 85, services: 75, safety: 85 },
  "girona-fc": { accessibility: 75, atmosphere: 80, transport: 72, visibility: 80, services: 72, safety: 80 },
}

const criteriaInfo = [
  {
    key: "accessibility" as keyof StadiumRatings,
    label: "Accesibilidad",
    icon: Users,
    description: "Facilidad de acceso, rampas, ascensores, zonas PMR",
  },
  {
    key: "atmosphere" as keyof StadiumRatings,
    label: "Ambiente",
    icon: TrendingUp,
    description: "Intensidad, cánticos, pasión de la afición",
  },
  {
    key: "transport" as keyof StadiumRatings,
    label: "Transporte",
    icon: Navigation,
    description: "Conexiones de metro, bus, parking disponible",
  },
  {
    key: "visibility" as keyof StadiumRatings,
    label: "Visibilidad",
    icon: Eye,
    description: "Calidad de las vistas desde diferentes zonas",
  },
  {
    key: "services" as keyof StadiumRatings,
    label: "Servicios",
    icon: Coffee,
    description: "Bares, tiendas, baños, Wi-Fi, pantallas",
  },
  {
    key: "safety" as keyof StadiumRatings,
    label: "Seguridad",
    icon: Shield,
    description: "Seguridad, control de acceso, zonas vigiladas",
  },
]

export function StadiumComparator() {
  const [selectedStadiums, setSelectedStadiums] = useState<Team[]>([])
  const [showSelector, setShowSelector] = useState(false)

  const addStadium = (team: Team) => {
    if (selectedStadiums.length < 3 && !selectedStadiums.find((s) => s.id === team.id)) {
      setSelectedStadiums([...selectedStadiums, team])
      if (selectedStadiums.length === 2) {
        setShowSelector(false)
      }
    }
  }

  const removeStadium = (teamId: string) => {
    setSelectedStadiums(selectedStadiums.filter((s) => s.id !== teamId))
  }

  const getColorForScore = (score: number) => {
    if (score >= 90) return "text-accent"
    if (score >= 75) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-orange-600"
  }

  const getBackgroundForScore = (score: number) => {
    if (score >= 90) return "bg-accent/20"
    if (score >= 75) return "bg-green-600/20"
    if (score >= 60) return "bg-yellow-600/20"
    return "bg-orange-600/20"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Comparador de Estadios</CardTitle>
          <CardDescription>
            Compara hasta 3 estadios de La Liga por accesibilidad, ambiente, transporte, visibilidad, servicios y
            seguridad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedStadiums.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent rounded-lg"
              >
                <div className="w-6 h-6 relative">
                  <Image src={team.badge || "/placeholder.svg"} alt={team.shortName} fill className="object-contain" />
                </div>
                <span className="font-semibold text-sm">{team.shortName}</span>
                <button
                  onClick={() => removeStadium(team.id)}
                  className="ml-2 hover:bg-accent/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {selectedStadiums.length < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSelector(!showSelector)}
                className="bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" />
                Añadir Estadio
              </Button>
            )}
          </div>

          {showSelector && (
            <div className="border border-border rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-3 text-sm">Selecciona un estadio:</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {teams
                  .filter((team) => !selectedStadiums.find((s) => s.id === team.id))
                  .map((team) => (
                    <button
                      key={team.id}
                      onClick={() => addStadium(team)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all"
                    >
                      <div className="w-10 h-10 relative">
                        <Image
                          src={team.badge || "/placeholder.svg"}
                          alt={team.shortName}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-medium text-center">{team.shortName}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {selectedStadiums.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Comienza a comparar estadios</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona hasta 3 estadios para comparar sus características
              </p>
            </div>
          )}

          {selectedStadiums.length > 0 && (
            <div className="space-y-8">
              {/* Basic Info Comparison */}
              <div>
                <h3 className="text-lg font-bold mb-4">Información Básica</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Estadio</th>
                        {selectedStadiums.map((team) => (
                          <th key={team.id} className="text-center py-3 px-2">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 relative">
                                <Image
                                  src={team.badge || "/placeholder.svg"}
                                  alt={team.shortName}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="font-semibold text-sm">{team.stadium.name}</div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 px-2 text-sm font-medium">Ciudad</td>
                        {selectedStadiums.map((team) => (
                          <td key={team.id} className="text-center py-3 px-2 text-sm">
                            {team.city}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-2 text-sm font-medium">Capacidad</td>
                        {selectedStadiums.map((team) => (
                          <td key={team.id} className="text-center py-3 px-2 text-sm font-semibold">
                            {team.stadium.capacity.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-2 text-sm font-medium">Distancia al centro</td>
                        {selectedStadiums.map((team) => (
                          <td key={team.id} className="text-center py-3 px-2 text-sm">
                            {team.stadium.distanceToCenter}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ratings Comparison */}
              <div>
                <h3 className="text-lg font-bold mb-4">Comparación de Valoraciones</h3>
                <div className="space-y-6">
                  {criteriaInfo.map((criteria) => {
                    const Icon = criteria.icon
                    return (
                      <div key={criteria.key} className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-accent" />
                          <h4 className="font-semibold">{criteria.label}</h4>
                          <span className="text-xs text-muted-foreground ml-auto">{criteria.description}</span>
                        </div>
                        <div
                          className="grid gap-3"
                          style={{ gridTemplateColumns: `repeat(${selectedStadiums.length}, 1fr)` }}
                        >
                          {selectedStadiums.map((team) => {
                            const rating = stadiumRatings[team.id]
                            const score = rating[criteria.key]
                            return (
                              <div key={team.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium">{team.shortName}</span>
                                  <span className={`text-lg font-bold ${getColorForScore(score)}`}>{score}</span>
                                </div>
                                <Progress value={score} className="h-2" />
                                <div
                                  className={`text-xs font-medium px-2 py-1 rounded ${getBackgroundForScore(score)} ${getColorForScore(score)} text-center`}
                                >
                                  {score >= 90
                                    ? "Excelente"
                                    : score >= 75
                                      ? "Muy Bueno"
                                      : score >= 60
                                        ? "Bueno"
                                        : "Aceptable"}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Overall Score */}
              <div>
                <h3 className="text-lg font-bold mb-4">Puntuación Global</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedStadiums.length}, 1fr)` }}>
                  {selectedStadiums.map((team) => {
                    const rating = stadiumRatings[team.id]
                    const overallScore = Math.round(
                      Object.values(rating).reduce((sum, val) => sum + val, 0) / Object.values(rating).length,
                    )
                    return (
                      <Card key={team.id} className="border-2">
                        <CardContent className="pt-6 text-center">
                          <div className="w-16 h-16 relative mx-auto mb-3">
                            <Image
                              src={team.badge || "/placeholder.svg"}
                              alt={team.shortName}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="font-semibold mb-1">{team.stadium.name}</div>
                          <div className={`text-4xl font-bold mb-2 ${getColorForScore(overallScore)}`}>
                            {overallScore}
                          </div>
                          <Badge variant="secondary" className={`${getBackgroundForScore(overallScore)}`}>
                            <Star className="w-3 h-3 mr-1" />
                            {overallScore >= 90 ? "Excelente" : overallScore >= 75 ? "Muy Bueno" : "Bueno"}
                          </Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
