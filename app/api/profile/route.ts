import { type NextRequest, NextResponse } from "next/server"

// In-memory storage - in production use a real database
const profiles: Record<
  string,
  {
    id: string
    name: string
    email: string
    favoriteTeamId: string | null
    fanType: string
    transportPreference: string
    atmospherePreference: string
    arrivalPreference: string
    level: number
    experience: number
    matchesAttended: number
    reviewsWritten: number
    stadiumsVisited: string[]
    badges: string[]
    createdAt: string
  }
> = {}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const profile = profiles[userId]

  if (!profile) {
    // Return default profile for new users
    return NextResponse.json({
      profile: {
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
        stadiumsVisited: [],
        badges: ["first-visit"],
        createdAt: new Date().toISOString(),
      },
      isNew: true,
    })
  }

  return NextResponse.json({ profile, isNew: false })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { userId, ...updates } = body

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  if (!profiles[userId]) {
    profiles[userId] = {
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
      stadiumsVisited: [],
      badges: ["first-visit"],
      createdAt: new Date().toISOString(),
    }
  }

  profiles[userId] = { ...profiles[userId], ...updates }

  return NextResponse.json({ profile: profiles[userId], success: true })
}
