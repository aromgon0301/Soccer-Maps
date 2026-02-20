import { create } from "zustand"
import { persist } from "zustand/middleware"
import { reportError, reportSuccess } from "@/lib/client-feedback"

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
  createReservation: (
    reservation: Omit<Reservation, "id" | "createdAt" | "confirmationCode" | "status">
  ) => Promise<Reservation>
  updateReservationStatus: (id: string, status: ReservationStatus) => Promise<void>
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

      createReservation: async (reservationData) => {
        const optimisticReservation: Reservation = {
          ...reservationData,
          id: `res-${Date.now()}`,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          confirmationCode: generateConfirmationCode(),
        }

        set((state) => ({ reservations: [...state.reservations, optimisticReservation] }))

        try {
          const response = await fetch("/api/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData),
          })

          if (!response.ok) {
            reportError("Reserva no persistida", {
              detail: "Se creó localmente, pero no se guardó en base de datos",
              context: { status: response.status, userId: reservationData.userId },
            })
            return optimisticReservation
          }

          const data = await response.json()
          const serverReservation = data?.reservation as Reservation
          if (serverReservation) {
            set((state) => ({
              reservations: state.reservations.map((r) => (r.id === optimisticReservation.id ? serverReservation : r)),
            }))
            reportSuccess("Reserva confirmada", {
              detail: `Código ${serverReservation.confirmationCode}`,
              context: { reservationId: serverReservation.id, userId: reservationData.userId },
            })
            return serverReservation
          }

          return optimisticReservation
        } catch {
          reportError("Error al crear reserva", {
            detail: "Error de red al guardar reserva",
            context: { userId: reservationData.userId },
          })
          return optimisticReservation
        }
      },

      updateReservationStatus: async (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
        }))

        try {
          const response = await fetch("/api/reservations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
          })
          if (!response.ok) {
            reportError("Estado de reserva no persistido", {
              detail: "Cambio local no guardado en base de datos",
              context: { reservationId: id, status, code: response.status },
            })
            return
          }
          reportSuccess("Estado de reserva actualizado", {
            detail: `Nuevo estado: ${status}`,
            showToast: false,
            context: { reservationId: id, status },
          })
        } catch {
          reportError("Error al actualizar reserva", {
            detail: "Error de red al actualizar estado",
            context: { reservationId: id, status },
          })
        }
      },

      cancelReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status: "cancelled" as ReservationStatus } : r,
          ),
        }))

        void fetch("/api/reservations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "cancelled" }),
        }).then((response) => {
          if (!response.ok) {
            reportError("Cancelación no persistida", {
              detail: "La reserva se canceló localmente, pero no en base de datos",
              context: { reservationId: id, code: response.status },
            })
            return
          }
          reportSuccess("Reserva cancelada", {
            detail: "Cancelación guardada en base de datos",
            context: { reservationId: id },
          })
        }).catch(() => {
          reportError("Error al cancelar reserva", {
            detail: "Error de red durante cancelación",
            context: { reservationId: id },
          })
        })
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
