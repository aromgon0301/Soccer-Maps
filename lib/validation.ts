import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z.string().trim().email("Email no valido"),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
})

export const loginSchema = z.object({
  email: z.string().trim().email("Email no valido"),
  password: z.string().min(1, "La contrasena es obligatoria"),
})

export const profileUpdateSchema = z.object({
  userId: z.string().min(1, "userId required"),
  name: z.string().optional(),
  email: z.union([z.string().email("Email no valido"), z.literal("")]).optional(),
  favoriteTeamId: z.string().nullable().optional(),
  fanType: z.enum(["familiar", "visitante", "ultra", "turista"]).optional(),
  transportPreference: z.enum(["metro", "bus", "coche", "andando"]).optional(),
  atmospherePreference: z.enum(["tranquilo", "animado", "hinchada"]).optional(),
  arrivalPreference: z.enum(["temprano", "justo", "ultimo-minuto"]).optional(),
  level: z.number().int().min(1).max(10).optional(),
  experience: z.number().int().min(0).optional(),
  matchesAttended: z.number().int().min(0).optional(),
  reviewsWritten: z.number().int().min(0).optional(),
  stadiumsVisited: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
})

export const reservationCreateSchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  userEmail: z.string().email(),
  userPhone: z.string().optional().default(""),
  poiId: z.string().min(1),
  poiName: z.string().min(1),
  poiType: z.enum(["bar", "restaurant", "parking"]),
  teamId: z.string().min(1),
  teamName: z.string().min(1),
  stadiumName: z.string().min(1),
  matchDate: z.string().min(1),
  guests: z.number().int().min(1),
  time: z.string().min(1),
  price: z.number().min(0),
  notes: z.string().optional(),
})

export const reservationPatchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
})

const matchSchema = z.object({
  homeTeamId: z.string(),
  homeTeamName: z.string(),
  homeTeamBadge: z.string(),
  awayTeamId: z.string(),
  awayTeamName: z.string(),
  awayTeamBadge: z.string(),
})

export const communityPostSchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  userLevel: z.number().int().min(1).max(10),
  userFavoriteTeamId: z.string().optional(),
  userFavoriteTeamName: z.string().optional(),
  userFavoriteTeamBadge: z.string().optional(),
  isPremium: z.boolean().optional(),
  content: z.string().trim().min(1),
  category: z.enum(["aviso", "recomendacion", "ambiente", "visitantes"]),
  rating: z.number().int().min(1).max(5).optional(),
  teamId: z.string().optional(),
  teamName: z.string().optional(),
  match: matchSchema.optional(),
  isGlobalPost: z.boolean(),
})

export const communityLikeSchema = z.object({
  userId: z.string().min(1, "userId required"),
})

export const communityReplySchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  userFavoriteTeamBadge: z.string().optional(),
  isPremium: z.boolean().optional(),
  content: z.string().trim().min(1),
})
