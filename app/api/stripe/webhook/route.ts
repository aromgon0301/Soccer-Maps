import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      console.error("Stripe not configured - missing secret key or webhook secret")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
    }

    const StripeLib = (await import("stripe")).default
    const stripe = new StripeLib(stripeSecretKey, {
      apiVersion: "2025-04-30.basil",
    })

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.error("Missing Stripe signature header")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Log all events for debugging
    console.log(`Stripe webhook received: ${event.type}`)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Extract subscription details
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        const plan = session.metadata?.plan || "fan"
        const billingCycle = session.metadata?.billingCycle || "monthly"

        console.log("Checkout completed:", {
          subscriptionId,
          customerId,
          plan,
          billingCycle,
          customerEmail: session.customer_email,
        })

        // In a real app, you would:
        // 1. Update your database with the subscription info
        // 2. Associate the Stripe customer ID with your user
        // 3. Grant premium access to the user
        
        break
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("Subscription created:", {
          id: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log("Subscription updated:", {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        })

        // Handle subscription updates:
        // - Plan changes
        // - Payment method updates
        // - Cancellation scheduling
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log("Subscription cancelled:", {
          id: subscription.id,
          customerId: subscription.customer,
        })

        // Revoke premium access
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        
        console.log("Invoice paid:", {
          id: invoice.id,
          subscriptionId: invoice.subscription,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
        })

        // Record payment in history
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        
        console.log("Invoice payment failed:", {
          id: invoice.id,
          subscriptionId: invoice.subscription,
          attemptCount: invoice.attempt_count,
        })

        // Notify user of failed payment
        // Consider sending email or in-app notification
        break
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log("Trial ending soon:", {
          id: subscription.id,
          trialEnd: subscription.trial_end 
            ? new Date(subscription.trial_end * 1000).toISOString() 
            : null,
        })

        // Notify user that trial is ending
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

// Disable body parsing for webhooks (Stripe requires raw body)
export const dynamic = "force-dynamic"
