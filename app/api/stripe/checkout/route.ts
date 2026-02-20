import { type NextRequest, NextResponse } from "next/server"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest) {
  try {
    const { plan, billingCycle } = await request.json()

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Return demo mode response
      logApiSuccess("/api/stripe/checkout", "DEMO", { plan, billingCycle })
      return NextResponse.json({
        demo: true,
        message: "Stripe not configured - using demo mode",
        plan,
        billingCycle,
      })
    }

    // Import Stripe dynamically
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey)

    // Price IDs mapping (these would be real Stripe price IDs)
    const priceIds: Record<string, Record<string, string>> = {
      fan: {
        monthly: process.env.STRIPE_PRICE_FAN_MONTHLY || "price_fan_monthly",
        yearly: process.env.STRIPE_PRICE_FAN_YEARLY || "price_fan_yearly",
      },
      ultra: {
        monthly: process.env.STRIPE_PRICE_ULTRA_MONTHLY || "price_ultra_monthly",
        yearly: process.env.STRIPE_PRICE_ULTRA_YEARLY || "price_ultra_yearly",
      },
    }

    const priceId = priceIds[plan]?.[billingCycle]

    if (!priceId) {
      logApiError("/api/stripe/checkout", "VALIDATION", "Invalid plan or billing cycle", { plan, billingCycle })
      return NextResponse.json({ error: "Invalid plan or billing cycle" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/premium?cancelled=true`,
      metadata: {
        plan,
        billingCycle,
      },
    })

    logApiSuccess("/api/stripe/checkout", "POST", {
      plan,
      billingCycle,
      sessionId: session.id,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    logApiError("/api/stripe/checkout", "POST", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
