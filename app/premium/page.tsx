"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PremiumSubscription } from "@/components/premium-subscription"
import { useToast } from "@/hooks/use-toast"
import { useI18nStore } from "@/lib/stores"
import { Crown, Check, X, Zap, Award, TrendingUp, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

function PremiumContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t, locale } = useI18nStore()

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: locale === "es" ? "Pago completado!" : "Payment completed!",
        description: locale === "es" 
          ? "Tu suscripcion premium esta ahora activa. Disfruta de todas las funciones!"
          : "Your premium subscription is now active. Enjoy all features!",
      })
    }
    if (searchParams.get("cancelled") === "true") {
      toast({
        title: locale === "es" ? "Pago cancelado" : "Payment cancelled",
        description: locale === "es"
          ? "El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras."
          : "The payment process was cancelled. You can try again anytime.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast, locale])

  const benefits = [
    {
      icon: Zap,
      title: locale === "es" ? "Sin publicidad" : "No ads",
      description: locale === "es" 
        ? "Experiencia limpia sin interrupciones publicitarias"
        : "Clean experience without ad interruptions",
    },
    {
      icon: Award,
      title: locale === "es" ? "Insignias exclusivas" : "Exclusive badges",
      description: locale === "es"
        ? "Destácate en la comunidad con insignias premium"
        : "Stand out in the community with premium badges",
    },
    {
      icon: TrendingUp,
      title: locale === "es" ? "Estadísticas avanzadas" : "Advanced statistics",
      description: locale === "es"
        ? "Análisis detallados de estadios y equipos"
        : "Detailed analysis of stadiums and teams",
    },
    {
      icon: Users,
      title: locale === "es" ? "Acceso prioritario" : "Priority access",
      description: locale === "es"
        ? "Sé el primero en probar nuevas funciones"
        : "Be the first to try new features",
    },
  ]

  const featureComparison = [
    {
      feature: locale === "es" ? "Ver todos los estadios" : "View all stadiums",
      free: true,
      fan: true,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Crear posts en comunidad" : "Create community posts",
      free: false,
      fan: true,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Guardar lugares favoritos" : "Save favorite venues",
      free: false,
      fan: true,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Reservas básicas" : "Basic reservations",
      free: false,
      fan: true,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Modo visitante avanzado" : "Advanced visitor mode",
      free: false,
      fan: true,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Comparador de estadios" : "Stadium comparator",
      free: false,
      fan: true,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Reservas prioritarias" : "Priority reservations",
      free: false,
      fan: false,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Densidad de aforo en tiempo real" : "Real-time crowd density",
      free: false,
      fan: false,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Plazas parking VIP" : "VIP parking spots",
      free: false,
      fan: false,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Zonas exclusivas de fans" : "Exclusive fan zones",
      free: false,
      fan: false,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Planificador IA del día de partido" : "Match day AI planner",
      free: false,
      fan: false,
      ultra: true,
    },
    {
      feature: locale === "es" ? "Acceso anticipado a funciones" : "Early feature access",
      free: false,
      fan: false,
      ultra: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
            <Crown className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {locale === "es" ? "Soccer Maps Premium" : "Soccer Maps Premium"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {locale === "es"
              ? "Desbloquea todo el potencial de Soccer Maps con funciones exclusivas para los verdaderos aficionados de La Liga"
              : "Unlock the full potential of Soccer Maps with exclusive features for true La Liga fans"}
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            )
          })}
        </div>

        {/* Subscription plans */}
        <div className="mb-16">
          <PremiumSubscription />
        </div>

        {/* Feature comparison table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {locale === "es" ? "Comparativa de planes" : "Plans comparison"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">
                    {locale === "es" ? "Características" : "Features"}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    {locale === "es" ? "Gratis" : "Free"}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">Fan</th>
                  <th className="text-center py-4 px-4 font-semibold">Ultra</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {row.free ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.fan ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.ultra ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            {locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
          </h2>
          <div className="space-y-6">
            {[
              {
                q: locale === "es" ? "Puedo cambiar de plan en cualquier momento?" : "Can I change my plan anytime?",
                a: locale === "es"
                  ? "Si, puedes mejorar o cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente y se prorratea la diferencia."
                  : "Yes, you can upgrade or change your plan anytime. Changes apply immediately and differences are prorated.",
              },
              {
                q: locale === "es" ? "Como funciona la cancelacion?" : "How does cancellation work?",
                a: locale === "es"
                  ? "Puedes cancelar tu suscripcion en cualquier momento. Mantendras acceso a las funciones premium hasta el final de tu periodo de facturacion actual."
                  : "You can cancel anytime. You'll keep access to premium features until the end of your current billing period.",
              },
              {
                q: locale === "es" ? "Que metodos de pago aceptan?" : "What payment methods do you accept?",
                a: locale === "es"
                  ? "Aceptamos todas las tarjetas de credito y debito principales, Apple Pay, Google Pay y PayPal a traves de Stripe, nuestra plataforma de pagos segura."
                  : "We accept all major credit/debit cards, Apple Pay, Google Pay, and PayPal through Stripe, our secure payment platform.",
              },
              {
                q: locale === "es" ? "Hay garantia de devolucion?" : "Is there a money-back guarantee?",
                a: locale === "es"
                  ? "Si, ofrecemos una garantia de devolucion de 14 dias. Si no estas satisfecho, te devolvemos el dinero sin preguntas."
                  : "Yes, we offer a 14-day money-back guarantee. If you're not satisfied, we'll refund you with no questions asked.",
              },
            ].map((faq, idx) => (
              <div key={idx}>
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      {typeof window !== 'undefined' && localStorage.getItem('soccer-maps-i18n') 
        ? JSON.parse(localStorage.getItem('soccer-maps-i18n') || '{}').state?.locale === 'es'
          ? "Cargando..."
          : "Loading..."
        : "Loading..."}
    </div>}>
      <PremiumContent />
    </Suspense>
  )
}
