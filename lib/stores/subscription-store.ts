import { create } from "zustand"
import { persist } from "zustand/middleware"
import { reportError, reportSuccess } from "@/lib/client-feedback"

export type PlanType = "free" | "fan" | "ultra"

export interface SubscriptionPlan {
  id: PlanType
  name: string
  nameEs: string
  price: number
  priceYearly: number
  features: string[]
  featuresEs: string[]
  stripePriceId?: string
  stripePriceIdYearly?: string
}

export interface Subscription {
  id: string
  odl: string
  userId: string
  plan: PlanType
  status: "active" | "cancelled" | "past_due" | "trialing"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  billingCycle: "monthly" | "yearly"
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    nameEs: "Gratis",
    price: 0,
    priceYearly: 0,
    features: ["View all 20 La Liga stadiums", "Basic stadium maps", "Community posts (read only)", "Match day info"],
    featuresEs: [
      "Ver los 20 estadios de La Liga",
      "Mapas básicos de estadios",
      "Posts de la comunidad (solo lectura)",
      "Info del día del partido",
    ],
  },
  {
    id: "fan",
    name: "Fan",
    nameEs: "Fan",
    price: 4.99,
    priceYearly: 49.99,
    stripePriceId: "price_fan_monthly",
    stripePriceIdYearly: "price_fan_yearly",
    features: [
      "Everything in Free",
      "Create community posts",
      "Save favorite venues",
      "Basic reservations",
      "Visitor mode with safe routes",
      "Stadium comparator",
    ],
    featuresEs: [
      "Todo lo de Gratis",
      "Crear posts en la comunidad",
      "Guardar lugares favoritos",
      "Reservas básicas",
      "Modo visitante con rutas seguras",
      "Comparador de estadios",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    nameEs: "Ultra",
    price: 9.99,
    priceYearly: 99.99,
    stripePriceId: "price_ultra_monthly",
    stripePriceIdYearly: "price_ultra_yearly",
    features: [
      "Everything in Fan",
      "Priority reservations",
      "Real-time crowd density",
      "VIP parking spots",
      "Exclusive fan zones access",
      "Match day planner AI",
      "Premium badge in community",
      "Early access to new features",
    ],
    featuresEs: [
      "Todo lo de Fan",
      "Reservas prioritarias",
      "Densidad de aforo en tiempo real",
      "Plazas de parking VIP",
      "Acceso a zonas de fans exclusivas",
      "Planificador IA del día del partido",
      "Insignia premium en la comunidad",
      "Acceso anticipado a nuevas funciones",
    ],
  },
]

interface SubscriptionState {
  subscription: Subscription | null
  isLoading: boolean
  checkoutSessionId: string | null

  // Actions
  setSubscription: (subscription: Subscription | null) => void
  subscribeToPlan: (plan: PlanType, billingCycle: "monthly" | "yearly") => Promise<void>
  cancelSubscription: () => Promise<void>
  reactivateSubscription: () => Promise<void>
  checkFeatureAccess: (feature: string) => boolean
  getPlan: () => SubscriptionPlan
  startCheckout: (plan: PlanType, billingCycle: "monthly" | "yearly") => Promise<string>
  simulateSubscription: (plan: PlanType, billingCycle: "monthly" | "yearly") => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      isLoading: false,
      checkoutSessionId: null,

      setSubscription: (subscription) => set({ subscription }),

      getPlan: () => {
        const { subscription } = get()
        const planId = subscription?.plan || "free"
        return SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0]
      },

      checkFeatureAccess: (feature: string) => {
        const { subscription } = get()
        if (!subscription || subscription.status !== "active") {
          const freeFeatures = ["view_stadiums", "basic_maps", "read_community", "match_info"]
          return freeFeatures.includes(feature)
        }

        const fanFeatures = [
          "view_stadiums",
          "basic_maps",
          "read_community",
          "match_info",
          "create_posts",
          "save_favorites",
          "basic_reservations",
          "visitor_mode",
          "stadium_comparator",
        ]

        const ultraFeatures = [
          ...fanFeatures,
          "priority_reservations",
          "crowd_density",
          "vip_parking",
          "exclusive_zones",
          "ai_planner",
          "premium_badge",
          "early_access",
        ]

        if (subscription.plan === "ultra") {
          return ultraFeatures.includes(feature)
        }

        if (subscription.plan === "fan") {
          return fanFeatures.includes(feature)
        }

        return false
      },

      startCheckout: async (plan, billingCycle) => {
        set({ isLoading: true })
        reportSuccess("Inicio de checkout", {
          detail: `Plan ${plan} (${billingCycle})`,
          showToast: false,
          context: { plan, billingCycle },
        })

        try {
          const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan, billingCycle }),
          })

          if (!response.ok) {
            reportError("Checkout fallido", {
              detail: "No se pudo crear sesión de pago",
              context: { plan, billingCycle, status: response.status },
            })
            throw new Error("Failed to create checkout session")
          }

          const { sessionId, url } = await response.json()
          set({ checkoutSessionId: sessionId })

          if (url) {
            reportSuccess("Checkout creado", {
              detail: "Redirigiendo a pasarela de pago",
              context: { sessionId },
            })
            window.location.href = url
          }

          return sessionId
        } catch (error) {
          reportError("Error en checkout", {
            detail: "No se pudo iniciar el proceso de pago",
            context: { plan, billingCycle, error: String(error) },
          })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      simulateSubscription: (plan, billingCycle) => {
        const now = new Date()
        const periodEnd = new Date(now)
        if (billingCycle === "yearly") {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1)
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1)
        }

        const subscription: Subscription = {
          id: `sub_demo_${Date.now()}`,
          odl: `sub_demo_${Date.now()}`,
          userId: "demo_user",
          plan,
          status: "active",
          currentPeriodStart: now.toISOString(),
          currentPeriodEnd: periodEnd.toISOString(),
          cancelAtPeriodEnd: false,
          billingCycle,
        }

        set({ subscription })
        reportSuccess("Suscripción demo activada", {
          detail: `Plan ${plan} (${billingCycle})`,
          context: { plan, billingCycle },
        })
      },

      subscribeToPlan: async (plan, billingCycle) => {
        set({ isLoading: true })

        try {
          const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan, billingCycle }),
          })

          if (response.ok) {
            const { url } = await response.json()
            if (url) {
              reportSuccess("Checkout listo", {
                detail: "Redirigiendo al pago",
                context: { plan, billingCycle },
              })
              window.location.href = url
              return
            }
          }

          get().simulateSubscription(plan, billingCycle)
          reportSuccess("Suscripción simulada", {
            detail: "Stripe no devolvió URL, activada en modo demo",
            context: { plan, billingCycle },
          })
        } catch {
          get().simulateSubscription(plan, billingCycle)
          reportError("Error en suscripción", {
            detail: "Fallo en Stripe, aplicado modo demo",
            context: { plan, billingCycle },
          })
        } finally {
          set({ isLoading: false })
        }
      },

      cancelSubscription: async () => {
        set({ isLoading: true })

        try {
          const { subscription } = get()
          if (!subscription) return

          const response = await fetch("/api/stripe/cancel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptionId: subscription.stripeSubscriptionId,
            }),
          })

          if (response.ok) {
            set({
              subscription: {
                ...subscription,
                cancelAtPeriodEnd: true,
              },
            })
            reportSuccess("Suscripción cancelada", {
              detail: "Se cancelará al final del periodo",
              context: { subscriptionId: subscription.id },
            })
            return
          }

          set({
            subscription: {
              ...subscription,
              cancelAtPeriodEnd: true,
            },
          })
          reportError("Cancelación no persistida", {
            detail: "Actualizada localmente pero no confirmada por servidor",
            context: { subscriptionId: subscription.id, status: response.status },
          })
        } finally {
          set({ isLoading: false })
        }
      },

      reactivateSubscription: async () => {
        set({ isLoading: true })

        try {
          const { subscription } = get()
          if (!subscription) return

          const response = await fetch("/api/stripe/reactivate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptionId: subscription.stripeSubscriptionId,
            }),
          })

          if (response.ok) {
            set({
              subscription: {
                ...subscription,
                cancelAtPeriodEnd: false,
              },
            })
            reportSuccess("Suscripción reactivada", {
              detail: "La cancelación programada fue retirada",
              context: { subscriptionId: subscription.id },
            })
            return
          }

          set({
            subscription: {
              ...subscription,
              cancelAtPeriodEnd: false,
            },
          })
          reportError("Reactivación no persistida", {
            detail: "Actualizada localmente pero no confirmada por servidor",
            context: { subscriptionId: subscription.id, status: response.status },
          })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "soccer-maps-subscription",
    },
  ),
)
