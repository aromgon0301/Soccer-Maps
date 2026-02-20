import { type NextRequest, NextResponse } from "next/server"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Demo mode
      logApiSuccess("/api/stripe/cancel", "DEMO", { subscriptionId })
      return NextResponse.json({ success: true, demo: true })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey)

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    logApiSuccess("/api/stripe/cancel", "POST", { subscriptionId })

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError("/api/stripe/cancel", "POST", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
