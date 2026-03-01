import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Reservation {
  id: string

  // User info
  userId: string
  userName: string
  userEmail: string
  userPhone: string

  // Venue info
  poiId: string
  poiName: string
  poiType: "bar" | "restaurant" | "parking"

  // Match info
  teamId: string
  teamName: string
  stadiumName: string
  matchDate: string

  // Reservation details
  guests: number
  time: string
  price: number
  status: ReservationStatus

  // Metadata
  createdAt: string
  confirmationCode: string
  notes?: string
}

interface ReservationsState {
  reservations: Reservation[]

  // Actions
  createReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "confirmationCode" | "status">) => Reservation
  updateReservationStatus: (id: string, status: ReservationStatus) => void
  cancelReservation: (id: string) => void
  getReservationsByUser: (userId: string) => Reservation[]
  getReservationsByTeam: (teamId: string) => Reservation[]
  getUpcomingReservations: (userId: string) => Reservation[]
}

const generateConfirmationCode = () => {
  return `RSV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set, get) => ({
      reservations: [],

      createReservation: (reservationData) => {
        const reservation: Reservation = {
          ...reservationData,
          id: `res-${Date.now()}`,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          confirmationCode: generateConfirmationCode(),
        }

        set((state) => ({
          reservations: [...state.reservations, reservation],
        }))

        return reservation
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
        }))
      },

      cancelReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status: "cancelled" as ReservationStatus } : r,
          ),
        }))
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
    }),
    {
      name: "soccer-maps-reservations",
    },
  ),
)
