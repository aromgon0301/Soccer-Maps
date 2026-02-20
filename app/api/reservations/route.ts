import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { reservationCreateSchema, reservationPatchSchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const teamId = searchParams.get("teamId")

    const filter: Record<string, unknown> = {}
    if (userId) filter.userId = userId
    if (teamId) filter.teamId = teamId

    const db = await getDb()
    const reservations = await db
      .collection("reservations")
      .find(filter, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    logApiSuccess("/api/reservations", "GET", { count: reservations.length, filter })

    return NextResponse.json({ reservations })
  } catch (error) {
    logApiError("/api/reservations", "GET", error)
    return NextResponse.json({ error: "Failed to load reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = reservationCreateSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid reservation payload"
      logApiError("/api/reservations", "POST_VALIDATION", message, { payload: body })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const reservation = {
      id: `res-${crypto.randomUUID()}`,
      ...parsed.data,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      confirmationCode: `RSV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    }

    const db = await getDb()
    await db.collection("reservations").insertOne(reservation)

    logApiSuccess("/api/reservations", "POST", {
      reservationId: reservation.id,
      userId: reservation.userId,
      teamId: reservation.teamId,
    })

    return NextResponse.json({ reservation, success: true })
  } catch (error) {
    logApiError("/api/reservations", "POST", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = reservationPatchSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid reservation patch payload"
      logApiError("/api/reservations", "PATCH_VALIDATION", message, { payload: body })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { id, status } = parsed.data

    const db = await getDb()
    await db.collection("reservations").updateOne({ id }, { $set: { status } })
    const reservation = await db.collection("reservations").findOne({ id }, { projection: { _id: 0 } })

    if (!reservation) {
      logApiError("/api/reservations", "PATCH_NOT_FOUND", "Reservation not found", { reservationId: id })
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    logApiSuccess("/api/reservations", "PATCH", { reservationId: id, status })

    return NextResponse.json({ reservation, success: true })
  } catch (error) {
    logApiError("/api/reservations", "PATCH", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}
