export interface Team {
  id: string
  name: string
  shortName: string
  city: string
  region: string
  founded: number
  colors: string[]
  stadium: {
    name: string
    capacity: number
    location: {
      lat: number
      lng: number
    }
    distanceToCenter: string
  }
  badge: string
  history: string
  cityInfo: {
    description: string
    climate: string
    recommendedAreas: string[]
  }
}

export const teams: Team[] = [
  {
    id: "fc-barcelona",
    name: "FC Barcelona",
    shortName: "Barça",
    city: "Barcelona",
    region: "Cataluña",
    founded: 1899,
    colors: ["Azulgrana", "Oro"],
    stadium: {
      name: "Estadi Olímpic Lluís Companys",
      capacity: 55926,
      location: { lat: 41.3649, lng: 2.1557 },
      distanceToCenter: "3 km",
    },
    badge: "/fc-barcelona-football-badge.jpg",
    history:
      "Uno de los clubes más exitosos del mundo, fundado por un grupo de futbolistas suizos, catalanes, ingleses y españoles. Más que un club.",
    cityInfo: {
      description:
        "Ciudad cosmopolita mediterránea, capital de Cataluña, conocida por su arquitectura modernista y vida cultural vibrante.",
      climate: "Mediterráneo templado (15-25°C promedio)",
      recommendedAreas: ["Las Ramblas", "Barrio Gótico", "Eixample", "Gràcia"],
    },
  },
  {
    id: "real-madrid",
    name: "Real Madrid CF",
    shortName: "Real Madrid",
    city: "Madrid",
    region: "Comunidad de Madrid",
    founded: 1902,
    colors: ["Blanco"],
    stadium: {
      name: "Santiago Bernabéu",
      capacity: 81044,
      location: { lat: 40.453, lng: -3.6883 },
      distanceToCenter: "4 km",
    },
    badge: "/real-madrid-football-badge.jpg",
    history: "El club más laureado en la historia del fútbol europeo con 15 Copas de Europa, fundado en 1902.",
    cityInfo: {
      description:
        "Capital de España, ciudad cosmopolita con rico patrimonio cultural, gastronomía excepcional y vida nocturna vibrante.",
      climate: "Continental (5-30°C variación estacional)",
      recommendedAreas: ["Gran Vía", "Malasaña", "Chueca", "Salamanca"],
    },
  },
  {
    id: "atletico-madrid",
    name: "Atlético de Madrid",
    shortName: "Atlético",
    city: "Madrid",
    region: "Comunidad de Madrid",
    founded: 1903,
    colors: ["Rojiblanco"],
    stadium: {
      name: "Civitas Metropolitano",
      capacity: 70460,
      location: { lat: 40.4362, lng: -3.5995 },
      distanceToCenter: "8 km",
    },
    badge: "/atletico-madrid-football-badge.jpg",
    history: 'Tercer club más exitoso de España, conocido por su espíritu luchador y su lema "Aúpa Atleti".',
    cityInfo: {
      description:
        "Capital de España, ciudad cosmopolita con rico patrimonio cultural, gastronomía excepcional y vida nocturna vibrante.",
      climate: "Continental (5-30°C variación estacional)",
      recommendedAreas: ["Gran Vía", "Malasaña", "Chueca", "La Latina"],
    },
  },
  {
    id: "sevilla-fc",
    name: "Sevilla FC",
    shortName: "Sevilla",
    city: "Sevilla",
    region: "Andalucía",
    founded: 1890,
    colors: ["Blanco", "Rojo"],
    stadium: {
      name: "Ramón Sánchez-Pizjuán",
      capacity: 43883,
      location: { lat: 37.3838, lng: -5.9706 },
      distanceToCenter: "2.5 km",
    },
    badge: "/sevilla-fc-football-badge.jpg",
    history: "Club más laureado en la historia de la UEFA Europa League con 7 títulos, fundado en 1890.",
    cityInfo: {
      description:
        "Capital andaluza, cuna del flamenco y famosa por su arquitectura árabe, el tapeo y la Feria de Abril.",
      climate: "Mediterráneo cálido (12-35°C)",
      recommendedAreas: ["Triana", "Santa Cruz", "Alameda", "Centro"],
    },
  },
  {
    id: "real-betis",
    name: "Real Betis Balompié",
    shortName: "Betis",
    city: "Sevilla",
    region: "Andalucía",
    founded: 1907,
    colors: ["Verdiblanco"],
    stadium: {
      name: "Benito Villamarín",
      capacity: 60720,
      location: { lat: 37.3564, lng: -5.9817 },
      distanceToCenter: "3 km",
    },
    badge: "/real-betis-football-badge-green-white.jpg",
    history: 'El equipo del pueblo sevillano, con una afición apasionada y el lema "Viva er Beti manque pierda".',
    cityInfo: {
      description:
        "Capital andaluza, cuna del flamenco y famosa por su arquitectura árabe, el tapeo y la Feria de Abril.",
      climate: "Mediterráneo cálido (12-35°C)",
      recommendedAreas: ["Triana", "Santa Cruz", "Los Remedios", "Centro"],
    },
  },
  {
    id: "valencia-cf",
    name: "Valencia CF",
    shortName: "Valencia",
    city: "Valencia",
    region: "Comunidad Valenciana",
    founded: 1919,
    colors: ["Blanco", "Negro"],
    stadium: {
      name: "Mestalla",
      capacity: 49430,
      location: { lat: 39.4747, lng: -0.3583 },
      distanceToCenter: "2 km",
    },
    badge: "/valencia-cf-football-badge-bat.jpg",
    history: "Uno de los clubes históricos de España, ganador de 6 Ligas y con gran tradición europea.",
    cityInfo: {
      description: "Ciudad mediterránea, cuna de la paella, con arquitectura futurista y playas cercanas.",
      climate: "Mediterráneo suave (12-30°C)",
      recommendedAreas: ["Ciutat Vella", "Ruzafa", "Malvarrosa", "Cabanyal"],
    },
  },
  {
    id: "athletic-club",
    name: "Athletic Club",
    shortName: "Athletic",
    city: "Bilbao",
    region: "País Vasco",
    founded: 1898,
    colors: ["Rojiblanco"],
    stadium: {
      name: "San Mamés",
      capacity: 53289,
      location: { lat: 43.2641, lng: -2.9495 },
      distanceToCenter: "1.5 km",
    },
    badge: "/athletic-bilbao-football-badge-red-white.jpg",
    history: "Único club junto al Real Madrid y Barcelona que nunca ha descendido, con filosofía de cantera vasca.",
    cityInfo: {
      description: "Capital vizcaína, ciudad industrial transformada en referente cultural con el Museo Guggenheim.",
      climate: "Oceánico (10-25°C, lluvioso)",
      recommendedAreas: ["Casco Viejo", "Abando", "Ensanche", "Ribera"],
    },
  },
  {
    id: "real-sociedad",
    name: "Real Sociedad",
    shortName: "Real Sociedad",
    city: "San Sebastián",
    region: "País Vasco",
    founded: 1909,
    colors: ["Txuri-urdin"],
    stadium: {
      name: "Reale Arena",
      capacity: 39500,
      location: { lat: 43.3014, lng: -1.9732 },
      distanceToCenter: "4 km",
    },
    badge: "/real-sociedad-football-badge-blue-white.jpg",
    history: "Bicampeón de Liga consecutivo en los años 80, conocido por su afición fiel y su estilo de juego.",
    cityInfo: {
      description: "Joya del norte, famosa por su bahía de La Concha, gastronomía de clase mundial y cultura vasca.",
      climate: "Oceánico suave (11-22°C)",
      recommendedAreas: ["Parte Vieja", "Gros", "Centro", "Ondarreta"],
    },
  },
  {
    id: "villarreal-cf",
    name: "Villarreal CF",
    shortName: "Villarreal",
    city: "Villarreal",
    region: "Comunidad Valenciana",
    founded: 1923,
    colors: ["Amarillo"],
    stadium: {
      name: "Estadio de la Cerámica",
      capacity: 23500,
      location: { lat: 39.9442, lng: -0.1033 },
      distanceToCenter: "1 km",
    },
    badge: "/villarreal-cf-football-badge-yellow.jpg",
    history: "El Submarino Amarillo, campeón de la Europa League 2021 y con gran presencia europea en el siglo XXI.",
    cityInfo: {
      description: "Pequeña ciudad castellonense famosa por su industria cerámica y su club de fútbol de élite.",
      climate: "Mediterráneo (12-28°C)",
      recommendedAreas: ["Centro Histórico", "Zona Estadio", "Paseo Marítimo"],
    },
  },
  {
    id: "girona-fc",
    name: "Girona FC",
    shortName: "Girona",
    city: "Girona",
    region: "Cataluña",
    founded: 1930,
    colors: ["Albirrojo"],
    stadium: {
      name: "Estadi Montilivi",
      capacity: 14624,
      location: { lat: 41.9606, lng: 2.8269 },
      distanceToCenter: "2.5 km",
    },
    badge: "/girona-fc-football-badge-red-white.jpg",
    history: "Club catalán en ascenso, subcampeón de LaLiga 2023-24 y clasificado para la Champions League.",
    cityInfo: {
      description: "Ciudad medieval catalana junto al río Onyar, con casas de colores y rica historia romana.",
      climate: "Mediterráneo continental (8-28°C)",
      recommendedAreas: ["Barri Vell", "El Call", "Mercadal", "Devesa"],
    },
  },
  {
    id: "rayo-vallecano",
    name: "Rayo Vallecano",
    shortName: "Rayo",
    city: "Madrid",
    region: "Comunidad de Madrid",
    founded: 1924,
    colors: ["Blanco", "Rojo"],
    stadium: {
      name: "Estadio de Vallecas",
      capacity: 14708,
      location: { lat: 40.3918, lng: -3.6589 },
      distanceToCenter: "5 km",
    },
    badge: "/rayo-vallecano-football-badge-red-stripe.jpg",
    history: "El club del barrio de Vallecas, conocido por su afición fiel y su fuerte identidad obrera.",
    cityInfo: {
      description: "Barrio popular de Madrid con fuerte identidad y ambiente auténtico madrileño.",
      climate: "Continental (5-30°C variación estacional)",
      recommendedAreas: ["Vallecas", "Puente de Vallecas", "Centro"],
    },
  },
  {
    id: "osasuna",
    name: "CA Osasuna",
    shortName: "Osasuna",
    city: "Pamplona",
    region: "Navarra",
    founded: 1920,
    colors: ["Rojillo"],
    stadium: {
      name: "El Sadar",
      capacity: 23576,
      location: { lat: 42.7967, lng: -1.6373 },
      distanceToCenter: "2 km",
    },
    badge: "/ca-osasuna-football-badge-red.jpg",
    history: "Club navarro con fuerte arraigo local, conocido por su ambiente en El Sadar y su afición fiel.",
    cityInfo: {
      description: "Ciudad navarra famosa por los Sanfermines, con rico patrimonio histórico y gastronómico.",
      climate: "Continental húmedo (5-25°C)",
      recommendedAreas: ["Casco Antiguo", "Ensanche", "Plaza del Castillo"],
    },
  },
  {
    id: "getafe-cf",
    name: "Getafe CF",
    shortName: "Getafe",
    city: "Getafe",
    region: "Comunidad de Madrid",
    founded: 1983,
    colors: ["Azulón"],
    stadium: {
      name: "Coliseum",
      capacity: 17393,
      location: { lat: 40.3256, lng: -3.7147 },
      distanceToCenter: "13 km de Madrid",
    },
    badge: "/getafe-cf-football-badge-blue.jpg",
    history: "Club del sur de Madrid consolidado en Primera División, conocido por su estilo competitivo.",
    cityInfo: {
      description: "Ciudad al sur de Madrid, bien conectada con la capital por transporte público.",
      climate: "Continental (5-30°C variación estacional)",
      recommendedAreas: ["Centro", "Los Molinos", "Sector III"],
    },
  },
  {
    id: "celta-vigo",
    name: "RC Celta de Vigo",
    shortName: "Celta",
    city: "Vigo",
    region: "Galicia",
    founded: 1923,
    colors: ["Celeste"],
    stadium: {
      name: "Abanca Balaídos",
      capacity: 29000,
      location: { lat: 42.2117, lng: -8.7392 },
      distanceToCenter: "2 km",
    },
    badge: "/celta-vigo-football-badge-light-blue.jpg",
    history: "Club gallego con gran tradición, conocido por su cantera y su afición en las gradas de Balaídos.",
    cityInfo: {
      description: "Ciudad portuaria gallega con excelente gastronomía marinera y ambiente atlántico.",
      climate: "Oceánico (10-22°C, húmedo)",
      recommendedAreas: ["Casco Vello", "Berbés", "Samil", "Centro"],
    },
  },
  {
    id: "deportivo-alaves",
    name: "Deportivo Alavés",
    shortName: "Alavés",
    city: "Vitoria-Gasteiz",
    region: "País Vasco",
    founded: 1921,
    colors: ["Azul", "Blanco"],
    stadium: {
      name: "Mendizorrotza",
      capacity: 19840,
      location: { lat: 42.8372, lng: -2.6878 },
      distanceToCenter: "2 km",
    },
    badge: "/deportivo-alaves-football-badge-blue-white.jpg",
    history: "Club vasco con historia de altibajos, finalista de la Copa de la UEFA en 2001.",
    cityInfo: {
      description: "Capital vasca, ciudad verde con excelente calidad de vida y rica oferta cultural.",
      climate: "Oceánico (5-22°C)",
      recommendedAreas: ["Casco Medieval", "Ensanche", "Lovaina"],
    },
  },
  {
    id: "mallorca",
    name: "RCD Mallorca",
    shortName: "Mallorca",
    city: "Palma",
    region: "Islas Baleares",
    founded: 1916,
    colors: ["Rojo", "Negro"],
    stadium: {
      name: "Estadi Mallorca Son Moix",
      capacity: 23142,
      location: { lat: 39.5903, lng: 2.6308 },
      distanceToCenter: "5 km",
    },
    badge: "/placeholder.svg?height=100&width=100",
    history: "Club balear con éxitos en los 90 y 2000, ganador de la Copa del Rey en 2003.",
    cityInfo: {
      description: "Capital de Mallorca, ciudad mediterránea con playas paradisíacas y casco histórico encantador.",
      climate: "Mediterráneo (12-30°C)",
      recommendedAreas: ["Casco Antiguo", "Paseo Marítimo", "Santa Catalina"],
    },
  },
  {
    id: "las-palmas",
    name: "UD Las Palmas",
    shortName: "Las Palmas",
    city: "Las Palmas de Gran Canaria",
    region: "Islas Canarias",
    founded: 1949,
    colors: ["Amarillo"],
    stadium: {
      name: "Estadio de Gran Canaria",
      capacity: 32400,
      location: { lat: 28.1003, lng: -15.4567 },
      distanceToCenter: "8 km",
    },
    badge: "/placeholder.svg?height=100&width=100",
    history: "Club canario histórico, de regreso a Primera División con una afición apasionada.",
    cityInfo: {
      description: "Ciudad atlántica con clima primaveral todo el año, playas urbanas y ambiente cosmopolita.",
      climate: "Subtropical (18-26°C todo el año)",
      recommendedAreas: ["Vegueta", "Triana", "Las Canteras", "Mesa y López"],
    },
  },
  {
    id: "espanyol",
    name: "RCD Espanyol",
    shortName: "Espanyol",
    city: "Barcelona",
    region: "Cataluña",
    founded: 1900,
    colors: ["Blanco", "Azul"],
    stadium: {
      name: "RCDE Stadium",
      capacity: 40500,
      location: { lat: 41.3479, lng: 2.0756 },
      distanceToCenter: "10 km",
    },
    badge: "/placeholder.svg?height=100&width=100",
    history: "El otro club de Barcelona, con fuerte identidad propia y cuatro Copas del Rey.",
    cityInfo: {
      description:
        "Ciudad cosmopolita mediterránea, capital de Cataluña, conocida por su arquitectura modernista y vida cultural vibrante.",
      climate: "Mediterráneo templado (15-25°C promedio)",
      recommendedAreas: ["Cornellà", "L'Hospitalet", "Barcelona Centro"],
    },
  },
  {
    id: "leganes",
    name: "CD Leganés",
    shortName: "Leganés",
    city: "Leganés",
    region: "Comunidad de Madrid",
    founded: 1928,
    colors: ["Blanco", "Azul"],
    stadium: {
      name: "Estadio Municipal de Butarque",
      capacity: 12454,
      location: { lat: 40.3261, lng: -3.7608 },
      distanceToCenter: "12 km de Madrid",
    },
    badge: "/placeholder.svg?height=100&width=100",
    history: "Club del sur de Madrid que alcanzó la Primera División en 2016 por primera vez en su historia.",
    cityInfo: {
      description: "Ciudad al sur de Madrid, bien conectada con la capital y con ambiente familiar.",
      climate: "Continental (5-30°C variación estacional)",
      recommendedAreas: ["Centro", "Zarzaquemada", "Solagua"],
    },
  },
  {
    id: "valladolid",
    name: "Real Valladolid CF",
    shortName: "Valladolid",
    city: "Valladolid",
    region: "Castilla y León",
    founded: 1928,
    colors: ["Albivioleta"],
    stadium: {
      name: "Estadio José Zorrilla",
      capacity: 27618,
      location: { lat: 41.6444, lng: -4.7614 },
      distanceToCenter: "3 km",
    },
    badge: "/placeholder.svg?height=100&width=100",
    history: "Club castellano con tradición en Primera División, conocido por su afición fiel.",
    cityInfo: {
      description: "Capital de Castilla y León, ciudad universitaria con rico patrimonio histórico y cultural.",
      climate: "Continental (2-28°C, veranos calurosos)",
      recommendedAreas: ["Centro Histórico", "Plaza Mayor", "Zona Universidad"],
    },
  },
]

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id)
}

export function searchTeams(query: string): Team[] {
  const lowerQuery = query.toLowerCase()
  return teams.filter(
    (team) =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.city.toLowerCase().includes(lowerQuery) ||
      team.shortName.toLowerCase().includes(lowerQuery),
  )
}

export function getAllTeamNames(): { id: string; name: string; shortName: string; badge: string }[] {
  return teams.map((t) => ({ id: t.id, name: t.name, shortName: t.shortName, badge: t.badge }))
}
