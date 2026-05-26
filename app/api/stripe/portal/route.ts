import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { customerId, returnUrl } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Demo mode
      return NextResponse.json({ 
        demo: true,
        message: "Billing portal not available in demo mode",
        url: returnUrl || "/subscription"
      })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-04-30.basil",
    })

    // Create a billing portal session
    // This allows customers to:
    // - Update payment methods
    // - View invoice history
    // - Cancel or reactivate subscriptions
    // - Update billing information
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${request.nextUrl.origin}/subscription`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Billing portal error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("No such customer")) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }
      if (error.message.includes("billing_portal_configuration")) {
        return NextResponse.json({ 
          error: "Billing portal not configured. Please configure it in the Stripe Dashboard." 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 })
  }
}
