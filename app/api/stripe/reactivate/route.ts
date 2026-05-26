import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Demo mode - simulate reactivation
      return NextResponse.json({ 
        success: true, 
        demo: true,
        message: "Subscription reactivated (demo mode)"
      })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-04-30.basil",
    })

    // Remove scheduled cancellation
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return NextResponse.json({ 
      success: true,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Reactivate subscription error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("No such subscription")) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }
    }
    
    return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 })
  }
}
