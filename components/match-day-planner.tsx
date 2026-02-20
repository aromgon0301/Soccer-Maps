"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Clock,
  MapPin,
  Navigation,
  Coffee,
  RouteIcon,
  LogIn,
  LogOut,
  CheckCircle2,
  Share2,
  Download,
  AlertCircle,
  Car,
  Bus,
  Train,
  Bike,
} from "lucide-react"
import type { Team } from "@/lib/teams-data"

interface MatchDayPlannerProps {
  team: Team
}

export function MatchDayPlanner({ team }: MatchDayPlannerProps) {
  const [step, setStep] = useState(1)
  const [transport, setTransport] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [preferences, setPreferences] = useState("")
  const [planCompleted, setPlanCompleted] = useState(false)

  const totalSteps = 5

  const handleComplete = () => {
    setPlanCompleted(true)
  }

  const handleReset = () => {
    setStep(1)
    setTransport("")
    setArrivalTime("")
    setPreferences("")
    setPlanCompleted(false)
  }

  const getRecommendedArrival = () => {
    if (arrivalTime === "early") return "2 horas antes del partido"
    if (arrivalTime === "moderate") return "1.5 horas antes del partido"
    return "1 hora antes del partido"
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "metro":
        return <Train className="w-5 h-5" />
      case "bus":
        return <Bus className="w-5 h-5" />
      case "car":
        return <Car className="w-5 h-5" />
      case "bike":
        return <Bike className="w-5 h-5" />
      default:
        return <Navigation className="w-5 h-5" />
    }
  }

  if (planCompleted) {
    return (
      <Card className="border-accent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-display flex items-center gap-2 text-accent">
                <CheckCircle2 className="w-6 h-6" />
                Plan Completado
              </CardTitle>
              <CardDescription>Tu guía para el día del partido en {team.stadium.name}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Crear Nuevo Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Hora de Llegada Recomendada</h4>
                  <p className="text-sm text-muted-foreground">{getRecommendedArrival()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Llega con tiempo para evitar aglomeraciones</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                {getTransportIcon(transport)}
                <div>
                  <h4 className="font-semibold mb-1">Transporte Seleccionado</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {transport === "metro" && "Metro - Línea recomendada hacia el estadio"}
                    {transport === "bus" && "Autobús - Líneas con parada cerca del estadio"}
                    {transport === "car" && "Coche - Parkings disponibles a 10-15 min caminando"}
                    {transport === "bike" && "Bicicleta - Aparcamientos de bicis disponibles"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Coffee className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Bar Previo Sugerido</h4>
                  <p className="text-sm text-muted-foreground">Bar Los Aficionados - 500m del estadio</p>
                  <p className="text-xs text-muted-foreground mt-1">Ambiente familiar, tapas y pantallas</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <RouteIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Ruta Óptima al Estadio</h4>
                  <p className="text-sm text-muted-foreground">
                    Desde el bar, camina por Av. Principal hacia la entrada norte (8 min)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <LogIn className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Hora Ideal para Entrar</h4>
                  <p className="text-sm text-muted-foreground">30 minutos antes del inicio</p>
                  <p className="text-xs text-muted-foreground mt-1">Evita colas y disfruta del ambiente previo</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <LogOut className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Consejos de Salida</h4>
                  <p className="text-sm text-muted-foreground">
                    Espera 10-15 min tras el pitido final para evitar aglomeraciones en metro/salidas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-accent/10 border border-accent rounded-lg">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
            <p className="text-sm">
              <strong>Consejo Extra:</strong> Descarga este plan en modo offline antes de salir de casa
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir Plan
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Guardar Offline
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="font-display">Planificador de Día de Partido</CardTitle>
            <CardDescription>Guía paso a paso para tu visita a {team.stadium.name}</CardDescription>
          </div>
          <Badge variant="secondary">
            Paso {step} de {totalSteps}
          </Badge>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div key={idx} className={`h-2 flex-1 rounded-full ${idx < step ? "bg-accent" : "bg-muted"}`} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-accent" />
                ¿Cómo llegarás al estadio?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona tu medio de transporte preferido para recibir recomendaciones personalizadas
              </p>
            </div>
            <RadioGroup value={transport} onValueChange={setTransport}>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <RadioGroupItem value="metro" id="metro" className="peer sr-only" />
                  <Label
                    htmlFor="metro"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <Train className="w-8 h-8" />
                    <span className="font-semibold">Metro</span>
                    <span className="text-xs text-center">Rápido y económico</span>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="bus" id="bus" className="peer sr-only" />
                  <Label
                    htmlFor="bus"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <Bus className="w-8 h-8" />
                    <span className="font-semibold">Autobús</span>
                    <span className="text-xs text-center">Flexible y directo</span>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="car" id="car" className="peer sr-only" />
                  <Label
                    htmlFor="car"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <Car className="w-8 h-8" />
                    <span className="font-semibold">Coche</span>
                    <span className="text-xs text-center">Comodidad y libertad</span>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="bike" id="bike" className="peer sr-only" />
                  <Label
                    htmlFor="bike"
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <Bike className="w-8 h-8" />
                    <span className="font-semibold">Bicicleta</span>
                    <span className="text-xs text-center">Sostenible y saludable</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                ¿Cuándo prefieres llegar?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Te ayudaremos a calcular la hora ideal de salida según tu preferencia
              </p>
            </div>
            <RadioGroup value={arrivalTime} onValueChange={setArrivalTime}>
              <div className="space-y-3">
                <div className="relative">
                  <RadioGroupItem value="early" id="early" className="peer sr-only" />
                  <Label
                    htmlFor="early"
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Con mucha antelación (2+ horas antes)</div>
                      <p className="text-xs text-muted-foreground">
                        Tiempo para bar previo, ambiente y entrar sin prisas
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="moderate" id="moderate" className="peer sr-only" />
                  <Label
                    htmlFor="moderate"
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Con tiempo suficiente (1-2 horas antes)</div>
                      <p className="text-xs text-muted-foreground">
                        Balance perfecto entre comodidad y no esperar demasiado
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="just-in-time" id="just-in-time" className="peer sr-only" />
                  <Label
                    htmlFor="just-in-time"
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Justo a tiempo (30-60 min antes)</div>
                      <p className="text-xs text-muted-foreground">
                        Llega directo al estadio sin mucho margen de error
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-accent" />
                ¿Qué ambiente prefieres?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Te recomendaremos lugares según tus preferencias</p>
            </div>
            <RadioGroup value={preferences} onValueChange={setPreferences}>
              <div className="space-y-3">
                <div className="relative">
                  <RadioGroupItem value="family" id="family" className="peer sr-only" />
                  <Label
                    htmlFor="family"
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Familiar</div>
                      <p className="text-xs text-muted-foreground">
                        Lugares tranquilos, aptos para niños, con opciones variadas
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="fan-atmosphere" id="fan-atmosphere" className="peer sr-only" />
                  <Label
                    htmlFor="fan-atmosphere"
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Ambiente Aficionado</div>
                      <p className="text-xs text-muted-foreground">
                        Bares con seguidores, cánticos, pantallas y energía alta
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="quiet" id="quiet" className="peer sr-only" />
                  <Label
                    htmlFor="quiet"
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Tranquilo</div>
                      <p className="text-xs text-muted-foreground">
                        Lugares relajados para comer y hablar antes del partido
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Revisión de tu plan
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Confirma que todo está correcto antes de generar tu guía completa
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Transporte:</span>
                <span className="text-sm capitalize flex items-center gap-2">
                  {getTransportIcon(transport)}
                  {transport}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Llegada:</span>
                <span className="text-sm">{getRecommendedArrival()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Ambiente:</span>
                <span className="text-sm capitalize">
                  {preferences === "family" && "Familiar"}
                  {preferences === "fan-atmosphere" && "Ambiente Aficionado"}
                  {preferences === "quiet" && "Tranquilo"}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 text-center py-8">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold">¡Tu plan está listo!</h3>
            <p className="text-muted-foreground">
              Hemos creado una guía completa personalizada para tu visita a {team.stadium.name}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {step > 1 && step < 5 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Anterior
            </Button>
          )}
          {step < 4 && (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={(step === 1 && !transport) || (step === 2 && !arrivalTime) || (step === 3 && !preferences)}
            >
              Siguiente
            </Button>
          )}
          {step === 4 && (
            <Button onClick={() => setStep(5)} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              Generar Plan
            </Button>
          )}
          {step === 5 && (
            <Button onClick={handleComplete} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              Ver Plan Completo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
