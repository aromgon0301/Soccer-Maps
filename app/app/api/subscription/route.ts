import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

interface SubscriptionDocument {
  userId: string
  subscription: {
    id: string
    odl: string
    userId: string
    plan: "free" | "fan" | "ultra"
    status: "active" | "cancelled" | "past_due" | "trialing"
    currentPeriodStart: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    billingCycle: "monthly" | "yearly"
  } | null
  updatedAt: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const db = await getDb()
  const collection = db.collection<SubscriptionDocument>("subscriptions")
  const record = await collection.findOne({ userId })

  return NextResponse.json({ subscription: record?.subscription ?? null })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { userId, subscription } = body

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const db = await getDb()
  const collection = db.collection<SubscriptionDocument>("subscriptions")

  await collection.updateOne(
    { userId },
    {
      $set: {
        userId,
        subscription: subscription ?? null,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  )

  const updated = await collection.findOne({ userId })
  return NextResponse.json({ success: true, subscription: updated?.subscription ?? null })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { userId, action } = body

  if (!userId || !action) {
    return NextResponse.json({ error: "userId and action required" }, { status: 400 })
  }

  const db = await getDb()
  const collection = db.collection<SubscriptionDocument>("subscriptions")
  const record = await collection.findOne({ userId })

  if (!record?.subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
  }

  const nextSubscription = {
    ...record.subscription,
    cancelAtPeriodEnd: action === "cancel",
  }

  await collection.updateOne(
    { userId },
    {
      $set: {
        subscription: nextSubscription,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  return NextResponse.json({ success: true, subscription: nextSubscription })
}
