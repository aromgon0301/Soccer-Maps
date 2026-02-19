"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PremiumSubscription } from "@/components/premium-subscription"
import { useToast } from "@/hooks/use-toast"
import { Crown } from "lucide-react"

function PremiumContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Pago completado!",
        description: "Tu suscripcion premium esta ahora activa. Disfruta de todas las funciones!",
      })
    }
    if (searchParams.get("cancelled") === "true") {
      toast({
        title: "Pago cancelado",
        description: "El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
            <Crown className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Soccer Maps Premium</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desbloquea todo el potencial de Soccer Maps con funciones exclusivas para los verdaderos aficionados de La
            Liga
          </p>
        </div>

        {/* Subscription plans */}
        <PremiumSubscription />

        {/* FAQ section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Puedo cambiar de plan en cualquier momento?</h3>
              <p className="text-muted-foreground">
                Si, puedes mejorar o cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente y se
                prorratea la diferencia.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Como funciona la cancelacion?</h3>
              <p className="text-muted-foreground">
                Puedes cancelar tu suscripcion en cualquier momento. Mantendras acceso a las funciones premium hasta el
                final de tu periodo de facturacion actual.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Que metodos de pago aceptan?</h3>
              <p className="text-muted-foreground">
                Aceptamos todas las tarjetas de credito y debito principales a traves de Stripe, nuestra plataforma de
                pagos segura.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Hay garantia de devolucion?</h3>
              <p className="text-muted-foreground">
                Si, ofrecemos una garantia de devolucion de 14 dias. Si no estas satisfecho, te devolvemos el dinero sin
                preguntas.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function PremiumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <PremiumContent />
    </Suspense>
  )
}
