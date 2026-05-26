"use client"

import { useState, useEffect, useRef } from "react"
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
  Utensils,
  Car,
  Bus,
  Hotel,
  Locate,
  Route,
  Filter,
  X,
  Layers,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Team } from "@/lib/teams-data"
import L from "leaflet"

interface VisitorModeProps {
  team: Team
}

interface POI {
  id: string
  name: string
  type: "bar" | "restaurant" | "hotel" | "transport" | "parking"
  position: [number, number]
  description: string
  distance: string
  rating?: number
  priceRange?: string
}

interface SafeZone {
  id: string
  name: string
  type: "safe" | "caution" | "avoid"
  description: string
  tips: string[]
  position: [number, number]
}

interface LocalTip {
  id: string
  title: string
  content: string
  category: "transport" | "food" | "behavior" | "safety"
  votes: number
}

const categoryConfig = {
  bar: { icon: Coffee, label: "Bares", color: "#f97316" },
  restaurant: { icon: Utensils, label: "Restaurantes", color: "#ef4444" },
  hotel: { icon: Hotel, label: "Hoteles", color: "#8b5cf6" },
  transport: { icon: Bus, label: "Transporte", color: "#3ECF5E" },
  parking: { icon: Car, label: "Aparcamientos", color: "#3b82f6" },
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

function generatePOIs(team: Team): POI[] {
  const { lat, lng } = team.stadium.location
  
  return [
    // Bars
    { id: "bar-1", name: "Bar El Estadio", type: "bar", position: [lat + 0.003, lng + 0.002], description: "Ambiente deportivo, cerveza fría", distance: "300m", rating: 4.2, priceRange: "€€" },
    { id: "bar-2", name: "La Peña", type: "bar", position: [lat - 0.002, lng + 0.004], description: "Bar de aficionados locales", distance: "450m", rating: 4.0, priceRange: "€" },
    { id: "bar-3", name: "Cervecería Central", type: "bar", position: [lat + 0.004, lng - 0.003], description: "Gran variedad de cervezas", distance: "500m", rating: 4.5, priceRange: "€€" },
    // Restaurants
    { id: "rest-1", name: "Restaurante El Gol", type: "restaurant", position: [lat - 0.003, lng - 0.002], description: "Cocina tradicional española", distance: "350m", rating: 4.3, priceRange: "€€" },
    { id: "rest-2", name: "Pizzería Campeón", type: "restaurant", position: [lat + 0.002, lng + 0.005], description: "Pizzas artesanales", distance: "550m", rating: 4.1, priceRange: "€€" },
    { id: "rest-3", name: "Tapas & Fútbol", type: "restaurant", position: [lat - 0.004, lng + 0.001], description: "Tapas variadas con pantallas", distance: "400m", rating: 4.4, priceRange: "€€€" },
    // Hotels
    { id: "hotel-1", name: "Hotel Estadio", type: "hotel", position: [lat + 0.005, lng + 0.001], description: "3 estrellas, cerca del estadio", distance: "600m", rating: 3.8, priceRange: "€€" },
    { id: "hotel-2", name: "NH Collection", type: "hotel", position: [lat - 0.006, lng - 0.004], description: "4 estrellas, servicio premium", distance: "800m", rating: 4.5, priceRange: "€€€" },
    // Transport
    { id: "trans-1", name: "Estación Metro Estadio", type: "transport", position: [lat + 0.001, lng - 0.002], description: "Líneas principales, 5 min frecuencia", distance: "150m" },
    { id: "trans-2", name: "Parada Bus Principal", type: "transport", position: [lat - 0.001, lng + 0.003], description: "Líneas 15, 43, 67", distance: "200m" },
    { id: "trans-3", name: "Parada Taxi", type: "transport", position: [lat + 0.002, lng - 0.001], description: "Zona de recogida oficial", distance: "100m" },
    // Parking
    { id: "park-1", name: "Parking Norte", type: "parking", position: [lat + 0.004, lng + 0.004], description: "800 plazas, vigilado 24h", distance: "450m", priceRange: "10€" },
    { id: "park-2", name: "Parking Sur", type: "parking", position: [lat - 0.005, lng - 0.003], description: "500 plazas, cubierto", distance: "600m", priceRange: "12€" },
    { id: "park-3", name: "Parking Centro Comercial", type: "parking", position: [lat + 0.006, lng - 0.005], description: "300 plazas, gratis 2h compras", distance: "750m", priceRange: "8€" },
  ]
}

function generateSafeZones(team: Team): SafeZone[] {
  const { lat, lng } = team.stadium.location
  
  return [
    {
      id: "zone-1",
      name: "Zona Familiar",
      type: "safe",
      description: "Área tranquila con ambiente familiar, ideal para visitantes con niños.",
      tips: ["Buenos restaurantes", "Presencia policial", "Menos aglomeraciones"],
      position: [lat + 0.003, lng + 0.003],
    },
    {
      id: "zone-2",
      name: "Zona de Encuentro Neutral",
      type: "safe",
      description: "Punto de encuentro recomendado para aficionados visitantes.",
      tips: ["Bares mixtos", "Fácil acceso al estadio", "Ambiente relajado"],
      position: [lat - 0.002, lng + 0.004],
    },
    {
      id: "zone-3",
      name: "Grada de Animación Local",
      type: "caution",
      description: "Zona de la hinchada local más activa. Evitar colores visitantes.",
      tips: ["Ambiente muy intenso", "No recomendado con niños", "Evitar provocaciones"],
      position: [lat - 0.001, lng - 0.003],
    },
    {
      id: "zone-4",
      name: "Alrededores Grada Ultra",
      type: "avoid",
      description: "Zona próxima a la grada de animación local. No recomendada para visitantes.",
      tips: ["Evitar 2h antes y después", "No usar colores visitantes", "Usar rutas alternativas"],
      position: [lat - 0.004, lng - 0.002],
    },
  ]
}

export function VisitorMode({ team }: VisitorModeProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const routeRef = useRef<L.Polyline | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  
  const [isVisitorMode, setIsVisitorMode] = useState(false)
  const [showAvoidZones, setShowAvoidZones] = useState(true)
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>(["bar", "restaurant", "transport", "parking"])
  const [isMapReady, setIsMapReady] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [showRoute, setShowRoute] = useState(false)
  
  const [pois] = useState<POI[]>(() => generatePOIs(team))
  const [zones] = useState<SafeZone[]>(() => generateSafeZones(team))

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !isVisitorMode) return

    const { lat, lng } = team.stadium.location

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([lat, lng], 15)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Stadium marker
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
      .bindPopup(`<strong>${team.stadium.name}</strong><br/>${team.stadium.capacity.toLocaleString()} espectadores`)

    markersRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map
    setIsMapReady(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setIsMapReady(false)
      }
    }
  }, [team, isVisitorMode])

  // Update markers when filters change
  useEffect(() => {
    if (!isMapReady || !markersRef.current) return

    markersRef.current.clearLayers()

    // Add POI markers
    const visiblePOIs = pois.filter((poi) => activeFilters.includes(poi.type))
    visiblePOIs.forEach((poi) => {
      const config = categoryConfig[poi.type]
      const icon = L.divIcon({
        className: "custom-poi-marker",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${config.color};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <div style="width: 16px; height: 16px; color: white;">
              ${getIconSVG(poi.type)}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker(poi.position, { icon }).addTo(markersRef.current!)
      marker.on("click", () => setSelectedPOI(poi))
    })

    // Add zone circles
    if (showAvoidZones) {
      zones.forEach((zone) => {
        const color = zone.type === "safe" ? "#22c55e" : zone.type === "caution" ? "#f59e0b" : "#ef4444"
        L.circle(zone.position, {
          color,
          fillColor: color,
          fillOpacity: 0.2,
          radius: 150,
          weight: 2,
        })
          .addTo(markersRef.current!)
          .on("click", () => setSelectedZone(zone))
      })
    }
  }, [activeFilters, isMapReady, pois, zones, showAvoidZones])

  // Get user location
  const handleLocate = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setIsLocating(false)

          if (mapInstanceRef.current && markersRef.current) {
            // Remove old user marker
            if (userMarkerRef.current) {
              markersRef.current.removeLayer(userMarkerRef.current)
            }

            // Add new user marker
            const userIcon = L.divIcon({
              className: "user-location-marker",
              html: `
                <div style="
                  width: 20px;
                  height: 20px;
                  background: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })

            userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(markersRef.current)
              .bindPopup("Tu ubicación")

            mapInstanceRef.current.setView([latitude, longitude], 14)
          }
        },
        (error) => {
          setIsLocating(false)
          alert("No se pudo obtener tu ubicación. Asegúrate de dar permiso de ubicación.")
        },
        { enableHighAccuracy: true }
      )
    } else {
      setIsLocating(false)
      alert("Tu navegador no soporta geolocalización")
    }
  }

  // Calculate route to stadium
  const handleCalculateRoute = () => {
    if (!userLocation || !mapInstanceRef.current || !markersRef.current) {
      alert("Primero activa tu ubicación para calcular la ruta")
      return
    }

    // Remove old route
    if (routeRef.current) {
      markersRef.current.removeLayer(routeRef.current)
    }

    const { lat, lng } = team.stadium.location
    
    // Create a simple route line (in production, would use routing API)
    routeRef.current = L.polyline([userLocation, [lat, lng]], {
      color: "#3ECF5E",
      weight: 4,
      opacity: 0.8,
      dashArray: "10, 10",
    }).addTo(markersRef.current)

    // Fit bounds to show both points
    mapInstanceRef.current.fitBounds([userLocation, [lat, lng]], { padding: [50, 50] })
    setShowRoute(true)
  }

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
          {/* Map Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5 text-accent" />
                Filtros del Mapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon
                  const isActive = activeFilters.includes(key)
                  return (
                    <Button
                      key={key}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(key)}
                      style={{
                        backgroundColor: isActive ? config.color : undefined,
                        borderColor: isActive ? config.color : undefined,
                      }}
                      className={isActive ? "text-white hover:opacity-90" : "bg-transparent"}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {config.label}
                    </Button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Mostrar zonas a evitar</Label>
                <Switch checked={showAvoidZones} onCheckedChange={setShowAvoidZones} />
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <div ref={mapRef} className="h-[400px] md:h-[500px] w-full" />

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleLocate}
                  disabled={isLocating}
                  className="bg-background shadow-md"
                >
                  <Locate className={`w-4 h-4 ${isLocating ? "animate-pulse" : ""}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleCalculateRoute}
                  className="bg-background shadow-md"
                  disabled={!userLocation}
                >
                  <Route className="w-4 h-4" />
                </Button>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-background/95 rounded-lg p-3 shadow-md z-[1000]">
                <div className="text-xs font-semibold mb-2">Leyenda</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-xs">Zona Segura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Precaución</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">Evitar</span>
                  </div>
                </div>
              </div>

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

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleLocate}
              disabled={isLocating}
            >
              <Locate className="w-4 h-4 mr-2" />
              {isLocating ? "Localizando..." : "Mi Ubicación"}
            </Button>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={handleCalculateRoute}
              disabled={!userLocation}
            >
              <Route className="w-4 h-4 mr-2" />
              Calcular Ruta
            </Button>
          </div>

          {/* Selected POI Details */}
          {selectedPOI && (
            <Card className="border-accent">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {(() => {
                      const config = categoryConfig[selectedPOI.type]
                      const Icon = config.icon
                      return (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: config.color }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      )
                    })()}
                    <div>
                      <h4 className="font-semibold mb-1">{selectedPOI.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{selectedPOI.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{categoryConfig[selectedPOI.type].label}</Badge>
                        <Badge variant="outline">{selectedPOI.distance}</Badge>
                        {selectedPOI.rating && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {selectedPOI.rating}
                          </Badge>
                        )}
                        {selectedPOI.priceRange && (
                          <Badge variant="outline">{selectedPOI.priceRange}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPOI(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                    onClick={() => {
                      const [lat, lng] = selectedPOI.position
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Zone Details */}
          {selectedZone && (
            <Card className={`border-2 ${selectedZone.type === "safe" ? "border-accent" : selectedZone.type === "caution" ? "border-yellow-500" : "border-red-500"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {(() => {
                      const Icon = getZoneIcon(selectedZone.type)
                      return (
                        <div className={`w-10 h-10 ${getZoneColor(selectedZone.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      )
                    })()}
                    <div>
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
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zone List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Layers className="w-5 h-5 text-accent" />
                Zonas del Estadio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.map((zone) => {
                const Icon = getZoneIcon(zone.type)
                return (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                      selectedZone?.id === zone.id ? (zone.type === "safe" ? "border-accent" : zone.type === "caution" ? "border-yellow-500" : "border-red-500") : "border-border"
                    }`}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getZoneColor(zone.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
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
            <CardHeader className="pb-3">
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
        </>
      )}
    </div>
  )
}

// Helper function to get SVG icons for markers
function getIconSVG(type: string): string {
  const icons: Record<string, string> = {
    bar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
    restaurant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
    transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
    parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  }
  return icons[type] || icons.bar
}
