"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useSubscriptionStore, useI18nStore } from "@/lib/stores"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Calendar, 
  AlertCircle, 
  Check, 
  CreditCard, 
  Receipt,
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"

// Demo payment history data
const DEMO_PAYMENT_HISTORY = [
  {
    id: "inv_demo_001",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 999,
    currency: "eur",
    status: "paid" as const,
    description: "Soccer Maps Ultra - Monthly",
  },
  {
    id: "inv_demo_002",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 999,
    currency: "eur",
    status: "paid" as const,
    description: "Soccer Maps Ultra - Monthly",
  },
  {
    id: "inv_demo_003",
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 499,
    currency: "eur",
    status: "paid" as const,
    description: "Soccer Maps Fan - Monthly",
  },
]

interface PaymentRecord {
  id: string
  date: string
  amount: number
  currency: string
  status: "paid" | "pending" | "failed"
  description: string
}

export default function SubscriptionPage() {
  const { subscription, getPlan, cancelSubscription, reactivateSubscription, isLoading } = useSubscriptionStore()
  const { locale } = useI18nStore()
  const [mounted, setMounted] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)

  useEffect(() => {
    setMounted(true)
    // In a real app, fetch payment history from your backend
    // For demo, we use mock data
    setPaymentHistory(DEMO_PAYMENT_HISTORY)
  }, [])

  if (!mounted) return null

  const plan = getPlan()
  const isActive = subscription?.status === "active"
  const isCancelled = subscription?.cancelAtPeriodEnd

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const handleOpenBillingPortal = async () => {
    if (!subscription?.stripeCustomerId) {
      // Demo mode - show message
      alert(locale === "es" 
        ? "Portal de facturacion no disponible en modo demo" 
        : "Billing portal not available in demo mode")
      return
    }

    setIsOpeningPortal(true)
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: subscription.stripeCustomerId,
          returnUrl: window.location.href,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error)
    } finally {
      setIsOpeningPortal(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return locale === "es" ? "Pagado" : "Paid"
      case "pending":
        return locale === "es" ? "Pendiente" : "Pending"
      case "failed":
        return locale === "es" ? "Fallido" : "Failed"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-amber-500" />
            {locale === "es" ? "Mi Suscripcion" : "My Subscription"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "es"
              ? "Gestiona tu plan, metodos de pago e historial de facturacion"
              : "Manage your plan, payment methods, and billing history"}
          </p>
        </div>

        {!subscription ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-6">
              {locale === "es"
                ? "Actualmente no tienes una suscripcion activa"
                : "You don't have an active subscription"}
            </p>
            <Link href="/premium">
              <Button size="lg">
                {locale === "es" ? "Ver planes Premium" : "View Premium plans"}
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Current plan card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {locale === "es" ? plan.nameEs : plan.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {subscription.billingCycle === "yearly"
                          ? locale === "es" ? "Facturacion anual" : "Annual billing"
                          : locale === "es" ? "Facturacion mensual" : "Monthly billing"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{formatCurrency(plan.price * 100, "eur")}</div>
                    <div className="text-sm text-muted-foreground">
                      /{subscription.billingCycle === "yearly" 
                        ? (locale === "es" ? "ano" : "year") 
                        : (locale === "es" ? "mes" : "month")}
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {locale === "es" ? "Estado" : "Status"}
                    </h3>
                    {isActive && !isCancelled && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        {locale === "es" ? "Activo" : "Active"}
                      </Badge>
                    )}
                    {isCancelled && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {locale === "es" ? "Cancelacion programada" : "Cancellation scheduled"}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {isCancelled 
                        ? (locale === "es" ? "Acceso hasta" : "Access until")
                        : (locale === "es" ? "Proxima facturacion" : "Next billing")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    </div>
                  </div>
                </div>

                {isCancelled && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      {locale === "es"
                        ? "Tu suscripcion se cancelara al final del periodo actual. Mantendras acceso a las funciones premium hasta entonces."
                        : "Your subscription will cancel at the end of the current period. You'll keep access to premium features until then."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleOpenBillingPortal}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {locale === "es" ? "Metodos de pago" : "Payment methods"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === "es" ? "Gestionar tarjetas y metodos" : "Manage cards and methods"}
                    </p>
                  </div>
                  {isOpeningPortal ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </Card>

              <Link href="/premium">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {locale === "es" ? "Cambiar plan" : "Change plan"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locale === "es" ? "Mejorar o cambiar suscripcion" : "Upgrade or change subscription"}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  {locale === "es" ? "Historial de pagos" : "Payment history"}
                </CardTitle>
                <CardDescription>
                  {locale === "es" 
                    ? "Tus ultimas transacciones y facturas"
                    : "Your recent transactions and invoices"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                      <div 
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium text-sm">{payment.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(payment.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                          <Badge 
                            variant={payment.status === "paid" ? "secondary" : "destructive"}
                            className="text-[10px]"
                          >
                            {getStatusText(payment.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      {locale === "es" 
                        ? "No hay historial de pagos disponible"
                        : "No payment history available"}
                    </p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={handleOpenBillingPortal}
                  disabled={isOpeningPortal}
                >
                  {isOpeningPortal ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  {locale === "es" 
                    ? "Ver todas las facturas en Stripe"
                    : "View all invoices in Stripe"}
                </Button>
              </CardContent>
            </Card>

            {/* Plan features */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "es" ? "Caracteristicas incluidas" : "Included features"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {(locale === "es" ? plan.featuresEs : plan.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Cancel/Reactivate Actions */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">
                  {locale === "es" ? "Zona de peligro" : "Danger zone"}
                </CardTitle>
                <CardDescription>
                  {locale === "es"
                    ? "Acciones que afectan tu suscripcion"
                    : "Actions that affect your subscription"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCancelled ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {locale === "es" ? "Reactivar suscripcion" : "Reactivate subscription"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === "es"
                          ? "Cancela la cancelacion programada y continua con tu plan"
                          : "Cancel the scheduled cancellation and continue with your plan"}
                      </p>
                    </div>
                    <Button
                      onClick={() => reactivateSubscription()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {locale === "es" ? "Reactivar" : "Reactivate"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {locale === "es" ? "Cancelar suscripcion" : "Cancel subscription"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === "es"
                          ? "Mantendras acceso hasta el final del periodo actual"
                          : "You'll keep access until the end of the current period"}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm(
                          locale === "es"
                            ? "Estas seguro de que deseas cancelar tu suscripcion?"
                            : "Are you sure you want to cancel your subscription?"
                        )) {
                          cancelSubscription()
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {locale === "es" ? "Cancelar" : "Cancel"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Support info */}
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  {locale === "es"
                    ? "Necesitas ayuda? Contacta con nuestro equipo de soporte en support@soccermaps.app o visita nuestra seccion de ayuda."
                    : "Need help? Contact our support team at support@soccermaps.app or visit our help section."}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
