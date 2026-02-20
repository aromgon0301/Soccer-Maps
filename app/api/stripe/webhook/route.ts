import { type NextRequest, NextResponse } from "next/server"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      logApiError("/api/stripe/webhook", "CONFIG", "Stripe not configured")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey)

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      logApiError("/api/stripe/webhook", "VALIDATION", "Missing signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        logApiSuccess("/api/stripe/webhook", "checkout.session.completed", {
          subscriptionId: session.subscription,
        })
        break
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object
        logApiSuccess("/api/stripe/webhook", "customer.subscription.updated", {
          subscriptionId: subscription.id,
        })
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        logApiSuccess("/api/stripe/webhook", "customer.subscription.deleted", {
          subscriptionId: subscription.id,
        })
        break
      }
    }

    logApiSuccess("/api/stripe/webhook", "POST", { eventType: event.type })

    return NextResponse.json({ received: true })
  } catch (error) {
    logApiError("/api/stripe/webhook", "POST", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
