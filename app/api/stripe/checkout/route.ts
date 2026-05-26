import { type NextRequest, NextResponse } from "next/server"

// Subscription product configuration - prices in cents
const SUBSCRIPTION_PRODUCTS = {
  fan: {
    name: "Soccer Maps Fan",
    nameEs: "Soccer Maps Fan",
    description: "Access to community features, favorites, and basic reservations",
    descriptionEs: "Acceso a funciones de comunidad, favoritos y reservas basicas",
    monthly: 499, // €4.99
    yearly: 4999, // €49.99
  },
  ultra: {
    name: "Soccer Maps Ultra",
    nameEs: "Soccer Maps Ultra",
    description: "Premium features including AI planner, VIP access, and priority reservations",
    descriptionEs: "Funciones premium incluyendo planificador IA, acceso VIP y reservas prioritarias",
    monthly: 999, // €9.99
    yearly: 9999, // €99.99
  },
}

export async function POST(request: NextRequest) {
  try {
    const { plan, billingCycle, locale = "en" } = await request.json()

    // Validate plan
    if (!plan || !["fan", "ultra"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan specified" }, { status: 400 })
    }

    // Validate billing cycle
    if (!billingCycle || !["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json({ error: "Invalid billing cycle" }, { status: 400 })
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      // Return demo mode response with subscription data
      return NextResponse.json({
        demo: true,
        message: "Stripe not configured - using demo mode",
        plan,
        billingCycle,
        price: SUBSCRIPTION_PRODUCTS[plan as keyof typeof SUBSCRIPTION_PRODUCTS][billingCycle as "monthly" | "yearly"],
      })
    }

    // Import Stripe dynamically
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-04-30.basil",
    })

    const product = SUBSCRIPTION_PRODUCTS[plan as keyof typeof SUBSCRIPTION_PRODUCTS]
    const isSpanish = locale === "es"
    const priceInCents = product[billingCycle as "monthly" | "yearly"]

    // Create a Checkout Session for subscription
    // Using dynamic payment methods for automatic support of:
    // - Credit/Debit cards
    // - Apple Pay
    // - Google Pay  
    // - PayPal (if enabled in Stripe dashboard)
    // - Link (Stripe's fast checkout)
    // - SEPA Direct Debit (for EU customers)
    // - And more based on customer location and merchant settings
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Don't specify payment_method_types - let Stripe dynamically show
      // the best payment methods based on customer location and merchant settings
      billing_address_collection: "required",
      customer_creation: "always",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: isSpanish ? product.nameEs : product.name,
              description: isSpanish ? product.descriptionEs : product.description,
            },
            unit_amount: priceInCents,
            recurring: {
              interval: billingCycle === "yearly" ? "year" : "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          plan,
          billingCycle,
        },
      },
      success_url: `${request.nextUrl.origin}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/premium?cancelled=true`,
      metadata: {
        plan,
        billingCycle,
      },
      locale: isSpanish ? "es" : "en",
      // Enable customer portal link in success page
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: isSpanish 
            ? "Acepto los [términos de servicio](https://soccermaps.app/terms)" 
            : "I agree to the [terms of service](https://soccermaps.app/terms)",
        },
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("No such price")) {
        return NextResponse.json({ error: "Invalid price configuration" }, { status: 400 })
      }
      if (error.message.includes("Invalid API Key")) {
        return NextResponse.json({ error: "Payment system configuration error" }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
