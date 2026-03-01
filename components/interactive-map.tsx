"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Team } from "@/lib/teams-data"
import { getVenuesForTeam } from "@/lib/venues-data"

interface InteractiveMapProps {
  team: Team
}

interface MapPOI {
  id: string
  name: string
  type: "bar" | "restaurant" | "parking" | "transport" | "accessible" | "experience" | "safe"
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

// Deterministic pseudo-random using a seed to avoid hydration mismatch
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generatePOIs(team: Team): MapPOI[] {
  const { lat, lng } = team.stadium.location
  const venues = getVenuesForTeam(team.id)
  // Use team id as seed so positions are stable per team
  const seed = team.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rand = seededRandom(seed)

  const pois: MapPOI[] = []

  venues.filter((v) => v.type === "bar").forEach((v) => {
    pois.push({
      id: v.id,
      name: v.name,
      type: "bar",
      position: [lat + (rand() - 0.5) * 0.008, lng + (rand() - 0.5) * 0.008],
      description: `${v.distance} · ${v.atmosphere ?? ""}`,
      distance: v.distance,
    })
  })

  venues.filter((v) => v.type === "restaurant").forEach((v) => {
    pois.push({
      id: v.id,
      name: v.name,
      type: "restaurant",
      position: [lat + (rand() - 0.5) * 0.008, lng + (rand() - 0.5) * 0.008],
      description: `${v.distance} · ${v.priceRange ?? ""}`,
      distance: v.distance,
    })
  })

  venues.filter((v) => v.type === "parking").forEach((v) => {
    pois.push({
      id: v.id,
      name: v.name,
      type: "parking",
      position: [lat + (rand() - 0.5) * 0.01, lng + (rand() - 0.5) * 0.01],
      description: `${v.capacity ?? ""} plazas · ${v.distance}`,
      distance: v.distance,
    })
  })

  pois.push(
    { id: "metro-1", name: "Metro Estadio", type: "transport", position: [lat + 0.002, lng - 0.003], description: "Línea principal · 200m", distance: "200m" },
    { id: "bus-1", name: "Parada Bus Estadio", type: "transport", position: [lat - 0.002, lng + 0.002], description: "Múltiples líneas · 150m", distance: "150m" },
    { id: "acc-1", name: "Acceso PMR Norte", type: "accessible", position: [lat + 0.001, lng - 0.001], description: "Rampa y ascensor · Puerta 7", distance: "50m" },
    { id: "acc-2", name: "Baños Adaptados", type: "accessible", position: [lat - 0.001, lng + 0.001], description: "Sector bajo · Nivel 0", distance: "80m" },
    { id: "exp-1", name: "Fan Zone Oficial", type: "experience", position: [lat + 0.003, lng + 0.002], description: "Música y actividades · 300m", distance: "300m" },
    { id: "exp-2", name: "Zona Familiar", type: "experience", position: [lat - 0.003, lng - 0.002], description: "Actividades niños · 250m", distance: "250m" },
    { id: "safe-1", name: "Punto de Encuentro", type: "safe", position: [lat + 0.002, lng + 0.003], description: "Zona neutral recomendada", distance: "350m" },
  )

  return pois
}

function getIconSVG(type: string): string {
  const icons: Record<string, string> = {
    bar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
    restaurant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
    parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
    transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
    accessible: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 1 0 6.88 6"/></svg>',
    experience: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    safe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  }
  return icons[type] ?? icons.bar
}

export function InteractiveMap({ team }: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerLayerRef = useRef<any>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const initializingRef = useRef(false)

  const [activeLayers, setActiveLayers] = useState<string[]>(["bar", "restaurant", "parking", "transport"])
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  // Stable POIs computed once per team
  const [pois] = useState<MapPOI[]>(() => generatePOIs(team))

  const toggleLayer = useCallback((layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    )
  }, [])

  // Initialize map with dynamic import to avoid SSR issues
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || initializingRef.current) return
    initializingRef.current = true

    const { lat, lng } = team.stadium.location

    let cancelled = false

    async function init() {
      try {
        // Dynamic import prevents SSR crash
        const L = (await import("leaflet")).default

        // Fix default icon asset paths broken by webpack
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        if (cancelled || !mapRef.current) return

        const map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: true,
          // Prevent accidental scroll-to-zoom on mobile
          scrollWheelZoom: true,
          tap: true,
        }).setView([lat, lng], 15)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          crossOrigin: "anonymous",
        }).addTo(map)

        // Stadium marker
        const stadiumIcon = L.divIcon({
          className: "",
          html: `<div style="width:48px;height:48px;background:#002B55;border:3px solid #3ECF5E;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.35);">${getIconSVG("safe").replace('stroke="currentColor"', 'stroke="white"').replace('stroke-width="2"', 'stroke-width="2" width="22" height="22"')}</div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        })

        L.marker([lat, lng], { icon: stadiumIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:system-ui;text-align:center;padding:4px 2px;"><strong style="font-size:13px;">${team.stadium.name}</strong><br/><span style="color:#666;font-size:11px;">${team.stadium.capacity.toLocaleString()} espectadores</span></div>`
          )

        // POI layer group
        const poiLayer = L.layerGroup().addTo(map)
        markerLayerRef.current = poiLayer

        mapInstanceRef.current = map

        // Resize observer to invalidate size when container changes
        if (containerRef.current) {
          resizeObserverRef.current = new ResizeObserver(() => {
            map.invalidateSize({ animate: false })
          })
          resizeObserverRef.current.observe(containerRef.current)
        }

        // Initial size invalidation after paint
        requestAnimationFrame(() => {
          map.invalidateSize({ animate: false })
          if (!cancelled) setIsMapReady(true)
        })
      } catch (err) {
        if (!cancelled) setMapError("No se pudo cargar el mapa. Comprueba tu conexión.")
      } finally {
        initializingRef.current = false
      }
    }

    init()

    return () => {
      cancelled = true
      resizeObserverRef.current?.disconnect()
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerLayerRef.current = null
      }
      setIsMapReady(false)
    }
    // Only re-run when the team changes
  }, [team.id, team.stadium.location.lat, team.stadium.location.lng, team.stadium.name, team.stadium.capacity])

  // Update POI markers whenever active layers change
  useEffect(() => {
    if (!isMapReady || !markerLayerRef.current || !mapInstanceRef.current) return

    const L = mapInstanceRef.current.options._L ?? null

    // We need L here; store it on the map instance after init
    async function updateMarkers() {
      const L = (await import("leaflet")).default
      const layer = markerLayerRef.current
      if (!layer) return

      layer.clearLayers()

      const visiblePOIs = pois.filter((poi) => activeLayers.includes(poi.type))

      visiblePOIs.forEach((poi) => {
        const config = layerConfig.find((l) => l.id === poi.type)
        if (!config) return

        const iconHtml = `<div style="width:34px;height:34px;background:${config.color};border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.28);cursor:pointer;">${getIconSVG(poi.type).replace('stroke="currentColor"', 'stroke="white"').replace('stroke-width="2"', 'stroke-width="2" width="16" height="16"')}</div>`

        const icon = L.divIcon({
          className: "",
          html: iconHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        })

        const marker = L.marker(poi.position, { icon }).addTo(layer)

        marker.on("click", () => {
          setSelectedPOI(poi)
          mapInstanceRef.current?.panTo(poi.position, { animate: true, duration: 0.4 })
        })
      })
    }

    updateMarkers()
  }, [activeLayers, isMapReady, pois])

  const handleZoomIn = useCallback(() => { mapInstanceRef.current?.zoomIn() }, [])
  const handleZoomOut = useCallback(() => { mapInstanceRef.current?.zoomOut() }, [])
  const handleCenter = useCallback(() => {
    const { lat, lng } = team.stadium.location
    mapInstanceRef.current?.setView([lat, lng], 15, { animate: true, duration: 0.6 })
  }, [team.stadium.location])

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 15, { animate: true })
      },
      () => { /* silently ignore permission denial */ },
      { timeout: 8000, maximumAge: 60000 }
    )
  }, [])

  return (
    <div className="space-y-3 sm:space-y-4" ref={containerRef}>
      {/* Layer Controls */}
      <Card>
        <CardContent className="pt-4 pb-4 px-3 sm:px-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
            Capas del Mapa
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {layerConfig.map((layer) => {
              const Icon = layer.icon
              const isActive = activeLayers.includes(layer.id)
              return (
                <Button
                  key={layer.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleLayer(layer.id)}
                  style={isActive ? { backgroundColor: layer.color, borderColor: layer.color } : undefined}
                  className={`text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 ${isActive ? "text-white hover:opacity-90" : ""}`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
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
          {/* Leaflet CSS */}
          <style>{`
            .leaflet-container { font-family: system-ui, sans-serif; }
            .leaflet-control-attribution { font-size: 10px !important; }
          `}</style>

          <div
            ref={mapRef}
            className="w-full"
            style={{ height: "clamp(280px, 50vw, 560px)", minHeight: 280 }}
            aria-label={`Mapa interactivo de ${team.stadium.name}`}
          />

          {/* Custom Zoom + Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-[1000]">
            <Button size="icon" variant="secondary" onClick={handleZoomIn} className="bg-background/95 shadow-md h-8 w-8 sm:h-9 sm:w-9" aria-label="Acercar">
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleZoomOut} className="bg-background/95 shadow-md h-8 w-8 sm:h-9 sm:w-9" aria-label="Alejar">
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleCenter} className="bg-background/95 shadow-md h-8 w-8 sm:h-9 sm:w-9" aria-label="Centrar en estadio">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleGeolocate} className="bg-background/95 shadow-md h-8 w-8 sm:h-9 sm:w-9" aria-label="Mi ubicación">
              <Locate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Loading overlay */}
          {!isMapReady && !mapError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center z-[2000]">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Cargando mapa...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {mapError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center z-[2000]">
              <div className="text-center px-4">
                <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{mapError}</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => { setMapError(null); setIsMapReady(false); }}>
                  Reintentar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected POI Details */}
      {selectedPOI && (
        <Card className="border-accent">
          <CardContent className="pt-4 pb-4 px-3 sm:px-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                {(() => {
                  const config = layerConfig.find((l) => l.id === selectedPOI.type)
                  const Icon = config?.icon ?? MapPin
                  return (
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: config?.color }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  )
                })()}
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base mb-1 truncate">{selectedPOI.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{selectedPOI.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">{layerConfig.find((l) => l.id === selectedPOI.type)?.label}</Badge>
                    {selectedPOI.distance && <Badge variant="outline" className="text-xs">{selectedPOI.distance}</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPOI(null)} className="shrink-0 h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 text-xs sm:text-sm">
                <Navigation className="w-3.5 h-3.5 mr-1.5" />
                Cómo llegar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs sm:text-sm bg-transparent"
                onClick={() => {
                  const [lat, lng] = selectedPOI.position
                  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank", "noopener")
                }}
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Google Maps
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="pt-4 pb-4 px-3 sm:px-6">
          <h4 className="font-semibold mb-3 text-sm sm:text-base">Leyenda</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {layerConfig.map((layer) => {
              const Icon = layer.icon
              return (
                <div key={layer.id} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: layer.color }}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm">{layer.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
