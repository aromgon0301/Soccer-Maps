import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Demo mode - simulate cancellation
      return NextResponse.json({ 
        success: true, 
        demo: true,
        message: "Subscription marked for cancellation (demo mode)"
      })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-04-30.basil",
    })

    // Cancel at period end (user keeps access until subscription ends)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return NextResponse.json({ 
      success: true,
      cancelAt: subscription.cancel_at 
        ? new Date(subscription.cancel_at * 1000).toISOString() 
        : null,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("No such subscription")) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }
    }
    
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
