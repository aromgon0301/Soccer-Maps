"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Language = "es" | "en"

const translations = {
  es: {
    // Header
    soccerMaps: "Soccer Maps",
    laLiga: "La Liga",
    premium: "Premium",
    comparator: "Comparador",
    myProfile: "Mi Perfil",
    subscription: "Suscripcion",
    logout: "Cerrar Sesion",
    login: "Entrar",
    register: "Registro",
    back: "Volver",

    // Hero
    exploreStadiums: "Explora los estadios de La Liga",
    heroSubtitle: "Información completa, mapas interactivos y comunidad de aficionados.",
    searchPlaceholder: "Buscar por equipo o ciudad...",

    // Quick actions
    compareStadiums: "Comparar Estadios",
    compareSubtitle: "Compara hasta 3 estadios",
    myProfileTitle: "Mi Perfil",
    profileSubtitle: "Visitas, insignias y progreso",
    premiumTitle: "Premium",
    premiumSubtitle: "Desbloquea todas las funciones",

    // Teams
    selectTeam: "Selecciona tu equipo",
    laLigaTeams: "Los 20 equipos de LaLiga",

    // Auth banner
    registerFree: "Registrate gratis para:",
    saveFavorites: "Guardar favoritos",
    checkIn: "Hacer check-in",
    postCommunity: "Publicar en comunidad",
    createAccount: "Crear Cuenta",

    // Footer
    aboutUs: "Sobre nosotros",
    aboutSoccerMaps: "Sobre Soccer Maps",
    contact: "Contacto",
    collaborations: "Colaboraciones",
    press: "Prensa",
    help: "Ayuda",
    faq: "FAQ",
    support: "Soporte",
    usageGuide: "Guia de uso",
    feedback: "Feedback",
    legal: "Legal",
    terms: "Terminos de uso",
    privacy: "Privacidad",
    cookies: "Cookies",
    legalNotice: "Aviso legal",
    footerDesc: "Tu guia definitiva para estadios y ciudades de La Liga espanola.",
    allRightsReserved: "Todos los derechos reservados.",

    // Team page
    backToTeams: "Volver a equipos",
    founded: "Fundado",
    capacity: "Capacidad",
    fromCenter: "Del centro",
    region: "Region",
    planMatchDay: "Planifica tu Dia de Partido",
    planMatchDayDesc: "Guia paso a paso personalizada para tu visita al",
    clubTab: "Club",
    cityTab: "Ciudad",
    stadiumTab: "Estadio",
    reservationsTab: "Reservas",
    visitorTab: "Visitante",
    matchdayTab: "Dia Partido",
    communityTab: "Comunidad",
    premiumTab: "Premium",

    // Theme / Language
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
    language: "Idioma",
    spanish: "Espanol",
    english: "Ingles",

    // Community
    laLigaCommunity: "Comunidad LaLiga",
    post: "Publicar",
    cancel: "Cancelar",
    generalLaLiga: "General LaLiga",
    specificMatch: "Partido especifico",
    category: "Categoria",
    shareWithCommunity: "Que quieres compartir con la comunidad?",
    all: "Todos",
    warning: "Aviso",
    recommendation: "Recomendacion",
    atmosphere: "Ambiente",
    visitors: "Visitantes",

    // Premium page
    premiumHeroTitle: "Soccer Maps Premium",
    premiumHeroSubtitle: "Desbloquea todo el potencial de Soccer Maps con funciones exclusivas",
    faqTitle: "Preguntas frecuentes",

    // Login
    signIn: "Iniciar Sesion",
    signInDesc: "Accede a tu cuenta de Soccer Maps",
    createAccountTitle: "Crear Cuenta",
    createAccountDesc: "Unete a la comunidad de Soccer Maps",
    name: "Nombre",
    email: "Email",
    password: "Contrasena",
    confirmPassword: "Confirmar Contrasena",
    favoriteTeam: "Equipo Favorito",
    optional: "opcional",
    selectTeamPlaceholder: "Selecciona tu equipo",
    forgotPassword: "Olvide mi contrasena",
    noAccount: "No tienes cuenta?",
    registerFreeLink: "Registrate gratis",
    hasAccount: "Ya tienes cuenta?",
    signInLink: "Inicia sesion",
    creatingAccount: "Creando cuenta...",
    signingIn: "Iniciando sesion...",
    accountCreated: "Cuenta creada",
    signedIn: "Sesion iniciada",
    createAccountBtn: "Crear Cuenta",
    signInBtn: "Iniciar Sesion",
    accountCreatedSuccess: "Cuenta creada correctamente. Redirigiendo...",
    signedInSuccess: "Sesion iniciada. Redirigiendo...",
    writeBeforePosting: "Escribe algo antes de publicar",
    published: "Publicado",
    publishedDesc: "Tu publicacion ha sido compartida con la comunidad",
    replySent: "Respuesta enviada",
    replySentDesc: "Tu respuesta ha sido publicada",
    loginRequired: "Inicia sesion",
    loginRequiredDesc: "Necesitas un perfil para dar like",
  },
  en: {
    // Header
    soccerMaps: "Soccer Maps",
    laLiga: "La Liga",
    premium: "Premium",
    comparator: "Comparator",
    myProfile: "My Profile",
    subscription: "Subscription",
    logout: "Sign Out",
    login: "Sign In",
    register: "Sign Up",
    back: "Back",

    // Hero
    exploreStadiums: "Explore La Liga Stadiums",
    heroSubtitle: "Complete information, interactive maps and fan community.",
    searchPlaceholder: "Search by team or city...",

    // Quick actions
    compareStadiums: "Compare Stadiums",
    compareSubtitle: "Compare up to 3 stadiums",
    myProfileTitle: "My Profile",
    profileSubtitle: "Visits, badges and progress",
    premiumTitle: "Premium",
    premiumSubtitle: "Unlock all features",

    // Teams
    selectTeam: "Select your team",
    laLigaTeams: "All 20 LaLiga teams",

    // Auth banner
    registerFree: "Sign up for free to:",
    saveFavorites: "Save favorites",
    checkIn: "Check in",
    postCommunity: "Post in community",
    createAccount: "Create Account",

    // Footer
    aboutUs: "About us",
    aboutSoccerMaps: "About Soccer Maps",
    contact: "Contact",
    collaborations: "Partnerships",
    press: "Press",
    help: "Help",
    faq: "FAQ",
    support: "Support",
    usageGuide: "User guide",
    feedback: "Feedback",
    legal: "Legal",
    terms: "Terms of use",
    privacy: "Privacy",
    cookies: "Cookies",
    legalNotice: "Legal notice",
    footerDesc: "Your ultimate guide to La Liga stadiums and cities.",
    allRightsReserved: "All rights reserved.",

    // Team page
    backToTeams: "Back to teams",
    founded: "Founded",
    capacity: "Capacity",
    fromCenter: "From center",
    region: "Region",
    planMatchDay: "Plan your Match Day",
    planMatchDayDesc: "Step-by-step personalized guide for your visit to",
    clubTab: "Club",
    cityTab: "City",
    stadiumTab: "Stadium",
    reservationsTab: "Bookings",
    visitorTab: "Visitor",
    matchdayTab: "Match Day",
    communityTab: "Community",
    premiumTab: "Premium",

    // Theme / Language
    darkMode: "Dark mode",
    lightMode: "Light mode",
    language: "Language",
    spanish: "Spanish",
    english: "English",

    // Community
    laLigaCommunity: "LaLiga Community",
    post: "Post",
    cancel: "Cancel",
    generalLaLiga: "General LaLiga",
    specificMatch: "Specific match",
    category: "Category",
    shareWithCommunity: "What do you want to share with the community?",
    all: "All",
    warning: "Warning",
    recommendation: "Recommendation",
    atmosphere: "Atmosphere",
    visitors: "Visitors",

    // Premium page
    premiumHeroTitle: "Soccer Maps Premium",
    premiumHeroSubtitle: "Unlock the full potential of Soccer Maps with exclusive features for true La Liga fans",
    faqTitle: "Frequently asked questions",

    // Login
    signIn: "Sign In",
    signInDesc: "Access your Soccer Maps account",
    createAccountTitle: "Create Account",
    createAccountDesc: "Join the Soccer Maps community",
    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    favoriteTeam: "Favorite Team",
    optional: "optional",
    selectTeamPlaceholder: "Select your team",
    forgotPassword: "Forgot password",
    noAccount: "Don't have an account?",
    registerFreeLink: "Sign up for free",
    hasAccount: "Already have an account?",
    signInLink: "Sign in",
    creatingAccount: "Creating account...",
    signingIn: "Signing in...",
    accountCreated: "Account created",
    signedIn: "Signed in",
    createAccountBtn: "Create Account",
    signInBtn: "Sign In",
    accountCreatedSuccess: "Account created successfully. Redirecting...",
    signedInSuccess: "Signed in successfully. Redirecting...",
    writeBeforePosting: "Write something before posting",
    published: "Published",
    publishedDesc: "Your post has been shared with the community",
    replySent: "Reply sent",
    replySentDesc: "Your reply has been posted",
    loginRequired: "Sign in required",
    loginRequiredDesc: "You need a profile to like posts",
  },
} as const

export type TranslationKey = keyof typeof translations.es

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue>({
  language: "es",
  setLanguage: () => {},
  t: (key) => key,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    const stored = localStorage.getItem("soccer-maps-lang") as Language | null
    if (stored && (stored === "es" || stored === "en")) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("soccer-maps-lang", lang)
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? translations.es[key] ?? key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export { translations }
