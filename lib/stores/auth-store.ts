import { create } from "zustand"
import { persist } from "zustand/middleware"
import { reportError, reportSuccess } from "@/lib/client-feedback"

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
}

interface AuthState {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  clearError: () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        reportSuccess("Intentando registrar usuario", {
          detail: "Procesando formulario de registro",
          showToast: false,
          context: { email },
        })
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          })

          const data = await response.json()
          if (!response.ok) {
            const error = data?.error || "No se pudo crear la cuenta"
            set({ isLoading: false, error })
            reportError("Registro fallido", { detail: error, context: { email } })
            return { success: false, error }
          }

          const authUser: AuthUser = data.user
          set({
            currentUser: authUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          reportSuccess("Registro completado", {
            detail: `Bienvenido, ${authUser.name}`,
            context: { userId: authUser.id },
          })

          return { success: true }
        } catch {
          const error = "No se pudo crear la cuenta"
          set({ isLoading: false, error })
          reportError("Registro fallido", { detail: error, context: { email } })
          return { success: false, error }
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        reportSuccess("Intentando iniciar sesión", {
          detail: "Validando credenciales",
          showToast: false,
          context: { email },
        })
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()
          if (!response.ok) {
            const error = data?.error || "No se pudo iniciar sesion"
            set({ isLoading: false, error })
            reportError("Inicio de sesión fallido", { detail: error, context: { email } })
            return { success: false, error }
          }

          const authUser: AuthUser = data.user
          set({
            currentUser: authUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          reportSuccess("Sesión iniciada", {
            detail: `Hola de nuevo, ${authUser.name}`,
            context: { userId: authUser.id },
          })

          return { success: true }
        } catch {
          const error = "No se pudo iniciar sesion"
          set({ isLoading: false, error })
          reportError("Inicio de sesión fallido", { detail: error, context: { email } })
          return { success: false, error }
        }
      },

      logout: () => {
        const currentUser = get().currentUser
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
        })
        reportSuccess("Sesión cerrada", {
          detail: "Has salido correctamente",
          context: { userId: currentUser?.id },
        })
      },

      clearError: () => set({ error: null }),

      updateUser: (updates) => {
        set((state) => {
          if (!state.currentUser) return state

          const updatedUser = { ...state.currentUser, ...updates }

          return {
            currentUser: updatedUser,
          }
        })

        reportSuccess("Perfil de sesión actualizado", {
          detail: "Los datos locales del usuario se actualizaron",
          showToast: false,
          context: { updates },
        })
      },
    }),
    {
      name: "soccer-maps-auth",
    },
  ),
)
