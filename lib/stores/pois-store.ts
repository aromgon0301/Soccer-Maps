import { create } from "zustand"

export type PoiType = "bar" | "restaurant" | "parking" | "transport"
export type Atmosphere = "tranquilo" | "animado" | "familiar" | "hinchada"

export interface POI {
  id: string
  name: string
  type: PoiType
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
  atmosphere: Atmosphere
  priceRange: string
  openHours: string
  matchDayHours: string
  estimatedOccupancy: number
  rating: number
  reviewCount: number
  acceptsReservations: boolean
  reservationPrice: number
  imageUrl?: string
}

interface PoisState {
  pois: POI[]
  loading: boolean
  loadPois: () => Promise<void>
  getPoisByTeam: (teamId: string) => POI[]
  getPoisByType: (teamId: string, type: PoiType) => POI[]
  getPoiById: (id: string) => POI | undefined
  updateOccupancy: (id: string, occupancy: number) => Promise<void>
}

export const usePoisStore = create<PoisState>()((set, get) => ({
  pois: [],
  loading: false,

  loadPois: async () => {
    set({ loading: true })
    try {
      const response = await fetch("/api/pois")
      const data = await response.json()
      set({ pois: data.pois ?? [] })
    } finally {
      set({ loading: false })
    }
  },

  getPoisByTeam: (teamId) => get().pois.filter((p) => p.teamId === teamId),

  getPoisByType: (teamId, type) => get().pois.filter((p) => p.teamId === teamId && p.type === type),

  getPoiById: (id) => get().pois.find((p) => p.id === id),

  updateOccupancy: async (id, occupancy) => {
    set((state) => ({
      pois: state.pois.map((p) => (p.id === id ? { ...p, estimatedOccupancy: occupancy } : p)),
    }))
  },
}))
