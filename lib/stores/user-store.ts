import { create } from "zustand"
import { persist } from "zustand/middleware"
import { reportError, reportSuccess } from "@/lib/client-feedback"

export type FanType = "familiar" | "visitante" | "ultra" | "turista"
export type TransportPreference = "metro" | "bus" | "coche" | "andando"
export type AtmospherePreference = "tranquilo" | "animado" | "hinchada"
export type ArrivalPreference = "temprano" | "justo" | "ultimo-minuto"

export interface UserProfile {
  id: string
  name: string
  email: string
  favoriteTeamId: string | null
  fanType: FanType
  transportPreference: TransportPreference
  atmospherePreference: AtmospherePreference
  arrivalPreference: ArrivalPreference
  level: number
  experience: number
  matchesAttended: number
  reviewsWritten: number
  stadiumsVisited: string[]
  badges: string[]
  createdAt: string
}

export interface StadiumVisit {
  id: string
  stadiumId: string
  stadiumName: string
  teamId: string
  teamName: string
  date: string
  matchId?: string
}

interface UserState {
  profile: UserProfile | null
  visits: StadiumVisit[]
  favoritePois: string[]
  isInitialized: boolean

  // Actions
  initializeUser: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setFavoriteTeam: (teamId: string | null) => void
  addStadiumVisit: (visit: Omit<StadiumVisit, "id">) => void
  toggleFavoritePoi: (poiId: string) => void
  addExperience: (amount: number) => void
  unlockBadge: (badgeId: string) => void
  incrementReviews: () => void
}

const DEFAULT_PROFILE: UserProfile = {
  id: "user-1",
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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      visits: [],
      favoritePois: [],
      isInitialized: false,

      

      initializeUser: () => {
        const state = get()
        if (state.isInitialized && state.profile) return

        let authData: { id?: string; name?: string; email?: string } = {}
        try {
          const raw = typeof window !== "undefined" ? localStorage.getItem("soccer-maps-auth") : null
          if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed?.state?.currentUser) {
              authData = parsed.state.currentUser
            }
          }
        } catch {
          // ignore parse errors
        }

        const fallbackProfile: UserProfile = {
          ...DEFAULT_PROFILE,
          id: authData.id || state.profile?.id || `user-${Date.now()}`,
          name: authData.name || state.profile?.name || DEFAULT_PROFILE.name,
          email: authData.email || state.profile?.email || DEFAULT_PROFILE.email,
        }

        void (async () => {
          try {
            const response = await fetch(`/api/profile?userId=${encodeURIComponent(fallbackProfile.id)}`)
            if (!response.ok) {
              reportError("Carga de perfil remota fallida", {
                detail: "Se usará perfil local temporal",
                context: { status: response.status, userId: fallbackProfile.id },
              })
              set({ profile: fallbackProfile, isInitialized: true })
              return
            }

            const data = await response.json()
            set({
              profile: data.profile || fallbackProfile,
              isInitialized: true,
            })

            reportSuccess("Perfil cargado", {
              detail: "Perfil sincronizado correctamente",
              showToast: false,
              context: { userId: fallbackProfile.id },
            })
          } catch {
            reportError("Carga de perfil fallida", {
              detail: "Se usará perfil local temporal",
              context: { userId: fallbackProfile.id },
            })
            set({ profile: fallbackProfile, isInitialized: true })
          }
        })()
      },

      updateProfile: (updates) => {
        const current = get().profile
        if (!current) return

        const next = { ...current, ...updates }
        set({ profile: next })

        void fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: next.id, ...updates }),
        }).then((response) => {
          if (!response.ok) {
            reportError("No se pudo guardar el perfil", {
              detail: "Los cambios locales no se persistieron en base de datos",
              context: { status: response.status, userId: next.id },
            })
            return
          }

          reportSuccess("Perfil guardado", {
            detail: "Cambios persistidos en base de datos",
            context: { userId: next.id },
          })
        }).catch(() => {
          reportError("No se pudo guardar el perfil", {
            detail: "Error de red al persistir cambios",
            context: { userId: next.id },
          })
        })
      },

      setFavoriteTeam: (teamId) => {
        const profile = get().profile
        if (!profile) return

        set({ profile: { ...profile, favoriteTeamId: teamId } })

        void fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: profile.id, favoriteTeamId: teamId }),
        }).then((response) => {
          if (!response.ok) {
            reportError("No se pudo guardar equipo favorito", {
              detail: "El cambio no se persistió en base de datos",
              context: { status: response.status, userId: profile.id, favoriteTeamId: teamId },
            })
            return
          }

          reportSuccess("Equipo favorito actualizado", {
            detail: "Cambio guardado correctamente",
            context: { userId: profile.id, favoriteTeamId: teamId },
          })
        }).catch(() => {
          reportError("No se pudo guardar equipo favorito", {
            detail: "Error de red al persistir cambio",
            context: { userId: profile.id, favoriteTeamId: teamId },
          })
        })
      },

      addStadiumVisit: (visit) => {
        const id = `visit-${Date.now()}`
        set((state) => {
          const newVisits = [...state.visits, { ...visit, id }]
          const stadiumsVisited = [...new Set([...state.profile!.stadiumsVisited, visit.stadiumId])]
          const matchesAttended = state.profile!.matchesAttended + 1

          // Check for badge unlocks
          const badges = [...state.profile!.badges]
          if (stadiumsVisited.length >= 3 && !badges.includes("explorer")) {
            badges.push("explorer")
          }
          if (matchesAttended >= 5 && !badges.includes("local-hero")) {
            badges.push("local-hero")
          }
          if (matchesAttended >= 10 && !badges.includes("passionate")) {
            badges.push("passionate")
          }

          return {
            visits: newVisits,
            profile: state.profile
              ? {
                  ...state.profile,
                  stadiumsVisited,
                  matchesAttended,
                  badges,
                  experience: state.profile.experience + 100,
                }
              : null,
          }
        })

        const nextProfile = get().profile
        if (nextProfile) {
          void fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: nextProfile.id, ...nextProfile }),
          }).then((response) => {
            if (!response.ok) {
              reportError("No se pudo guardar visita de estadio", {
                detail: "Los avances no se persistieron",
                context: { status: response.status, userId: nextProfile.id },
              })
              return
            }

            reportSuccess("Visita guardada", {
              detail: "Progreso del aficionado actualizado",
              context: { userId: nextProfile.id },
            })
          })
        }
      },

      toggleFavoritePoi: (poiId) => {
        set((state) => ({
          favoritePois: state.favoritePois.includes(poiId)
            ? state.favoritePois.filter((id) => id !== poiId)
            : [...state.favoritePois, poiId],
        }))

        reportSuccess("Favoritos actualizados", {
          detail: "Se actualizó tu lista de locales favoritos",
          showToast: false,
          context: { poiId },
        })
      },

      addExperience: (amount) => {
        set((state) => {
          if (!state.profile) return state
          const newExp = state.profile.experience + amount
          const newLevel = Math.floor(newExp / 500) + 1
          return {
            profile: {
              ...state.profile,
              experience: newExp,
              level: Math.min(newLevel, 10),
            },
          }
        })

        const nextProfile = get().profile
        if (nextProfile) {
          void fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: nextProfile.id, experience: nextProfile.experience, level: nextProfile.level }),
          }).then((response) => {
            if (!response.ok) {
              reportError("No se pudo guardar experiencia", {
                detail: "El progreso quedó solo en memoria local",
                context: { status: response.status, userId: nextProfile.id },
              })
            }
          })
        }
      },

      unlockBadge: (badgeId) => {
        set((state) => ({
          profile:
            state.profile && !state.profile.badges.includes(badgeId)
              ? { ...state.profile, badges: [...state.profile.badges, badgeId] }
              : state.profile,
        }))

        const nextProfile = get().profile
        if (nextProfile) {
          void fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: nextProfile.id, badges: nextProfile.badges }),
          }).then((response) => {
            if (!response.ok) {
              reportError("No se pudo guardar insignias", {
                detail: "Los cambios no se persistieron",
                context: { status: response.status, userId: nextProfile.id },
              })
            }
          })
        }
      },

      incrementReviews: () => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, reviewsWritten: state.profile.reviewsWritten + 1 } : null,
        }))

        const nextProfile = get().profile
        if (nextProfile) {
          void fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: nextProfile.id, reviewsWritten: nextProfile.reviewsWritten }),
          }).then((response) => {
            if (!response.ok) {
              reportError("No se pudo guardar contador de reseñas", {
                detail: "El cambio no se persistió",
                context: { status: response.status, userId: nextProfile.id },
              })
            }
          })
        }
      },
    }),
    {
      name: "soccer-maps-user",
    },
  ),
)
