import { type NextRequest, NextResponse } from "next/server"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Demo mode
      logApiSuccess("/api/stripe/reactivate", "DEMO", { subscriptionId })
      return NextResponse.json({ success: true, demo: true })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey)

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    logApiSuccess("/api/stripe/reactivate", "POST", { subscriptionId })

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError("/api/stripe/reactivate", "POST", error)
    return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 })
  }
}
