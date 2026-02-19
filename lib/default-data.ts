export type PostCategory = "aviso" | "recomendacion" | "ambiente" | "visitantes" | "pregunta"

export interface MatchSelection {
  homeTeamId: string
  homeTeamName: string
  homeTeamBadge: string
  awayTeamId: string
  awayTeamName: string
  awayTeamBadge: string
}

export interface CommunityReply {
  id: string
  userId: string
  userName: string
  userFavoriteTeamBadge?: string
  isPremium?: boolean
  content: string
  createdAt: string
  likes: number
  likedBy: string[]
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userLevel: number
  userFavoriteTeamId?: string
  userFavoriteTeamName?: string
  userFavoriteTeamBadge?: string
  isPremium?: boolean
  content: string
  category: PostCategory
  rating?: number
  teamId?: string
  teamName?: string
  match?: MatchSelection
  isGlobalPost?: boolean
  likes: number
  likedBy: string[]
  replies: CommunityReply[]
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  favoriteTeamId: string | null
  fanType: string
  transportPreference: string
  atmospherePreference: string
  arrivalPreference: string
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

export interface UserDocument {
  userId: string
  profile: UserProfile
  visits: StadiumVisit[]
  favoritePois: string[]
  updatedAt: string
}

export const createDefaultProfile = (userId: string): UserProfile => ({
  id: userId,
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
})

export const SAMPLE_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    userId: "user-sample-1",
    userName: "Carlos M.",
    userLevel: 4,
    content: "El Bar Los Aficionados cerca del estadio es increíble. Precios buenos y ambiente genial antes del partido.",
    category: "recomendacion",
    rating: 5,
    teamId: "barcelona",
    teamName: "FC Barcelona",
    isGlobalPost: false,
    likes: 24,
    likedBy: [],
    replies: [
      {
        id: "reply-1",
        userId: "user-sample-2",
        userName: "Laura P.",
        content: "Totalmente de acuerdo! El personal es muy amable.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 5,
        likedBy: [],
      },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "post-2",
    userId: "user-sample-2",
    userName: "María G.",
    userLevel: 3,
    content: "Recomiendo llegar 1 hora antes. El acceso norte es el más rápido, casi sin colas.",
    category: "aviso",
    teamId: "barcelona",
    teamName: "FC Barcelona",
    isGlobalPost: false,
    likes: 18,
    likedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "post-3",
    userId: "user-sample-3",
    userName: "Javier R.",
    userLevel: 5,
    content: "Parking Sur es la mejor opción. Un poco más caro pero muy cerca y sin esperas para salir.",
    category: "recomendacion",
    rating: 4,
    teamId: "real-madrid",
    teamName: "Real Madrid",
    isGlobalPost: false,
    likes: 12,
    likedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
]

export const SAMPLE_POIS = [
  {
    id: "bcn-bar-1",
    name: "Bar La Penya Blaugrana",
    type: "bar",
    teamId: "barcelona",
    distance: "150m",
    walkingTime: "2 min",
    coordinates: { lat: 41.3809, lng: 2.1228 },
    address: "Carrer d'Arístides Maillol, 12",
    description: "Bar tradicional con ambiente blaugrana. Perfecto para calentar antes del partido.",
    features: ["Pantallas grandes", "Tapas", "Cerveza fría", "Wifi"],
    atmosphere: "hinchada",
    priceRange: "€€",
    openHours: "10:00 - 02:00",
    matchDayHours: "10:00 - 23:00",
    estimatedOccupancy: 65,
    rating: 4.6,
    reviewCount: 234,
    acceptsReservations: true,
    reservationPrice: 5,
  },
  {
    id: "bcn-rest-1",
    name: "Restaurante El Gol",
    type: "restaurant",
    teamId: "barcelona",
    distance: "300m",
    walkingTime: "4 min",
    coordinates: { lat: 41.3795, lng: 2.121 },
    address: "Carrer de Numància, 88",
    description: "Cocina catalana con vistas al estadio. Menú especial día de partido.",
    features: ["Cocina catalana", "Vistas estadio", "Menú partido", "Reservas online"],
    atmosphere: "familiar",
    priceRange: "€€€",
    openHours: "12:00 - 23:30",
    matchDayHours: "12:00 - 21:00",
    estimatedOccupancy: 70,
    rating: 4.5,
    reviewCount: 312,
    acceptsReservations: true,
    reservationPrice: 10,
  },
  {
    id: "bcn-park-1",
    name: "Parking Nord Camp Nou",
    type: "parking",
    teamId: "barcelona",
    distance: "100m",
    walkingTime: "1 min",
    coordinates: { lat: 41.3825, lng: 2.123 },
    address: "Acceso Norte Camp Nou",
    description: "Parking oficial con acceso directo al estadio.",
    features: ["Vigilado 24h", "Acceso directo", "Reserva online", "Carga eléctrica"],
    atmosphere: "tranquilo",
    priceRange: "€€€",
    openHours: "24 horas",
    matchDayHours: "Abre 4h antes del partido",
    estimatedOccupancy: 85,
    rating: 4.2,
    reviewCount: 89,
    acceptsReservations: true,
    reservationPrice: 25,
  },
  {
    id: "rm-bar-1",
    name: "La Casa Blanca Sports Bar",
    type: "bar",
    teamId: "real-madrid",
    distance: "120m",
    walkingTime: "2 min",
    coordinates: { lat: 40.4531, lng: -3.6883 },
    address: "Paseo de la Castellana, 142",
    description: "El bar madridista por excelencia. Historia y tradición blanca.",
    features: ["Memorabilia RM", "Cañas perfectas", "Historia", "Ambiente único"],
    atmosphere: "hinchada",
    priceRange: "€€",
    openHours: "10:00 - 02:00",
    matchDayHours: "10:00 - 24:00",
    estimatedOccupancy: 80,
    rating: 4.7,
    reviewCount: 567,
    acceptsReservations: true,
    reservationPrice: 5,
  },
  {
    id: "rm-park-1",
    name: "Parking Santiago Bernabéu",
    type: "parking",
    teamId: "real-madrid",
    distance: "0m",
    walkingTime: "0 min",
    coordinates: { lat: 40.453, lng: -3.688 },
    address: "Subterráneo del estadio",
    description: "Parking oficial bajo el estadio. Acceso VIP disponible.",
    features: ["Oficial", "Subterráneo", "Carga eléctrica", "Seguridad 24h"],
    atmosphere: "tranquilo",
    priceRange: "€€€€",
    openHours: "24 horas",
    matchDayHours: "Reserva obligatoria",
    estimatedOccupancy: 95,
    rating: 4.3,
    reviewCount: 156,
    acceptsReservations: true,
    reservationPrice: 35,
  },
  {
    id: "atm-bar-1",
    name: "Bar Rojiblanco",
    type: "bar",
    teamId: "atletico-madrid",
    distance: "200m",
    walkingTime: "3 min",
    coordinates: { lat: 40.4363, lng: -3.5995 },
    address: "Av. Luis Aragonés, 15",
    description: "El corazón colchonero. Ambiente auténtico de hinchada.",
    features: ["Auténtico", "Bufandas", "Cánticos", "Cerveza fría"],
    atmosphere: "hinchada",
    priceRange: "€€",
    openHours: "10:00 - 02:00",
    matchDayHours: "10:00 - 24:00",
    estimatedOccupancy: 70,
    rating: 4.5,
    reviewCount: 345,
    acceptsReservations: true,
    reservationPrice: 5,
  },
]
