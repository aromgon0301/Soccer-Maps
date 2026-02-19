import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

interface ReservationDocument {
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
  notes?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const teamId = searchParams.get("teamId")

  const db = await getDb()
  const collection = db.collection<ReservationDocument>("reservations")

  const filter: Partial<ReservationDocument> = {}
  if (userId) {
    filter.userId = userId
  }
  if (teamId) {
    filter.teamId = teamId
  }

  const reservations = await collection.find(filter).sort({ createdAt: -1 }).toArray()
  return NextResponse.json({ reservations })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const db = await getDb()
  const collection = db.collection<ReservationDocument>("reservations")

  const reservation: ReservationDocument = {
    id: `res-${Date.now()}`,
    ...body,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    confirmationCode: `RSV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }

  await collection.insertOne(reservation)

  return NextResponse.json({ reservation, success: true })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, status } = body
  const db = await getDb()
  const collection = db.collection<ReservationDocument>("reservations")

  await collection.updateOne({ id }, { $set: { status } })
  const reservation = await collection.findOne({ id })

  if (reservation) {
    return NextResponse.json({ reservation, success: true })
  }

  return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
}
