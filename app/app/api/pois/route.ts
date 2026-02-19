import { type NextRequest, NextResponse } from "next/server"
import { SAMPLE_POIS } from "@/lib/default-data"
import { getDb } from "@/lib/mongodb"

interface PoiDocument {
  id: string
  name: string
  type: string
  teamId: string
  distance: string
  walkingTime: string
  coordinates: {
    lat: number
    lng: number
  }
  address: string
  description: string
  features: string[]
  atmosphere: string
  priceRange: string
  openHours: string
  matchDayHours: string
  estimatedOccupancy: number
  rating: number
  reviewCount: number
  acceptsReservations: boolean
  reservationPrice: number
}

const ensureSeedData = async () => {
  const db = await getDb()
  const collection = db.collection<PoiDocument>("pois")
  const count = await collection.estimatedDocumentCount()

  if (count === 0) {
    await collection.insertMany(SAMPLE_POIS as PoiDocument[])
  }

  return collection
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")
  const type = searchParams.get("type")

  const collection = await ensureSeedData()

  const filter: Partial<PoiDocument> = {}
  if (teamId) {
    filter.teamId = teamId
  }
  if (type) {
    filter.type = type
  }

  const pois = await collection.find(filter).toArray()
  return NextResponse.json({ pois })
}
