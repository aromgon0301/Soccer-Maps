import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { profileUpdateSchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

const createDefaultProfile = (userId: string) => ({
  id: userId,
  name: "Aficionado",
  email: "",
  favoriteTeamId: null,
  fanType: "familiar",
  transportPreference: "metro",
  atmospherePreference: "animado",
  arrivalPreference: "temprano",
  level: 1,
  experience: 0,
  matchesAttended: 0,
  reviewsWritten: 0,
  stadiumsVisited: [] as string[],
  badges: ["first-visit"],
  createdAt: new Date().toISOString(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      logApiError("/api/profile", "GET_VALIDATION", "userId required")
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const db = await getDb()
    const collection = db.collection("profiles")
    const existing = await collection.findOne({ id: userId }, { projection: { _id: 0 } })

    if (existing) {
      logApiSuccess("/api/profile", "GET", { userId, isNew: false })
      return NextResponse.json({ profile: existing, isNew: false })
    }

    const profile = createDefaultProfile(userId)
    await collection.insertOne(profile)
    logApiSuccess("/api/profile", "GET_CREATE_DEFAULT", { userId, isNew: true })

    return NextResponse.json({ profile, isNew: true })
  } catch (error) {
    logApiError("/api/profile", "GET", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = profileUpdateSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid profile payload"
      logApiError("/api/profile", "PUT_VALIDATION", message, { payload: body })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { userId, ...updates } = parsed.data

    const db = await getDb()
    const collection = db.collection("profiles")
    const baseProfile = createDefaultProfile(userId)

    await collection.updateOne(
      { id: userId },
      {
        $setOnInsert: baseProfile,
        $set: updates,
      },
      { upsert: true },
    )

    const profile = await collection.findOne({ id: userId }, { projection: { _id: 0 } })
    logApiSuccess("/api/profile", "PUT", { userId, updates: Object.keys(updates) })
    return NextResponse.json({ profile, success: true })
  } catch (error) {
    logApiError("/api/profile", "PUT", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}
