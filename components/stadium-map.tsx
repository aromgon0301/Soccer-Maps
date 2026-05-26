"use client"

import { useState } from "react"
import { MapPin, Coffee, Car, Bus, Navigation, Utensils, Map } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveMap } from "@/components/interactive-map"
import type { Team } from "@/lib/teams-data"

interface POI {
  id: string
  name: string
  type: "bar" | "restaurant" | "parking" | "transport"
  distance: string
  position: { top: string; left: string }
}

const pois: Record<string, POI[]> = {
  default: [
    {
      id: "1",
      name: "Bar del Estadio",
      type: "bar",
      distance: "100m",
      position: { top: "30%", left: "20%" },
    },
    {
      id: "2",
      name: "Restaurante La Grada",
      type: "restaurant",
      distance: "250m",
      position: { top: "60%", left: "75%" },
    },
    {
      id: "3",
      name: "Parking Norte",
      type: "parking",
      distance: "150m",
      position: { top: "15%", left: "80%" },
    },
    {
      id: "4",
      name: "Metro Estadio",
      type: "transport",
      distance: "200m",
      position: { top: "70%", left: "30%" },
    },
    {
      id: "5",
      name: "Bar Los Aficionados",
      type: "bar",
      distance: "180m",
      position: { top: "40%", left: "85%" },
    },
    {
      id: "6",
      name: "Parking Sur",
      type: "parking",
      distance: "120m",
      position: { top: "85%", left: "65%" },
    },
  ],
}

const layerConfig = [
  { id: "bar", label: "Bares", icon: Coffee, color: "bg-orange-500" },
  { id: "restaurant", label: "Restaurantes", icon: Utensils, color: "bg-red-500" },
  { id: "parking", label: "Parkings", icon: Car, color: "bg-blue-500" },
  { id: "transport", label: "Transporte", icon: Bus, color: "bg-accent" },
]

export function StadiumMap({ team }: { team: Team }) {
  const [activeLayers, setActiveLayers] = useState<string[]>(["bar", "restaurant", "parking", "transport"])
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null)
  const [mapView, setMapView] = useState<"simple" | "interactive">("interactive")

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  const teamPois = pois.default
  const visiblePois = teamPois.filter((poi) => activeLayers.includes(poi.type))

  const getIconComponent = (type: POI["type"]) => {
    const config = layerConfig.find((l) => l.id === type)
    return config?.icon || MapPin
  }

  const getColorClass = (type: POI["type"]) => {
    const config = layerConfig.find((l) => l.id === type)
    return config?.color || "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      {/* Map View Toggle */}
      <Tabs value={mapView} onValueChange={(v) => setMapView(v as typeof mapView)}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Mapa Interactivo
          </TabsTrigger>
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Vista Esquemática
          </TabsTrigger>
        </TabsList>

        {/* Interactive Map View */}
        <TabsContent value="interactive" className="mt-6">
          <InteractiveMap team={team} />
        </TabsContent>

        {/* Simple Schematic View */}
        <TabsContent value="simple" className="mt-6">
          <div className="space-y-6">
            {/* Layer Controls */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-accent" />
                  Capas del Mapa
                </h3>
                <div className="flex flex-wrap gap-2">
                  {layerConfig.map((layer) => {
                    const Icon = layer.icon
                    const isActive = activeLayers.includes(layer.id)
                    return (
                      <Button
                        key={layer.id}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleLayer(layer.id)}
                        className={isActive ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {layer.label}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Schematic Map */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  {/* Map Background with Grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(0deg, transparent 24%, rgba(0, 43, 85, .1) 25%, rgba(0, 43, 85, .1) 26%, transparent 27%, transparent 74%, rgba(0, 43, 85, .1) 75%, rgba(0, 43, 85, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 43, 85, .1) 25%, rgba(0, 43, 85, .1) 26%, transparent 27%, transparent 74%, rgba(0, 43, 85, .1) 75%, rgba(0, 43, 85, .1) 76%, transparent 77%, transparent)",
                      backgroundSize: "50px 50px",
                    }}
                  ></div>

                  {/* Stadium Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-accent">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 text-primary-foreground" />
                          <div className="text-xs md:text-sm font-bold text-primary-foreground px-2">
                            {team.stadium.name}
                          </div>
                        </div>
                      </div>
                      {/* Pulse Animation */}
                      <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20"></div>
                    </div>
                  </div>

                  {/* POI Markers */}
                  {visiblePois.map((poi) => {
                    const Icon = getIconComponent(poi.type)
                    const colorClass = getColorClass(poi.type)
                    return (
                      <button
                        key={poi.id}
                        onClick={() => setSelectedPoi(poi)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                        style={{ top: poi.position.top, left: poi.position.left }}
                      >
                        <div
                          className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center shadow-lg border-2 border-background group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap">
                            <div className="font-semibold">{poi.name}</div>
                            <div className="text-muted-foreground">{poi.distance}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  {/* Routes - decorative lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgb(62, 207, 94)" opacity="0.6" />
                      </marker>
                    </defs>
                    {visiblePois.slice(0, 2).map((poi, idx) => (
                      <line
                        key={`route-${idx}`}
                        x1="50%"
                        y1="50%"
                        x2={poi.position.left}
                        y2={poi.position.top}
                        stroke="rgb(62, 207, 94)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.4"
                        markerEnd="url(#arrowhead)"
                      />
                    ))}
                  </svg>
                </div>

                {/* POI Details */}
                {selectedPoi && (
                  <div className="mt-4 p-4 bg-accent/10 border border-accent rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {(() => {
                          const Icon = getIconComponent(selectedPoi.type)
                          const colorClass = getColorClass(selectedPoi.type)
                          return (
                            <div
                              className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                          )
                        })()}
                        <div>
                          <h4 className="font-semibold mb-1">{selectedPoi.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">Distancia: {selectedPoi.distance}</p>
                          <Badge variant="secondary">{layerConfig.find((l) => l.id === selectedPoi.type)?.label}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPoi(null)}
                        className="hover:bg-background"
                      >
                        Cerrar
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                        <Navigation className="w-4 h-4 mr-2" />
                        Ver en Google Maps
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Legend */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Leyenda</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {layerConfig.map((layer) => {
                    const Icon = layer.icon
                    return (
                      <div key={layer.id} className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 ${layer.color} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">{layer.label}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
