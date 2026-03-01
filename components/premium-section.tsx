"use client"

import { Crown, Lock, Download, Bell, Map, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PremiumSection() {
  const premiumFeatures = [
    {
      icon: Map,
      title: "Mapas Offline",
      description: "Descarga mapas del estadio y alrededores para usar sin conexión",
    },
    {
      icon: Bell,
      title: "Alertas Personalizadas",
      description: "Notificaciones en tiempo real sobre tráfico, accesos y ambiente",
    },
    {
      icon: Star,
      title: "Mejores Asientos",
      description: "Guía detallada de los mejores sectores según preferencias",
    },
    {
      icon: Download,
      title: "Guías Exclusivas",
      description: "Contenido premium sobre historia, récords y momentos épicos",
    },
  ]

  const seatingInfo = [
    {
      category: "Mejores Vistas",
      seats: "Tribuna Central, filas 15-25",
      premium: true,
    },
    {
      category: "Más Ambiente",
      seats: "Fondo Norte, cualquier fila",
      premium: true,
    },
    {
      category: "Zona Familiar",
      seats: "Lateral Este, sectores 200-210",
      premium: true,
    },
    {
      category: "Premium VIP",
      seats: "Palcos centrales",
      premium: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Premium Unlock Card */}
      <Card className="border-accent bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <Crown className="w-6 h-6 text-accent" />
              Soccer Maps Premium
            </CardTitle>
            <Badge className="bg-accent text-accent-foreground">Exclusivo</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Desbloquea funciones exclusivas para vivir la experiencia definitiva en el estadio
          </p>
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Crown className="w-5 h-5 mr-2" />
            Hazte Premium
          </Button>
        </CardContent>
      </Card>

      {/* Seating Information - Locked */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95 z-10 flex items-end justify-center pb-8">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Lock className="w-5 h-5 mr-2" />
            Desbloquear Información de Asientos
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Star className="w-5 h-5 text-muted-foreground" />
            Información de Asientos Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-sm pointer-events-none">
          <div className="space-y-3">
            {seatingInfo.map((info, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{info.category}</div>
                  <Crown className="w-4 h-4 text-accent" />
                </div>
                <div className="text-sm text-muted-foreground">{info.seats}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {premiumFeatures.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Card key={idx} className="hover:border-accent transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pricing Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Plan Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold">9,99€</span>
            <span className="text-muted-foreground mb-1">/mes</span>
          </div>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Mapas offline de todos los estadios
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Alertas en tiempo real
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Guía completa de asientos
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Contenido exclusivo del club
            </li>
          </ul>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Comenzar prueba gratuita de 7 días
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
