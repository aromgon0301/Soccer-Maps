import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PoiType = "bar" | "restaurant" | "parking" | "transport"
export type Atmosphere = "tranquilo" | "animado" | "familiar" | "hinchada"

export interface POI {
  id: string
  name: string
  type: PoiType
  teamId: string

  // Location
  distance: string
  walkingTime: string
  coordinates: {
    lat: number
    lng: number
  }
  address: string

  // Details
  description: string
  features: string[]
  atmosphere: Atmosphere
  priceRange: string

  // Availability
  openHours: string
  matchDayHours: string
  estimatedOccupancy: number

  // Ratings
  rating: number
  reviewCount: number

  // Reservation
  acceptsReservations: boolean
  reservationPrice: number

  // Images
  imageUrl?: string
}

interface PoisState {
  pois: POI[]
  loading: boolean

  // Actions
  getPoisByTeam: (teamId: string) => POI[]
  getPoisByType: (teamId: string, type: PoiType) => POI[]
  getPoiById: (id: string) => POI | undefined
  updateOccupancy: (id: string, occupancy: number) => void
}

// Comprehensive POI data for all teams
const ALL_POIS: POI[] = [
  // Barcelona POIs
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
    id: "bcn-bar-2",
    name: "Cervecería Camp Nou",
    type: "bar",
    teamId: "barcelona",
    distance: "200m",
    walkingTime: "3 min",
    coordinates: { lat: 41.3815, lng: 2.1235 },
    address: "Av. Joan XXIII, 45",
    description: "Amplio local con terraza ideal para grupos grandes.",
    features: ["Terraza", "Grupos", "Comida rápida", "Futbolín"],
    atmosphere: "animado",
    priceRange: "€€",
    openHours: "11:00 - 01:00",
    matchDayHours: "11:00 - 24:00",
    estimatedOccupancy: 45,
    rating: 4.3,
    reviewCount: 156,
    acceptsReservations: true,
    reservationPrice: 0,
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
    id: "bcn-park-2",
    name: "Parking Les Corts",
    type: "parking",
    teamId: "barcelona",
    distance: "400m",
    walkingTime: "5 min",
    coordinates: { lat: 41.3785, lng: 2.1195 },
    address: "Carrer de Bordeus, 15",
    description: "Más económico y con mejor salida post-partido.",
    features: ["Económico", "Fácil salida", "Cubierto"],
    atmosphere: "tranquilo",
    priceRange: "€€",
    openHours: "06:00 - 24:00",
    matchDayHours: "06:00 - 02:00",
    estimatedOccupancy: 60,
    rating: 4.0,
    reviewCount: 67,
    acceptsReservations: true,
    reservationPrice: 15,
  },
  {
    id: "bcn-trans-1",
    name: "Metro Les Corts (L3)",
    type: "transport",
    teamId: "barcelona",
    distance: "350m",
    walkingTime: "5 min",
    coordinates: { lat: 41.3775, lng: 2.118 },
    address: "Estación Les Corts, L3",
    description: "Línea verde directa al centro. Frecuencia aumentada días de partido.",
    features: ["L3 Verde", "Alta frecuencia", "Accesible"],
    atmosphere: "tranquilo",
    priceRange: "€",
    openHours: "05:00 - 24:00",
    matchDayHours: "Servicio extendido",
    estimatedOccupancy: 75,
    rating: 4.4,
    reviewCount: 445,
    acceptsReservations: false,
    reservationPrice: 0,
  },

  // Real Madrid POIs
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
    id: "rm-bar-2",
    name: "Cervecería Bernabéu",
    type: "bar",
    teamId: "real-madrid",
    distance: "180m",
    walkingTime: "2 min",
    coordinates: { lat: 40.4528, lng: -3.6875 },
    address: "Calle del Padre Damián, 23",
    description: "Local amplio perfecto para grupos y peñas.",
    features: ["Grupos grandes", "Pintxos", "Pantallas 4K"],
    atmosphere: "animado",
    priceRange: "€€",
    openHours: "11:00 - 01:00",
    matchDayHours: "11:00 - 24:00",
    estimatedOccupancy: 55,
    rating: 4.4,
    reviewCount: 289,
    acceptsReservations: true,
    reservationPrice: 0,
  },
  {
    id: "rm-rest-1",
    name: "Restaurante Puerta 57",
    type: "restaurant",
    teamId: "real-madrid",
    distance: "50m",
    walkingTime: "1 min",
    coordinates: { lat: 40.4535, lng: -3.6885 },
    address: "Dentro del Santiago Bernabéu",
    description: "Restaurante oficial dentro del estadio. Experiencia premium.",
    features: ["Oficial RM", "Vista campo", "Cocina gourmet", "VIP"],
    atmosphere: "familiar",
    priceRange: "€€€€",
    openHours: "13:00 - 16:00, 20:00 - 23:30",
    matchDayHours: "12:00 - 21:00",
    estimatedOccupancy: 90,
    rating: 4.6,
    reviewCount: 423,
    acceptsReservations: true,
    reservationPrice: 20,
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
    id: "rm-trans-1",
    name: "Metro Santiago Bernabéu (L10)",
    type: "transport",
    teamId: "real-madrid",
    distance: "100m",
    walkingTime: "1 min",
    coordinates: { lat: 40.4525, lng: -3.689 },
    address: "Estación Santiago Bernabéu, L10",
    description: "Acceso directo al estadio. La opción más cómoda.",
    features: ["L10", "Acceso directo", "Frecuencia alta"],
    atmosphere: "tranquilo",
    priceRange: "€",
    openHours: "06:00 - 01:30",
    matchDayHours: "Servicio extendido hasta 02:30",
    estimatedOccupancy: 85,
    rating: 4.5,
    reviewCount: 678,
    acceptsReservations: false,
    reservationPrice: 0,
  },

  // Atlético Madrid POIs
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
  {
    id: "atm-rest-1",
    name: "Territorio Atleti",
    type: "restaurant",
    teamId: "atletico-madrid",
    distance: "250m",
    walkingTime: "3 min",
    coordinates: { lat: 40.4358, lng: -3.5988 },
    address: "Calle Wanda, 8",
    description: "Gastronomía madrileña con espíritu atlético.",
    features: ["Cocina madrileña", "Terraza", "Grupos", "Menú partido"],
    atmosphere: "familiar",
    priceRange: "€€€",
    openHours: "12:00 - 23:30",
    matchDayHours: "12:00 - 21:30",
    estimatedOccupancy: 60,
    rating: 4.4,
    reviewCount: 234,
    acceptsReservations: true,
    reservationPrice: 10,
  },
  {
    id: "atm-park-1",
    name: "Parking Wanda",
    type: "parking",
    teamId: "atletico-madrid",
    distance: "150m",
    walkingTime: "2 min",
    coordinates: { lat: 40.437, lng: -3.5998 },
    address: "Acceso Parking Metropolitano",
    description: "Gran capacidad y buena salida post-partido.",
    features: ["Gran capacidad", "Vigilado", "Fácil acceso"],
    atmosphere: "tranquilo",
    priceRange: "€€€",
    openHours: "24 horas",
    matchDayHours: "Abre 4h antes",
    estimatedOccupancy: 75,
    rating: 4.1,
    reviewCount: 123,
    acceptsReservations: true,
    reservationPrice: 20,
  },
  {
    id: "atm-trans-1",
    name: "Metro Estadio Metropolitano (L7)",
    type: "transport",
    teamId: "atletico-madrid",
    distance: "100m",
    walkingTime: "1 min",
    coordinates: { lat: 40.4355, lng: -3.599 },
    address: "Estación Estadio Metropolitano, L7",
    description: "Línea 7 directa al centro. Servicio reforzado.",
    features: ["L7", "Directo centro", "Servicio reforzado"],
    atmosphere: "tranquilo",
    priceRange: "€",
    openHours: "06:00 - 01:30",
    matchDayHours: "Servicio extendido",
    estimatedOccupancy: 80,
    rating: 4.3,
    reviewCount: 456,
    acceptsReservations: false,
    reservationPrice: 0,
  },

  // Sevilla POIs
  {
    id: "sev-bar-1",
    name: "Bar Nervión",
    type: "bar",
    teamId: "sevilla",
    distance: "180m",
    walkingTime: "2 min",
    coordinates: { lat: 37.384, lng: -5.9705 },
    address: "Av. Eduardo Dato, 45",
    description: "Tapas sevillanas y ambiente previo al partido.",
    features: ["Tapas", "Rebujito", "Flamenco ocasional"],
    atmosphere: "animado",
    priceRange: "€€",
    openHours: "10:00 - 01:00",
    matchDayHours: "10:00 - 23:00",
    estimatedOccupancy: 55,
    rating: 4.4,
    reviewCount: 189,
    acceptsReservations: true,
    reservationPrice: 0,
  },

  // Valencia POIs
  {
    id: "val-bar-1",
    name: "Bar Mestalla",
    type: "bar",
    teamId: "valencia",
    distance: "150m",
    walkingTime: "2 min",
    coordinates: { lat: 39.4745, lng: -0.3583 },
    address: "Av. Suecia, 12",
    description: "Clásico valencianista con buenas tapas.",
    features: ["Tapas valencianas", "Paella", "Ambiente"],
    atmosphere: "animado",
    priceRange: "€€",
    openHours: "10:00 - 01:00",
    matchDayHours: "10:00 - 23:00",
    estimatedOccupancy: 60,
    rating: 4.3,
    reviewCount: 156,
    acceptsReservations: true,
    reservationPrice: 0,
  },

  // Athletic Bilbao POIs
  {
    id: "ath-bar-1",
    name: "Txoko San Mamés",
    type: "bar",
    teamId: "athletic-bilbao",
    distance: "200m",
    walkingTime: "3 min",
    coordinates: { lat: 43.2641, lng: -2.9495 },
    address: "Calle Luis Briñas, 8",
    description: "Pintxos de calidad y sidra en ambiente athletic.",
    features: ["Pintxos", "Sidra", "Tradición vasca"],
    atmosphere: "hinchada",
    priceRange: "€€",
    openHours: "10:00 - 01:00",
    matchDayHours: "10:00 - 24:00",
    estimatedOccupancy: 65,
    rating: 4.6,
    reviewCount: 234,
    acceptsReservations: true,
    reservationPrice: 5,
  },

  // Real Sociedad POIs
  {
    id: "rso-bar-1",
    name: "Bar Anoeta",
    type: "bar",
    teamId: "real-sociedad",
    distance: "180m",
    walkingTime: "2 min",
    coordinates: { lat: 43.3015, lng: -1.9735 },
    address: "Paseo de Anoeta, 22",
    description: "El punto de encuentro txuri-urdin.",
    features: ["Pintxos", "Txakoli", "Vista estadio"],
    atmosphere: "animado",
    priceRange: "€€",
    openHours: "10:00 - 01:00",
    matchDayHours: "10:00 - 24:00",
    estimatedOccupancy: 50,
    rating: 4.4,
    reviewCount: 167,
    acceptsReservations: true,
    reservationPrice: 0,
  },

  // Real Betis POIs
  {
    id: "bet-bar-1",
    name: "La Taberna Verdiblanca",
    type: "bar",
    teamId: "real-betis",
    distance: "200m",
    walkingTime: "3 min",
    coordinates: { lat: 37.3565, lng: -5.9815 },
    address: "Av. de la Palmera, 89",
    description: "Corazón bético con las mejores tapas de Heliópolis.",
    features: ["Tapas", "Ambiente bético", "Terraza"],
    atmosphere: "hinchada",
    priceRange: "€€",
    openHours: "10:00 - 01:00",
    matchDayHours: "10:00 - 24:00",
    estimatedOccupancy: 70,
    rating: 4.5,
    reviewCount: 212,
    acceptsReservations: true,
    reservationPrice: 5,
  },

  // Villarreal POIs
  {
    id: "vil-bar-1",
    name: "Bar El Submarino",
    type: "bar",
    teamId: "villarreal",
    distance: "150m",
    walkingTime: "2 min",
    coordinates: { lat: 39.944, lng: -0.1035 },
    address: "Calle José Pascual Tirado, 15",
    description: "El bar amarillo por excelencia.",
    features: ["Cocina local", "Ambiente familiar", "Económico"],
    atmosphere: "familiar",
    priceRange: "€",
    openHours: "10:00 - 24:00",
    matchDayHours: "10:00 - 23:00",
    estimatedOccupancy: 45,
    rating: 4.3,
    reviewCount: 89,
    acceptsReservations: true,
    reservationPrice: 0,
  },
]

export const usePoisStore = create<PoisState>()(
  persist(
    (set, get) => ({
      pois: ALL_POIS,
      loading: false,

      getPoisByTeam: (teamId) => {
        return get().pois.filter((p) => p.teamId === teamId)
      },

      getPoisByType: (teamId, type) => {
        return get().pois.filter((p) => p.teamId === teamId && p.type === type)
      },

      getPoiById: (id) => {
        return get().pois.find((p) => p.id === id)
      },

      updateOccupancy: (id, occupancy) => {
        set((state) => ({
          pois: state.pois.map((p) => (p.id === id ? { ...p, estimatedOccupancy: occupancy } : p)),
        }))
      },
    }),
    {
      name: "soccer-maps-pois",
    },
  ),
)
