"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Locale = "es" | "en"

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
  initializeLocale: () => void
  t: (key: string, params?: Record<string, string | number>) => string
}

// Spanish translations
const es: Record<string, string> = {
  // Navigation
  "nav.home": "Inicio",
  "nav.profile": "Mi Perfil",
  "nav.premium": "Premium",
  "nav.comparator": "Comparador",
  "nav.login": "Entrar",
  "nav.register": "Registro",
  "nav.logout": "Cerrar Sesion",
  "nav.subscription": "Suscripcion",
  "nav.back": "Volver",
  
  // Header
  "header.subtitle": "La Liga",
  
  // Theme
  "theme.light": "Claro",
  "theme.dark": "Oscuro",
  "theme.system": "Sistema",
  "theme.title": "Tema",
  
  // Language
  "lang.spanish": "Espanol",
  "lang.english": "Ingles",
  "lang.title": "Idioma",
  
  // Home page
  "home.hero.title": "Descubre los estadios de La Liga",
  "home.hero.subtitle": "Mapas interactivos, guias de ciudad y experiencias unicas para cada partido",
  "home.search.placeholder": "Buscar equipo...",
  "home.teams.title": "Equipos de La Liga",
  "home.teams.subtitle": "Selecciona un equipo para explorar su estadio",
  "home.community.title": "Comunidad",
  "home.features.maps": "Mapas interactivos",
  "home.features.guides": "Guias de ciudad",
  "home.features.matchday": "Dia de partido",
  
  // Team page
  "team.stadium": "Estadio",
  "team.capacity": "Capacidad",
  "team.founded": "Fundado en",
  "team.city": "Ciudad",
  "team.colors": "Colores",
  "team.history": "Historia",
  "team.cityInfo": "Informacion de la ciudad",
  "team.climate": "Clima",
  "team.areas": "Zonas recomendadas",
  "team.tabs.club": "Club",
  "team.tabs.city": "Ciudad",
  "team.tabs.stadium": "Estadio",
  "team.tabs.matchday": "Dia de Partido",
  "team.tabs.visitors": "Visitantes",
  "team.tabs.reservations": "Reservas",
  "team.tabs.community": "Comunidad",
  "team.planMatchDay": "Planificar Dia de Partido",
  
  // Match Day
  "matchday.title": "Dia de Partido",
  "matchday.countdown": "Cuenta atras",
  "matchday.days": "dias",
  "matchday.hours": "horas",
  "matchday.minutes": "min",
  "matchday.seconds": "seg",
  "matchday.nextMatch": "Proximo partido",
  "matchday.weather": "Prevision del tiempo",
  "matchday.access": "Acceso recomendado",
  "matchday.transport": "Transporte",
  "matchday.metro": "Metro",
  "matchday.bus": "Autobus",
  "matchday.parking": "Aparcamiento",
  "matchday.rules": "Normas del estadio",
  "matchday.tips": "Consejos para visitantes",
  "matchday.share": "Compartir",
  "matchday.save": "Guardar",
  "matchday.gate": "Puerta",
  "matchday.waitTime": "Tiempo de espera",
  "matchday.recommended": "Recomendado",
  
  // Visitor Mode
  "visitor.title": "Modo Visitante",
  "visitor.subtitle": "Guia para aficionados visitantes",
  "visitor.safeZones": "Zonas seguras",
  "visitor.cautionZones": "Zonas con precaucion",
  "visitor.avoidZones": "Zonas a evitar",
  "visitor.myLocation": "Mi ubicacion",
  "visitor.routeToStadium": "Ruta al estadio",
  "visitor.distance": "Distancia",
  "visitor.walkTime": "Tiempo a pie",
  "visitor.tips": "Consejos locales",
  "visitor.pois": "Puntos de interes",
  "visitor.bars": "Bares",
  "visitor.restaurants": "Restaurantes",
  "visitor.hotels": "Hoteles",
  "visitor.transport": "Transporte",
  "visitor.parking": "Aparcamiento",
  
  // Reservations
  "reservations.title": "Reservas",
  "reservations.bars": "Bares",
  "reservations.restaurants": "Restaurantes",
  "reservations.parking": "Aparcamiento",
  "reservations.book": "Reservar",
  "reservations.booked": "Reservado",
  "reservations.available": "Disponible",
  "reservations.occupancy": "Ocupacion",
  "reservations.distance": "Distancia",
  "reservations.atmosphere": "Ambiente",
  "reservations.rating": "Valoracion",
  "reservations.recommended": "Recomendado para ti",
  
  // Community
  "community.title": "Comunidad",
  "community.post": "Publicar",
  "community.placeholder": "Comparte tu experiencia...",
  "community.like": "Me gusta",
  "community.reply": "Responder",
  "community.replies": "respuestas",
  "community.categories.all": "Todo",
  "community.categories.alert": "Aviso",
  "community.categories.recommendation": "Recomendacion",
  "community.categories.atmosphere": "Ambiente",
  "community.categories.question": "Pregunta",
  
  // Profile
  "profile.title": "Mi Perfil",
  "profile.edit": "Editar perfil",
  "profile.save": "Guardar cambios",
  "profile.cancel": "Cancelar",
  "profile.name": "Nombre",
  "profile.email": "Correo electronico",
  "profile.favoriteTeam": "Equipo favorito",
  "profile.fanType": "Tipo de aficionado",
  "profile.preferences": "Preferencias",
  "profile.transportPreference": "Transporte preferido",
  "profile.atmospherePreference": "Ambiente preferido",
  "profile.arrivalPreference": "Llegada preferida",
  "profile.stadiumsVisited": "Estadios visitados",
  "profile.matchesAttended": "Partidos asistidos",
  "profile.badges": "Insignias",
  "profile.reservations": "Mis reservas",
  "profile.level": "Nivel",
  
  // Premium
  "premium.title": "Premium",
  "premium.subtitle": "Mejora tu experiencia Soccer Maps",
  "premium.free": "Gratis",
  "premium.fan": "Fan",
  "premium.ultra": "Ultra",
  "premium.monthly": "Mensual",
  "premium.yearly": "Anual",
  "premium.currentPlan": "Plan actual",
  "premium.upgrade": "Mejorar",
  "premium.features": "Caracteristicas",
  "premium.subscribe": "Suscribirse",
  "premium.cancel": "Cancelar suscripcion",
  
  // Comparator
  "comparator.title": "Comparador de Estadios",
  "comparator.subtitle": "Compara hasta 3 estadios",
  "comparator.select": "Seleccionar estadio",
  "comparator.capacity": "Capacidad",
  "comparator.accessibility": "Accesibilidad",
  "comparator.atmosphere": "Ambiente",
  "comparator.transport": "Transporte",
  "comparator.visibility": "Visibilidad",
  "comparator.services": "Servicios",
  "comparator.safety": "Seguridad",
  "comparator.overall": "Puntuacion general",
  
  // Auth
  "auth.login": "Iniciar sesion",
  "auth.register": "Registrarse",
  "auth.email": "Correo electronico",
  "auth.password": "Contrasena",
  "auth.confirmPassword": "Confirmar contrasena",
  "auth.name": "Nombre completo",
  "auth.favoriteTeam": "Equipo favorito",
  "auth.forgotPassword": "Olvide mi contrasena",
  "auth.noAccount": "No tienes cuenta?",
  "auth.hasAccount": "Ya tienes cuenta?",
  "auth.loginSuccess": "Sesion iniciada correctamente",
  "auth.registerSuccess": "Cuenta creada correctamente",
  "auth.logout": "Cerrar sesion",
  
  // Common
  "common.loading": "Cargando...",
  "common.error": "Error",
  "common.success": "Exito",
  "common.save": "Guardar",
  "common.cancel": "Cancelar",
  "common.confirm": "Confirmar",
  "common.delete": "Eliminar",
  "common.edit": "Editar",
  "common.view": "Ver",
  "common.close": "Cerrar",
  "common.search": "Buscar",
  "common.filter": "Filtrar",
  "common.sort": "Ordenar",
  "common.all": "Todo",
  "common.none": "Ninguno",
  "common.yes": "Si",
  "common.no": "No",
  "common.or": "o",
  "common.and": "y",
  "common.km": "km",
  "common.min": "min",
  "common.people": "personas",
  
  // Footer
  "footer.rights": "Todos los derechos reservados",
}

// English translations
const en: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.profile": "My Profile",
  "nav.premium": "Premium",
  "nav.comparator": "Comparator",
  "nav.login": "Login",
  "nav.register": "Register",
  "nav.logout": "Logout",
  "nav.subscription": "Subscription",
  "nav.back": "Back",
  
  // Header
  "header.subtitle": "La Liga",
  
  // Theme
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "theme.title": "Theme",
  
  // Language
  "lang.spanish": "Spanish",
  "lang.english": "English",
  "lang.title": "Language",
  
  // Home page
  "home.hero.title": "Discover La Liga stadiums",
  "home.hero.subtitle": "Interactive maps, city guides and unique experiences for every match",
  "home.search.placeholder": "Search team...",
  "home.teams.title": "La Liga Teams",
  "home.teams.subtitle": "Select a team to explore their stadium",
  "home.community.title": "Community",
  "home.features.maps": "Interactive maps",
  "home.features.guides": "City guides",
  "home.features.matchday": "Match day",
  
  // Team page
  "team.stadium": "Stadium",
  "team.capacity": "Capacity",
  "team.founded": "Founded in",
  "team.city": "City",
  "team.colors": "Colors",
  "team.history": "History",
  "team.cityInfo": "City information",
  "team.climate": "Climate",
  "team.areas": "Recommended areas",
  "team.tabs.club": "Club",
  "team.tabs.city": "City",
  "team.tabs.stadium": "Stadium",
  "team.tabs.matchday": "Match Day",
  "team.tabs.visitors": "Visitors",
  "team.tabs.reservations": "Reservations",
  "team.tabs.community": "Community",
  "team.planMatchDay": "Plan Match Day",
  
  // Match Day
  "matchday.title": "Match Day",
  "matchday.countdown": "Countdown",
  "matchday.days": "days",
  "matchday.hours": "hours",
  "matchday.minutes": "min",
  "matchday.seconds": "sec",
  "matchday.nextMatch": "Next match",
  "matchday.weather": "Weather forecast",
  "matchday.access": "Recommended access",
  "matchday.transport": "Transport",
  "matchday.metro": "Metro",
  "matchday.bus": "Bus",
  "matchday.parking": "Parking",
  "matchday.rules": "Stadium rules",
  "matchday.tips": "Visitor tips",
  "matchday.share": "Share",
  "matchday.save": "Save",
  "matchday.gate": "Gate",
  "matchday.waitTime": "Wait time",
  "matchday.recommended": "Recommended",
  
  // Visitor Mode
  "visitor.title": "Visitor Mode",
  "visitor.subtitle": "Guide for visiting fans",
  "visitor.safeZones": "Safe zones",
  "visitor.cautionZones": "Caution zones",
  "visitor.avoidZones": "Avoid zones",
  "visitor.myLocation": "My location",
  "visitor.routeToStadium": "Route to stadium",
  "visitor.distance": "Distance",
  "visitor.walkTime": "Walk time",
  "visitor.tips": "Local tips",
  "visitor.pois": "Points of interest",
  "visitor.bars": "Bars",
  "visitor.restaurants": "Restaurants",
  "visitor.hotels": "Hotels",
  "visitor.transport": "Transport",
  "visitor.parking": "Parking",
  
  // Reservations
  "reservations.title": "Reservations",
  "reservations.bars": "Bars",
  "reservations.restaurants": "Restaurants",
  "reservations.parking": "Parking",
  "reservations.book": "Book",
  "reservations.booked": "Booked",
  "reservations.available": "Available",
  "reservations.occupancy": "Occupancy",
  "reservations.distance": "Distance",
  "reservations.atmosphere": "Atmosphere",
  "reservations.rating": "Rating",
  "reservations.recommended": "Recommended for you",
  
  // Community
  "community.title": "Community",
  "community.post": "Post",
  "community.placeholder": "Share your experience...",
  "community.like": "Like",
  "community.reply": "Reply",
  "community.replies": "replies",
  "community.categories.all": "All",
  "community.categories.alert": "Alert",
  "community.categories.recommendation": "Recommendation",
  "community.categories.atmosphere": "Atmosphere",
  "community.categories.question": "Question",
  
  // Profile
  "profile.title": "My Profile",
  "profile.edit": "Edit profile",
  "profile.save": "Save changes",
  "profile.cancel": "Cancel",
  "profile.name": "Name",
  "profile.email": "Email",
  "profile.favoriteTeam": "Favorite team",
  "profile.fanType": "Fan type",
  "profile.preferences": "Preferences",
  "profile.transportPreference": "Transport preference",
  "profile.atmospherePreference": "Atmosphere preference",
  "profile.arrivalPreference": "Arrival preference",
  "profile.stadiumsVisited": "Stadiums visited",
  "profile.matchesAttended": "Matches attended",
  "profile.badges": "Badges",
  "profile.reservations": "My reservations",
  "profile.level": "Level",
  
  // Premium
  "premium.title": "Premium",
  "premium.subtitle": "Upgrade your Soccer Maps experience",
  "premium.free": "Free",
  "premium.fan": "Fan",
  "premium.ultra": "Ultra",
  "premium.monthly": "Monthly",
  "premium.yearly": "Yearly",
  "premium.currentPlan": "Current plan",
  "premium.upgrade": "Upgrade",
  "premium.features": "Features",
  "premium.subscribe": "Subscribe",
  "premium.cancel": "Cancel subscription",
  
  // Comparator
  "comparator.title": "Stadium Comparator",
  "comparator.subtitle": "Compare up to 3 stadiums",
  "comparator.select": "Select stadium",
  "comparator.capacity": "Capacity",
  "comparator.accessibility": "Accessibility",
  "comparator.atmosphere": "Atmosphere",
  "comparator.transport": "Transport",
  "comparator.visibility": "Visibility",
  "comparator.services": "Services",
  "comparator.safety": "Safety",
  "comparator.overall": "Overall score",
  
  // Auth
  "auth.login": "Login",
  "auth.register": "Register",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm password",
  "auth.name": "Full name",
  "auth.favoriteTeam": "Favorite team",
  "auth.forgotPassword": "Forgot password",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.loginSuccess": "Logged in successfully",
  "auth.registerSuccess": "Account created successfully",
  "auth.logout": "Logout",
  
  // Common
  "common.loading": "Loading...",
  "common.error": "Error",
  "common.success": "Success",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.view": "View",
  "common.close": "Close",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.sort": "Sort",
  "common.all": "All",
  "common.none": "None",
  "common.yes": "Yes",
  "common.no": "No",
  "common.or": "or",
  "common.and": "and",
  "common.km": "km",
  "common.min": "min",
  "common.people": "people",
  
  // Footer
  "footer.rights": "All rights reserved",
}

const translations: Record<Locale, Record<string, string>> = { es, en }

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: "es",

      setLocale: (locale: Locale) => {
        set({ locale })
        if (typeof window !== "undefined") {
          document.documentElement.lang = locale
        }
      },

      initializeLocale: () => {
        const { locale } = get()
        
        // If no stored preference, detect browser language
        if (typeof window !== "undefined") {
          const storedLocale = localStorage.getItem("soccer-maps-i18n")
          if (!storedLocale) {
            const browserLang = navigator.language.split("-")[0]
            const detectedLocale: Locale = browserLang === "en" ? "en" : "es"
            set({ locale: detectedLocale })
            document.documentElement.lang = detectedLocale
          } else {
            document.documentElement.lang = locale
          }
        }
      },

      t: (key: string, params?: Record<string, string | number>) => {
        const { locale } = get()
        let text = translations[locale][key] || translations.es[key] || key
        
        if (params) {
          Object.entries(params).forEach(([param, value]) => {
            text = text.replace(new RegExp(`{${param}}`, "g"), String(value))
          })
        }
        
        return text
      },
    }),
    {
      name: "soccer-maps-i18n",
      partialize: (state) => ({ locale: state.locale }),
    }
  )
)
