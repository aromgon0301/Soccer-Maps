"use client"

import { useState } from "react"
import { useSubscriptionStore, SUBSCRIPTION_PLANS, type PlanType } from "@/lib/stores/subscription-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Crown, Zap, Star, Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18nStore } from "@/lib/stores"

export function PremiumSubscription() {
  const { subscription, isLoading, subscribeToPlan, cancelSubscription, reactivateSubscription, getPlan } =
    useSubscriptionStore()
  const { toast } = useToast()
  const { locale } = useI18nStore()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null)

  const currentPlan = getPlan()
  const isSubscribed = subscription && subscription.status === "active"

  const handleSubscribe = async (planId: PlanType) => {
    if (planId === "free") return

    setProcessingPlan(planId)
    try {
      await subscribeToPlan(planId, billingCycle)
      toast({
        title: locale === "es" ? "Suscripcion activada" : "Subscription activated",
        description: locale === "es"
          ? `Tu plan ${planId.toUpperCase()} esta activo. Disfruta de todas las funciones premium!`
          : `Your ${planId.toUpperCase()} plan is active. Enjoy all premium features!`,
      })
    } catch {
      toast({
        title: locale === "es" ? "Error" : "Error",
        description: locale === "es"
          ? "No se pudo procesar la suscripcion. Intenta de nuevo."
          : "Could not process subscription. Try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingPlan(null)
    }
  }

  const handleCancel = async () => {
    try {
      await cancelSubscription()
      setShowCancelDialog(false)
      toast({
        title: locale === "es" ? "Suscripcion cancelada" : "Subscription cancelled",
        description: locale === "es"
          ? "Tu suscripcion se cancelara al final del periodo actual."
          : "Your subscription will cancel at the end of the current period.",
      })
    } catch {
      toast({
        title: locale === "es" ? "Error" : "Error",
        description: locale === "es"
          ? "No se pudo cancelar la suscripcion."
          : "Could not cancel subscription.",
        variant: "destructive",
      })
    }
  }

  const handleReactivate = async () => {
    try {
      await reactivateSubscription()
      toast({
        title: locale === "es" ? "Suscripcion reactivada" : "Subscription reactivated",
        description: locale === "es"
          ? "Tu suscripcion continuara activa."
          : "Your subscription will continue to be active.",
      })
    } catch {
      toast({
        title: locale === "es" ? "Error" : "Error",
        description: locale === "es"
          ? "No se pudo reactivar la suscripcion."
          : "Could not reactivate subscription.",
        variant: "destructive",
      })
    }
  }

  const getPlanIcon = (planId: PlanType) => {
    switch (planId) {
      case "ultra":
        return <Crown className="h-6 w-6" />
      case "fan":
        return <Zap className="h-6 w-6" />
      default:
        return <Star className="h-6 w-6" />
    }
  }

  const getPlanColor = (planId: PlanType) => {
    switch (planId) {
      case "ultra":
        return "from-amber-500 to-orange-600"
      case "fan":
        return "from-blue-500 to-cyan-600"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  return (
    <div className="space-y-8">
      {/* Current subscription status */}
      {isSubscribed && (
        <Card className="border-2 border-primary">
          <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getPlanColor(subscription.plan)} text-white`}>
                      {getPlanIcon(subscription.plan)}
                    </div>
                    <div>
                      <CardTitle>Plan {locale === "es" ? currentPlan.nameEs : currentPlan.name}</CardTitle>
                      <CardDescription>
                        {subscription.billingCycle === "yearly"
                          ? locale === "es"
                            ? "Facturacion anual"
                            : "Annual billing"
                          : locale === "es"
                            ? "Facturacion mensual"
                            : "Monthly billing"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={subscription.cancelAtPeriodEnd ? "destructive" : "default"}>
                    {subscription.cancelAtPeriodEnd ? (locale === "es" ? "Cancelado" : "Cancelled") : locale === "es" ? "Activo" : "Active"}
                  </Badge>
                </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {subscription.cancelAtPeriodEnd ? (
                <>
                  {locale === "es" ? "Tu suscripcion terminara el" : "Your subscription will end on"}{" "}
                  <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}</strong>
                </>
              ) : (
                <>
                  {locale === "es" ? "Proxima facturacion:" : "Next billing:"}{" "}
                  <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}</strong>
                </>
              )}
            </p>
          </CardContent>
          <CardFooter>
            {subscription.cancelAtPeriodEnd ? (
              <Button onClick={handleReactivate} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {locale === "es" ? "Reactivar suscripcion" : "Reactivate subscription"}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
                {locale === "es" ? "Cancelar suscripcion" : "Cancel subscription"}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label
          htmlFor="billing-toggle"
          className={billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}
        >
          {locale === "es" ? "Mensual" : "Monthly"}
        </Label>
        <Switch
          id="billing-toggle"
          checked={billingCycle === "yearly"}
          onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
        />
        <Label
          htmlFor="billing-toggle"
          className={billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}
        >
          {locale === "es" ? "Anual" : "Yearly"}
          <Badge variant="secondary" className="ml-2">
            -17%
          </Badge>
        </Label>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const price = billingCycle === "yearly" ? plan.priceYearly : plan.price
          const monthlyEquivalent = billingCycle === "yearly" ? (plan.priceYearly / 12).toFixed(2) : null
          const isCurrentPlan = currentPlan.id === plan.id
          const isUpgrade =
            SUBSCRIPTION_PLANS.findIndex((p) => p.id === plan.id) >
            SUBSCRIPTION_PLANS.findIndex((p) => p.id === currentPlan.id)
          const isProcessing = processingPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.id === "ultra" ? "border-2 border-amber-500 shadow-lg" : ""} ${
                isCurrentPlan ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.id === "ultra" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                    {locale === "es" ? "Mas popular" : "Most popular"}
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getPlanColor(plan.id)} text-white`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <div>
                    <CardTitle>{locale === "es" ? plan.nameEs : plan.name}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="outline">{locale === "es" ? "Plan actual" : "Current plan"}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <span className="text-4xl font-bold">
                    {price === 0 ? (locale === "es" ? "Gratis" : "Free") : `${price}€`}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">
                      /{billingCycle === "yearly" ? (locale === "es" ? "año" : "year") : (locale === "es" ? "mes" : "month")}
                    </span>
                  )}
                  {monthlyEquivalent && price > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {monthlyEquivalent}€/{locale === "es" ? "mes equivalente" : "month equivalent"}
                    </p>
                  )}
                </div>

                <ul className="space-y-2">
                  {(locale === "es" ? plan.featuresEs : plan.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {plan.id === "free" ? (
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    {locale === "es" ? "Plan basico" : "Basic plan"}
                  </Button>
                ) : isCurrentPlan ? (
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    {locale === "es" ? "Plan actual" : "Current plan"}
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${plan.id === "ultra" ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" : ""}`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {locale === "es" ? "Procesando..." : "Processing..."}
                      </>
                    ) : isUpgrade ? (
                      locale === "es"
                        ? `Mejorar a ${plan.nameEs}`
                        : `Upgrade to ${plan.name}`
                    ) : (
                      locale === "es"
                        ? `Suscribirse a ${plan.nameEs}`
                        : `Subscribe to ${plan.name}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Cancel dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {locale === "es" ? "Cancelar suscripcion" : "Cancel subscription"}
            </DialogTitle>
            <DialogDescription>
              {locale === "es"
                ? "Estas seguro de que quieres cancelar tu suscripcion? Perderas acceso a las funciones premium al final del periodo de facturacion actual."
                : "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of the current billing period."}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>
                {locale === "es"
                  ? "Tu suscripcion permanecera activa hasta:"
                  : "Your subscription will remain active until:"}
              </strong>
              <br />
              {subscription &&
                new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  locale === "es" ? "es-ES" : "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              {locale === "es" ? "Mantener suscripcion" : "Keep subscription"}
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {locale === "es" ? "Confirmar cancelacion" : "Confirm cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
