import { type NextRequest, NextResponse } from "next/server"
import { createDefaultProfile, type UserDocument } from "@/lib/default-data"
import { getDb } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const db = await getDb()
  const users = db.collection<UserDocument>("users")
  const user = await users.findOne({ userId })

  if (!user) {
    const newUser: UserDocument = {
      userId,
      profile: createDefaultProfile(userId),
      visits: [],
      favoritePois: [],
      updatedAt: new Date().toISOString(),
    }

    await users.insertOne(newUser)

    return NextResponse.json({
      profile: newUser.profile,
      visits: newUser.visits,
      favoritePois: newUser.favoritePois,
      isNew: true,
    })
  }

  return NextResponse.json({
    profile: user.profile,
    visits: user.visits ?? [],
    favoritePois: user.favoritePois ?? [],
    isNew: false,
  })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { userId, profile, visits, favoritePois } = body

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const existing = await users.findOne({ userId })
  const nextProfile = {
    ...(existing?.profile ?? createDefaultProfile(userId)),
    ...(profile ?? {}),
    id: userId,
  }

  const updatePayload: Partial<UserDocument> = {
    profile: nextProfile,
    updatedAt: new Date().toISOString(),
  }

  if (Array.isArray(visits)) {
    updatePayload.visits = visits
  } else if (!existing?.visits) {
    updatePayload.visits = []
  }

  if (Array.isArray(favoritePois)) {
    updatePayload.favoritePois = favoritePois
  } else if (!existing?.favoritePois) {
    updatePayload.favoritePois = []
  }

  await users.updateOne({ userId }, { $set: updatePayload }, { upsert: true })
  const updated = await users.findOne({ userId })

  return NextResponse.json({
    profile: updated?.profile,
    visits: updated?.visits ?? [],
    favoritePois: updated?.favoritePois ?? [],
    success: true,
  })
}
