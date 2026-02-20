"use client"

import { useEffect, useRef, useState } from "react"
import {
  MapPin,
  Coffee,
  Car,
  Bus,
  Navigation,
  Utensils,
  Accessibility,
  Music,
  Shield,
  Layers,
  Locate,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Team } from "@/lib/teams-data"
import { getVenuesForTeam } from "@/lib/venues-data"
import L from "leaflet"

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

interface InteractiveMapProps {
  team: Team
}

interface MapPOI {
  id: string
  name: string
  type: "bar" | "restaurant" | "parking" | "transport" | "accessible" | "experience" | "safe" | "caution"
  position: [number, number]
  description: string
  distance?: string
}

const layerConfig = [
  { id: "bar", label: "Bares", icon: Coffee, color: "#f97316" },
  { id: "restaurant", label: "Restaurantes", icon: Utensils, color: "#ef4444" },
  { id: "parking", label: "Parkings", icon: Car, color: "#3b82f6" },
  { id: "transport", label: "Transporte", icon: Bus, color: "#3ECF5E" },
  { id: "accessible", label: "Accesibilidad", icon: Accessibility, color: "#8b5cf6" },
  { id: "experience", label: "Experiencias", icon: Music, color: "#ec4899" },
  { id: "safe", label: "Zonas Seguras", icon: Shield, color: "#22c55e" },
]

// Generate POIs around stadium coordinates
function generatePOIs(team: Team): MapPOI[] {
  const { lat, lng } = team.stadium.location
  const venues = getVenuesForTeam(team.id)

  const basePOIs: MapPOI[] = [
    // Bars from venues
    ...venues
      .filter((v) => v.type === "bar")
      .map((v, idx) => ({
        id: v.id,
        name: v.name,
        type: "bar" as const,
        position: [lat + (Math.random() - 0.5) * 0.008, lng + (Math.random() - 0.5) * 0.008] as [number, number],
        description: `${v.distance} · ${v.atmosphere}`,
        distance: v.distance,
      })),
    // Restaurants
    ...venues
      .filter((v) => v.type === "restaurant")
      .map((v) => ({
        id: v.id,
        name: v.name,
        type: "restaurant" as const,
        position: [lat + (Math.random() - 0.5) * 0.008, lng + (Math.random() - 0.5) * 0.008] as [number, number],
        description: `${v.distance} · ${v.priceRange}`,
        distance: v.distance,
      })),
    // Parking
    ...venues
      .filter((v) => v.type === "parking")
      .map((v) => ({
        id: v.id,
        name: v.name,
        type: "parking" as const,
        position: [lat + (Math.random() - 0.5) * 0.01, lng + (Math.random() - 0.5) * 0.01] as [number, number],
        description: `${v.capacity} plazas · ${v.distance}`,
        distance: v.distance,
      })),
    // Transport
    {
      id: "metro-1",
      name: "Metro Estadio",
      type: "transport" as const,
      position: [lat + 0.002, lng - 0.003] as [number, number],
      description: "Línea principal · 200m",
      distance: "200m",
    },
    {
      id: "bus-1",
      name: "Parada Bus Estadio",
      type: "transport" as const,
      position: [lat - 0.002, lng + 0.002] as [number, number],
      description: "Múltiples líneas · 150m",
      distance: "150m",
    },
    // Accessibility
    {
      id: "acc-1",
      name: "Acceso PMR Norte",
      type: "accessible" as const,
      position: [lat + 0.001, lng - 0.001] as [number, number],
      description: "Rampa y ascensor · Puerta 7",
      distance: "50m",
    },
    {
      id: "acc-2",
      name: "Baños Adaptados",
      type: "accessible" as const,
      position: [lat - 0.001, lng + 0.001] as [number, number],
      description: "Sector bajo · Nivel 0",
      distance: "80m",
    },
    // Experience zones
    {
      id: "exp-1",
      name: "Fan Zone Oficial",
      type: "experience" as const,
      position: [lat + 0.003, lng + 0.002] as [number, number],
      description: "Música y actividades · 300m",
      distance: "300m",
    },
    {
      id: "exp-2",
      name: "Zona Familiar",
      type: "experience" as const,
      position: [lat - 0.003, lng - 0.002] as [number, number],
      description: "Actividades niños · 250m",
      distance: "250m",
    },
    // Safe zones
    {
      id: "safe-1",
      name: "Punto de Encuentro",
      type: "safe" as const,
      position: [lat + 0.002, lng + 0.003] as [number, number],
      description: "Zona neutral recomendada",
      distance: "350m",
    },
  ]

  return basePOIs
}

export function InteractiveMap({ team }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const [activeLayers, setActiveLayers] = useState<string[]>(["bar", "restaurant", "parking", "transport"])
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [pois] = useState<MapPOI[]>(() => generatePOIs(team))

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const { lat, lng } = team.stadium.location

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([lat, lng], 15)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Add stadium marker
    const stadiumIcon = L.divIcon({
      className: "custom-stadium-marker",
      html: `
        <div style="
          width: 60px;
          height: 60px;
          background: #002B55;
          border: 4px solid #3ECF5E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      iconSize: [60, 60],
      iconAnchor: [30, 30],
    })

    L.marker([lat, lng], { icon: stadiumIcon })
      .addTo(map)
      .bindPopup(
        `<div style="text-align: center; font-family: system-ui;">
        <strong style="font-size: 14px;">${team.stadium.name}</strong><br/>
        <span style="color: #666; font-size: 12px;">${team.stadium.capacity.toLocaleString()} espectadores</span>
      </div>`,
      )

    // Create markers layer group
    markersRef.current = L.layerGroup().addTo(map)

    mapInstanceRef.current = map
    setIsMapReady(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [team])

  // Update markers when layers change
  useEffect(() => {
    if (!isMapReady || !markersRef.current) return

    // Clear existing markers
    markersRef.current.clearLayers()

    // Filter POIs by active layers
    const visiblePOIs = pois.filter((poi) => activeLayers.includes(poi.type))

    // Add markers for visible POIs
    visiblePOIs.forEach((poi) => {
      const config = layerConfig.find((l) => l.id === poi.type)
      if (!config) return

      const icon = L.divIcon({
        className: "custom-poi-marker",
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: ${config.color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            <div style="width: 18px; height: 18px; color: white;">
              ${getIconSVG(poi.type)}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker(poi.position, { icon }).addTo(markersRef.current!)

      marker.on("click", () => {
        setSelectedPOI(poi)
      })

      marker.bindPopup(
        `<div style="font-family: system-ui; min-width: 150px;">
          <strong style="font-size: 13px;">${poi.name}</strong><br/>
          <span style="color: #666; font-size: 11px;">${poi.description}</span>
        </div>`,
      )
    })
  }, [activeLayers, isMapReady, pois])

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut()
  }

  const handleLocate = () => {
    const { lat, lng } = team.stadium.location
    mapInstanceRef.current?.setView([lat, lng], 16)
  }

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
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
                  style={{
                    backgroundColor: isActive ? layer.color : undefined,
                    borderColor: isActive ? layer.color : undefined,
                  }}
                  className={isActive ? "text-white hover:opacity-90" : ""}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {layer.label}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div ref={mapRef} className="h-[500px] md:h-[600px] w-full" />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
            <Button size="icon" variant="secondary" onClick={handleZoomIn} className="bg-background shadow-md">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleZoomOut} className="bg-background shadow-md">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleLocate} className="bg-background shadow-md">
              <Locate className="w-4 h-4" />
            </Button>
          </div>

          {/* Loading State */}
          {!isMapReady && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando mapa...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected POI Details */}
      {selectedPOI && (
        <Card className="border-accent">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {(() => {
                  const config = layerConfig.find((l) => l.id === selectedPOI.type)
                  const Icon = config?.icon || MapPin
                  return (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: config?.color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  )
                })()}
                <div>
                  <h4 className="font-semibold mb-1">{selectedPOI.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{selectedPOI.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{layerConfig.find((l) => l.id === selectedPOI.type)?.label}</Badge>
                    {selectedPOI.distance && <Badge variant="outline">{selectedPOI.distance}</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPOI(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                Cómo llegar
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <MapPin className="w-4 h-4 mr-2" />
                Ver en Google Maps
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: layer.color }}
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
  )
}

// Helper function to get SVG icons for markers
function getIconSVG(type: string): string {
  const icons: Record<string, string> = {
    bar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
    restaurant:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
    parking:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
    transport:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
    accessible:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 1 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>',
    experience:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    safe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    caution:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
  }
  return icons[type] || icons.bar
}
