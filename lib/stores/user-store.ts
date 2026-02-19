import { create } from "zustand"

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

  initializeUser: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  setFavoriteTeam: (teamId: string) => Promise<void>
  addStadiumVisit: (visit: Omit<StadiumVisit, "id">) => Promise<void>
  toggleFavoritePoi: (poiId: string) => Promise<void>
  addExperience: (amount: number) => Promise<void>
  unlockBadge: (badgeId: string) => Promise<void>
  incrementReviews: () => Promise<void>
}

const USER_ID_KEY = "soccer-maps-user-id"

const getOrCreateUserId = () => {
  if (typeof window === "undefined") {
    return "user-ssr"
  }

  const existing = window.localStorage.getItem(USER_ID_KEY)
  if (existing) {
    return existing
  }

  const id = `user-${Date.now()}`
  window.localStorage.setItem(USER_ID_KEY, id)
  return id
}

const syncUserData = async (userId: string, profile: UserProfile, visits: StadiumVisit[], favoritePois: string[]) => {
  await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      profile,
      visits,
      favoritePois,
    }),
  })
}

export const useUserStore = create<UserState>()((set, get) => ({
  profile: null,
  visits: [],
  favoritePois: [],
  isInitialized: false,

  initializeUser: async () => {
    const userId = getOrCreateUserId()

    const response = await fetch(`/api/profile?userId=${encodeURIComponent(userId)}`)
    const data = await response.json()

    set({
      profile: data.profile,
      visits: data.visits ?? [],
      favoritePois: data.favoritePois ?? [],
      isInitialized: true,
    })
  },

  updateProfile: async (updates) => {
    const state = get()
    if (!state.profile) return

    const nextProfile = { ...state.profile, ...updates }
    set({ profile: nextProfile })
    await syncUserData(nextProfile.id, nextProfile, state.visits, state.favoritePois)
  },

  setFavoriteTeam: async (teamId) => {
    const state = get()
    if (!state.profile) return

    const nextProfile = { ...state.profile, favoriteTeamId: teamId }
    set({ profile: nextProfile })
    await syncUserData(nextProfile.id, nextProfile, state.visits, state.favoritePois)
  },

  addStadiumVisit: async (visit) => {
    const state = get()
    if (!state.profile) return

    const id = `visit-${Date.now()}`
    const nextVisits = [...state.visits, { ...visit, id }]
    const stadiumsVisited = [...new Set([...state.profile.stadiumsVisited, visit.stadiumId])]
    const matchesAttended = state.profile.matchesAttended + 1
    const badges = [...state.profile.badges]

    if (stadiumsVisited.length >= 3 && !badges.includes("explorer")) {
      badges.push("explorer")
    }
    if (matchesAttended >= 5 && !badges.includes("local-hero")) {
      badges.push("local-hero")
    }
    if (matchesAttended >= 10 && !badges.includes("passionate")) {
      badges.push("passionate")
    }

    const nextProfile = {
      ...state.profile,
      stadiumsVisited,
      matchesAttended,
      badges,
      experience: state.profile.experience + 100,
    }

    set({ visits: nextVisits, profile: nextProfile })
    await syncUserData(nextProfile.id, nextProfile, nextVisits, state.favoritePois)
  },

  toggleFavoritePoi: async (poiId) => {
    const state = get()
    if (!state.profile) return

    const nextFavoritePois = state.favoritePois.includes(poiId)
      ? state.favoritePois.filter((id) => id !== poiId)
      : [...state.favoritePois, poiId]

    set({ favoritePois: nextFavoritePois })
    await syncUserData(state.profile.id, state.profile, state.visits, nextFavoritePois)
  },

  addExperience: async (amount) => {
    const state = get()
    if (!state.profile) return

    const newExp = state.profile.experience + amount
    const newLevel = Math.floor(newExp / 500) + 1
    const nextProfile = {
      ...state.profile,
      experience: newExp,
      level: Math.min(newLevel, 10),
    }

    set({ profile: nextProfile })
    await syncUserData(nextProfile.id, nextProfile, state.visits, state.favoritePois)
  },

  unlockBadge: async (badgeId) => {
    const state = get()
    if (!state.profile || state.profile.badges.includes(badgeId)) return

    const nextProfile = { ...state.profile, badges: [...state.profile.badges, badgeId] }
    set({ profile: nextProfile })
    await syncUserData(nextProfile.id, nextProfile, state.visits, state.favoritePois)
  },

  incrementReviews: async () => {
    const state = get()
    if (!state.profile) return

    const nextProfile = { ...state.profile, reviewsWritten: state.profile.reviewsWritten + 1 }
    set({ profile: nextProfile })
    await syncUserData(nextProfile.id, nextProfile, state.visits, state.favoritePois)
  },
}))
