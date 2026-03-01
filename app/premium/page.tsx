"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PremiumSubscription } from "@/components/premium-subscription"
import { useToast } from "@/hooks/use-toast"
import { Crown } from "lucide-react"
import { useI18n } from "@/lib/i18n"

function PremiumContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useI18n()

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Pago completado!", description: "Tu suscripcion premium esta ahora activa." })
    }
    if (searchParams.get("cancelled") === "true") {
      toast({ title: "Pago cancelado", description: "El proceso de pago fue cancelado.", variant: "destructive" })
    }
  }, [searchParams, toast])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-3 sm:mb-4">
            <Crown className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-balance">
            {t("premiumHeroTitle")}
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-2">
            {t("premiumHeroSubtitle")}
          </p>
        </div>

        {/* Subscription plans */}
        <PremiumSubscription />

        {/* FAQ section */}
        <section className="mt-10 sm:mt-12 md:mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">{t("faqTitle")}</h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: "Puedo cambiar de plan en cualquier momento?",
                a: "Si, puedes mejorar o cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente y se prorratea la diferencia.",
              },
              {
                q: "Como funciona la cancelacion?",
                a: "Puedes cancelar tu suscripcion en cualquier momento. Mantendras acceso a las funciones premium hasta el final de tu periodo de facturacion actual.",
              },
              {
                q: "Que metodos de pago aceptan?",
                a: "Aceptamos todas las tarjetas de credito y debito principales a traves de Stripe.",
              },
              {
                q: "Hay garantia de devolucion?",
                a: "Si, ofrecemos una garantia de devolucion de 14 dias. Si no estas satisfecho, te devolvemos el dinero sin preguntas.",
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">{item.q}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
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
