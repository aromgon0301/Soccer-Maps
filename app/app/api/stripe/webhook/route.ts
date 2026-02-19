import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey)

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case "checkout.session.completed": {
        // Handle successful subscription
        break
      }
      case "customer.subscription.updated": {
        break
      }
      case "customer.subscription.deleted": {
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
