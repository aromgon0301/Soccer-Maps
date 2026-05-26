import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
}

interface RegisteredUser extends AuthUser {
  passwordHash: string
}

interface AuthState {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  registeredUsers: RegisteredUser[]
  error: string | null

  // Actions
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  clearError: () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

// Simple hash for demo purposes
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36) + str.length.toString(36)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      registeredUsers: [],
      error: null,

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 600))

        const { registeredUsers } = get()

        // Validate
        if (!name.trim()) {
          set({ isLoading: false, error: "El nombre es obligatorio" })
          return { success: false, error: "El nombre es obligatorio" }
        }

        if (!email.trim() || !email.includes("@")) {
          set({ isLoading: false, error: "Email no valido" })
          return { success: false, error: "Email no valido" }
        }

        if (password.length < 6) {
          set({ isLoading: false, error: "La contrasena debe tener al menos 6 caracteres" })
          return { success: false, error: "La contrasena debe tener al menos 6 caracteres" }
        }

        // Check duplicate email
        if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          set({ isLoading: false, error: "Ya existe una cuenta con este email" })
          return { success: false, error: "Ya existe una cuenta con este email" }
        }

        const newUser: RegisteredUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          passwordHash: simpleHash(password),
          createdAt: new Date().toISOString(),
        }

        const authUser: AuthUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        }

        set({
          registeredUsers: [...registeredUsers, newUser],
          currentUser: authUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        return { success: true }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 600))

        const { registeredUsers } = get()

        const user = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        )

        if (!user) {
          set({ isLoading: false, error: "No existe una cuenta con este email" })
          return { success: false, error: "No existe una cuenta con este email" }
        }

        if (user.passwordHash !== simpleHash(password)) {
          set({ isLoading: false, error: "Contrasena incorrecta" })
          return { success: false, error: "Contrasena incorrecta" }
        }

        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        }

        set({
          currentUser: authUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        return { success: true }
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),

      updateUser: (updates) => {
        set((state) => {
          if (!state.currentUser) return state

          const updatedUser = { ...state.currentUser, ...updates }

          // Also update in registeredUsers
          const updatedRegistered = state.registeredUsers.map((u) =>
            u.id === state.currentUser!.id ? { ...u, ...updates } : u
          )

          return {
            currentUser: updatedUser,
            registeredUsers: updatedRegistered,
          }
        })
      },
    }),
    {
      name: "soccer-maps-auth",
    },
  ),
)
