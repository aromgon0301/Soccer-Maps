"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Clock,
  Users,
  Star,
  Navigation,
  Coffee,
  Utensils,
  Car,
  Check,
  ChevronRight,
  Loader2,
  Bookmark,
  AlertCircle,
  Heart,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useUserStore, useReservationsStore, usePoisStore } from "@/lib/stores"
import type { POI } from "@/lib/stores"
import type { Team } from "@/lib/teams-data"

interface ReservationsSystemProps {
  team: Team
}

const venueTypeConfig = {
  bar: { icon: Coffee, label: "Bares", color: "bg-orange-500" },
  restaurant: { icon: Utensils, label: "Restaurantes", color: "bg-red-500" },
  parking: { icon: Car, label: "Parkings", color: "bg-blue-500" },
}

const atmosphereLabels = {
  tranquilo: "Tranquilo",
  animado: "Animado",
  familiar: "Familiar",
  hinchada: "Zona Hinchada",
}

export function ReservationsSystem({ team }: ReservationsSystemProps) {
  const { toast } = useToast()
  const { profile, favoritePois, toggleFavoritePoi, initializeUser, isInitialized } = useUserStore()
  const { createReservation } = useReservationsStore()
  const { getPoisByTeam } = usePoisStore()

  const [activeTab, setActiveTab] = useState<"bar" | "restaurant" | "parking">("bar")
  const [selectedVenue, setSelectedVenue] = useState<POI | null>(null)
  const [showReservationDialog, setShowReservationDialog] = useState(false)
  const [reservationStep, setReservationStep] = useState<"form" | "confirm" | "success">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [lastReservation, setLastReservation] = useState<{
    confirmationCode: string
    poiName: string
  } | null>(null)
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    time: "18:00",
    matchDate: new Date().toISOString().split("T")[0],
  })

  // Initialize user if needed
  useEffect(() => {
    if (!isInitialized) {
      initializeUser()
    }
  }, [isInitialized, initializeUser])

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setReservationData((prev) => ({
        ...prev,
        name: profile.name !== "Aficionado" ? profile.name : prev.name,
        email: profile.email || prev.email,
      }))
    }
  }, [profile])

  const venues = getPoisByTeam(team.id)
  const filteredVenues = venues.filter((v) => v.type === activeTab)

  const handleReserve = (venue: POI) => {
    setSelectedVenue(venue)
    setReservationStep("form")
    setShowReservationDialog(true)
  }

  const handleConfirmReservation = () => {
    if (!reservationData.name || !reservationData.email) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, rellena nombre y email",
        variant: "destructive",
      })
      return
    }
    setReservationStep("confirm")
  }

  const handleFinalizeReservation = async () => {
    if (!selectedVenue || !profile) return

    setIsLoading(true)

    // Create real reservation in store
    const reservation = createReservation({
      userId: profile.id,
      userName: reservationData.name,
      userEmail: reservationData.email,
      userPhone: reservationData.phone,
      poiId: selectedVenue.id,
      poiName: selectedVenue.name,
      poiType: selectedVenue.type as "bar" | "restaurant" | "parking",
      teamId: team.id,
      teamName: team.name,
      stadiumName: team.stadium.name,
      matchDate: reservationData.matchDate,
      guests: Number.parseInt(reservationData.guests),
      time: reservationData.time,
      price: selectedVenue.reservationPrice,
    })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLastReservation({
      confirmationCode: reservation.confirmationCode,
      poiName: selectedVenue.name,
    })

    setIsLoading(false)
    setReservationStep("success")

    toast({
      title: "Reserva confirmada",
      description: `Tu reserva en ${selectedVenue.name} ha sido confirmada`,
    })
  }

  const handleCloseDialog = () => {
    setShowReservationDialog(false)
    setSelectedVenue(null)
    setReservationStep("form")
    setLastReservation(null)
  }

  const handleToggleFavorite = (poiId: string) => {
    toggleFavoritePoi(poiId)
    const isFavorite = favoritePois.includes(poiId)
    toast({
      title: isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: isFavorite ? "El local ha sido eliminado de tus favoritos" : "El local ha sido añadido a favoritos",
    })
  }

  const handleOpenMaps = (venue: POI) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`
    window.open(url, "_blank")
  }

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 50) return "text-accent"
    if (occupancy < 75) return "text-yellow-500"
    return "text-red-500"
  }

  // Get smart recommendation based on user preferences
  const getSmartRecommendation = () => {
    if (!profile) return null

    const preferredAtmosphere = profile.atmospherePreference
    const relevantVenues = venues.filter((v) => v.type === "bar" || v.type === "restaurant")

    // Find venue matching user preferences
    const recommended = relevantVenues.find((v) => v.atmosphere === preferredAtmosphere) || relevantVenues[0]

    return recommended
  }

  const smartRecommendation = getSmartRecommendation()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent" />
            Reservas para el Día de Partido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Reserva bares, restaurantes y parkings cerca del {team.stadium.name}. Precios especiales día de partido,
            confirmación inmediata y ruta automática al estadio.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Check className="w-3 h-3 mr-1" />
              Confirmación inmediata
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Navigation className="w-3 h-3 mr-1" />
              Ruta incluida
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Star className="w-3 h-3 mr-1" />
              Opiniones verificadas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(venueTypeConfig).map(([key, config]) => {
            const Icon = config.icon
            const count = venues.filter((v) => v.type === key).length
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.keys(venueTypeConfig).map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {venues
                .filter((v) => v.type === type)
                .map((venue) => {
                  const config = venueTypeConfig[venue.type as keyof typeof venueTypeConfig]
                  if (!config) return null
                  const Icon = config.icon
                  const isFavorite = favoritePois.includes(venue.id)

                  return (
                    <Card key={venue.id} className="overflow-hidden hover:border-accent transition-colors">
                      <CardContent className="p-0">
                        {/* Venue Header */}
                        <div className={`${config.color} p-4 text-white`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold">{venue.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-white/90">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{venue.rating}</span>
                                  <span>({venue.reviewCount} opiniones)</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={() => handleToggleFavorite(venue.id)}
                              >
                                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                              </Button>
                              <Badge className="bg-white/20 text-white border-0">{venue.priceRange}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Venue Details */}
                        <div className="p-4 space-y-4">
                          {/* Distance & Time */}
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{venue.distance}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{venue.walkingTime} caminando</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {atmosphereLabels[venue.atmosphere]}
                            </Badge>
                          </div>

                          {/* Occupancy */}
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Ocupación estimada
                              </span>
                              <span className={`font-semibold ${getOccupancyColor(venue.estimatedOccupancy)}`}>
                                {venue.estimatedOccupancy}%
                              </span>
                            </div>
                            <Progress value={venue.estimatedOccupancy} className="h-2" />
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1">
                            {venue.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          {/* Hours */}
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Día partido: {venue.matchDayHours}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-border">
                            {venue.acceptsReservations ? (
                              <Button
                                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                                onClick={() => handleReserve(venue)}
                              >
                                Reservar{venue.reservationPrice > 0 ? ` · ${venue.reservationPrice}€` : ""}
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            ) : (
                              <Button className="flex-1 bg-transparent" variant="outline" disabled>
                                Sin reserva previa
                              </Button>
                            )}
                            <Button variant="outline" size="icon" onClick={() => handleOpenMaps(venue)}>
                              <Navigation className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
            {filteredVenues.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay locales de este tipo registrados</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Smart Recommendation */}
      {smartRecommendation && profile && (
        <Card className="bg-accent/5 border-accent">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">Reserva Inteligente</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Basándonos en tu perfil ({profile.fanType}) y preferencia de ambiente ({profile.atmospherePreference}
                  ), te recomendamos:
                </p>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-semibold">{smartRecommendation.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        · {atmosphereLabels[smartRecommendation.atmosphere]} · {smartRecommendation.distance}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => handleReserve(smartRecommendation)}
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservation Dialog */}
      <Dialog open={showReservationDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          {reservationStep === "form" && selectedVenue && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const config = venueTypeConfig[selectedVenue.type as keyof typeof venueTypeConfig]
                    const Icon = config?.icon || Coffee
                    return <Icon className="w-5 h-5 text-accent" />
                  })()}
                  Reservar en {selectedVenue.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedVenue.distance} del estadio · {selectedVenue.walkingTime} caminando
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={reservationData.name}
                      onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={reservationData.phone}
                      onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={reservationData.email}
                    onChange={(e) => setReservationData({ ...reservationData, email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guests">Personas</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="20"
                      value={reservationData.guests}
                      onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={reservationData.time}
                      onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationData.matchDate}
                      onChange={(e) => setReservationData({ ...reservationData, matchDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmReservation}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Continuar
                </Button>
              </DialogFooter>
            </>
          )}

          {reservationStep === "confirm" && selectedVenue && (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Reserva</DialogTitle>
                <DialogDescription>Revisa los detalles antes de confirmar</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local:</span>
                    <span className="font-semibold">{selectedVenue.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span>{reservationData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span>{new Date(reservationData.matchDate).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Personas:</span>
                    <span>{reservationData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora:</span>
                    <span>{reservationData.time}</span>
                  </div>
                  {selectedVenue.reservationPrice > 0 && (
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-accent">{selectedVenue.reservationPrice}€</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Al confirmar, recibirás la ruta optimizada al estadio. La reserva aparecerá en tu perfil.</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReservationStep("form")}>
                  Atrás
                </Button>
                <Button
                  onClick={handleFinalizeReservation}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar
                      {selectedVenue.reservationPrice > 0 ? ` · ${selectedVenue.reservationPrice}€` : ""}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {reservationStep === "success" && lastReservation && (
            <>
              <DialogHeader>
                <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-accent-foreground" />
                </div>
                <DialogTitle className="text-center">Reserva Confirmada</DialogTitle>
                <DialogDescription className="text-center">
                  Te hemos enviado los detalles a {reservationData.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-accent/10 border border-accent rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{lastReservation.poiName}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {reservationData.guests} personas · {reservationData.time} ·{" "}
                    {new Date(reservationData.matchDate).toLocaleDateString("es-ES")}
                  </p>
                  <p className="text-xs text-muted-foreground">Código: {lastReservation.confirmationCode}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => selectedVenue && handleOpenMaps(selectedVenue)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver ruta
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en perfil
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCloseDialog}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
