import { type NextRequest, NextResponse } from "next/server"

// In-memory storage - in production use a real database
const reservations: Array<{
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  poiId: string
  poiName: string
  poiType: string
  teamId: string
  teamName: string
  stadiumName: string
  matchDate: string
  guests: number
  time: string
  price: number
  status: string
  createdAt: string
  confirmationCode: string
}> = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const teamId = searchParams.get("teamId")

  let filtered = reservations

  if (userId) {
    filtered = filtered.filter((r) => r.userId === userId)
  }

  if (teamId) {
    filtered = filtered.filter((r) => r.teamId === teamId)
  }

  return NextResponse.json({ reservations: filtered })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const reservation = {
    id: `res-${Date.now()}`,
    ...body,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    confirmationCode: `RSV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }

  reservations.push(reservation)

  return NextResponse.json({ reservation, success: true })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, status } = body

  const index = reservations.findIndex((r) => r.id === id)
  if (index !== -1) {
    reservations[index] = { ...reservations[index], status }
    return NextResponse.json({ reservation: reservations[index], success: true })
  }

  return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
}
