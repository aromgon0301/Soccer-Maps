import { create } from "zustand"

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Reservation {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  poiId: string
  poiName: string
  poiType: "bar" | "restaurant" | "parking"
  teamId: string
  teamName: string
  stadiumName: string
  matchDate: string
  guests: number
  time: string
  price: number
  status: ReservationStatus
  createdAt: string
  confirmationCode: string
  notes?: string
}

interface ReservationsState {
  reservations: Reservation[]
  createReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "confirmationCode" | "status">) => Promise<Reservation>
  updateReservationStatus: (id: string, status: ReservationStatus) => Promise<void>
  cancelReservation: (id: string) => Promise<void>
  loadReservations: (userId?: string, teamId?: string) => Promise<void>
  getReservationsByUser: (userId: string) => Reservation[]
  getReservationsByTeam: (teamId: string) => Reservation[]
  getUpcomingReservations: (userId: string) => Reservation[]
}

export const useReservationsStore = create<ReservationsState>()((set, get) => ({
  reservations: [],

  loadReservations: async (userId, teamId) => {
    const query = new URLSearchParams()
    if (userId) {
      query.set("userId", userId)
    }
    if (teamId) {
      query.set("teamId", teamId)
    }

    const suffix = query.toString() ? `?${query.toString()}` : ""
    const response = await fetch(`/api/reservations${suffix}`)
    const data = await response.json()
    set({ reservations: data.reservations ?? [] })
  },

  createReservation: async (reservationData) => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData),
    })

    if (!response.ok) {
      throw new Error("No se pudo crear la reserva")
    }

    const data = await response.json()
    const reservation = data.reservation as Reservation

    set((state) => ({
      reservations: [reservation, ...state.reservations],
    }))

    return reservation
  },

  updateReservationStatus: async (id, status) => {
    const response = await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })

    if (!response.ok) {
      throw new Error("No se pudo actualizar la reserva")
    }

    set((state) => ({
      reservations: state.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
    }))
  },

  cancelReservation: async (id) => {
    await get().updateReservationStatus(id, "cancelled")
  },

  getReservationsByUser: (userId) => {
    return get().reservations.filter((r) => r.userId === userId)
  },

  getReservationsByTeam: (teamId) => {
    return get().reservations.filter((r) => r.teamId === teamId)
  },

  getUpcomingReservations: (userId) => {
    const now = new Date()
    return get()
      .reservations.filter((r) => r.userId === userId && r.status !== "cancelled" && new Date(r.matchDate) >= now)
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
  },
}))
