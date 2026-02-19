import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  setFavoriteTeam: (teamId: string) => void
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
        if (!state.profile) {
          // Try to get auth user info
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

          set({
            profile: {
              ...DEFAULT_PROFILE,
              id: authData.id || `user-${Date.now()}`,
              name: authData.name || DEFAULT_PROFILE.name,
              email: authData.email || DEFAULT_PROFILE.email,
            },
            isInitialized: true,
          })
        } else {
          set({ isInitialized: true })
        }
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }))
      },

      setFavoriteTeam: (teamId) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, favoriteTeamId: teamId } : null,
        }))
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
      },

      toggleFavoritePoi: (poiId) => {
        set((state) => ({
          favoritePois: state.favoritePois.includes(poiId)
            ? state.favoritePois.filter((id) => id !== poiId)
            : [...state.favoritePois, poiId],
        }))
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
      },

      unlockBadge: (badgeId) => {
        set((state) => ({
          profile:
            state.profile && !state.profile.badges.includes(badgeId)
              ? { ...state.profile, badges: [...state.profile.badges, badgeId] }
              : state.profile,
        }))
      },

      incrementReviews: () => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, reviewsWritten: state.profile.reviewsWritten + 1 } : null,
        }))
      },
    }),
    {
      name: "soccer-maps-user",
    },
  ),
)
