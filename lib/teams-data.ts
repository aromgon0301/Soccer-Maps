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
  stadiumImage?: string
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
    stadiumImage: "/stadium-olimpic-barcelona.jpg",
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
    stadiumImage: "/stadium-bernabeu.jpg",
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
    stadiumImage: "/stadium-metropolitano.jpg",
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
    stadiumImage: "/stadium-sanchez-pizjuan.jpg",
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
    badge: "/real-betis-football-badge.jpg",
    stadiumImage: "/stadium-villamarin.jpg",
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
    badge: "/valencia-cf-football-badge.jpg",
    stadiumImage: "/stadium-mestalla.jpg",
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
    badge: "/athletic-bilbao-football-badge.jpg",
    stadiumImage: "/stadium-san-mames.jpg",
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
    badge: "/real-sociedad-football-badge.jpg",
    stadiumImage: "/stadium-reale-arena.jpg",
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
    badge: "/villarreal-cf-football-badge.jpg",
    stadiumImage: "/stadium-ceramica.jpg",
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
    badge: "/girona-fc-football-badge.jpg",
    stadiumImage: "/stadium-montilivi.jpg",
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
    badge: "/rayo-vallecano-football-badge.jpg",
    stadiumImage: "/stadium-vallecas.jpg",
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
    badge: "/ca-osasuna-football-badge.jpg",
    stadiumImage: "/stadium-sadar.jpg",
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
    badge: "/getafe-cf-football-badge.jpg",
    stadiumImage: "/stadium-coliseum.jpg",
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
    badge: "/celta-vigo-football-badge.jpg",
    stadiumImage: "/stadium-balaidos.jpg",
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
    badge: "/deportivo-alaves-football-badge.jpg",
    stadiumImage: "/stadium-mendizorrotza.jpg",
    history: "Club vasco con historia de altibajos, finalista de la Copa de la UEFA en 2001.",
    cityInfo: {
      description: "Capital vasca, ciudad verde con excelente calidad de vida y rica oferta cultural.",
      climate: "Oceánico (5-22°C)",
      recommendedAreas: ["Casco Medieval", "Ensanche", "Lovaina"],
    },
  },
  {
    id: "levante-ud",
    name: "Levante UD",
    shortName: "Levante",
    city: "Valencia",
    region: "Comunidad Valenciana",
    founded: 1909,
    colors: ["Azulgrana"],
    stadium: {
      name: "Estadi Ciutat de València",
      capacity: 26354,
      location: { lat: 39.4945, lng: -0.3509 },
      distanceToCenter: "2.5 km",
    },
    badge: "/levante-ud-badge.jpg",
    stadiumImage: "/stadium-levante.jpg",
    history: "Club histórico valenciano fundado en 1909, conocido como los Granotes. Ha competido en Primera División en múltiples temporadas y es reconocido por su cantera.",
    cityInfo: {
      description: "Valencia, tercera ciudad de España, famosa por la paella, la Ciudad de las Artes y las Ciencias, y sus playas mediterráneas.",
      climate: "Mediterráneo suave (12-30°C)",
      recommendedAreas: ["Orriols", "Benimaclet", "Ciutat Vella", "Ruzafa"],
    },
  },
  {
    id: "malaga-cf",
    name: "Málaga CF",
    shortName: "Málaga",
    city: "Málaga",
    region: "Andalucía",
    founded: 1904,
    colors: ["Azul", "Blanco"],
    stadium: {
      name: "La Rosaleda",
      capacity: 30044,
      location: { lat: 36.7352, lng: -4.4313 },
      distanceToCenter: "1.5 km",
    },
    badge: "/malaga-cf-badge.jpg",
    stadiumImage: "/stadium-malaga.jpg",
    history: "Club histórico andaluz que alcanz�� los cuartos de final de la Champions League en 2013. Conocido como los Boquerones por la tradición pesquera de la ciudad.",
    cityInfo: {
      description: "Capital de la Costa del Sol, ciudad cosmopolita con rico patrimonio cultural, el Museo Picasso y excelente gastronomía mediterránea.",
      climate: "Mediterráneo subtropical (13-30°C)",
      recommendedAreas: ["Centro Histórico", "Malagueta", "Soho", "El Palo"],
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
    badge: "/espanyol-badge.jpg",
    stadiumImage: "/stadium-rcde.jpg",
    history: "El otro club de Barcelona, con fuerte identidad propia y cuatro Copas del Rey.",
    cityInfo: {
      description:
        "Ciudad cosmopolita mediterránea, capital de Cataluña, conocida por su arquitectura modernista y vida cultural vibrante.",
      climate: "Mediterráneo templado (15-25°C promedio)",
      recommendedAreas: ["Cornellà", "L'Hospitalet", "Barcelona Centro"],
    },
  },
  {
    id: "deportivo-coruna",
    name: "Deportivo de La Coruña",
    shortName: "Dépor",
    city: "A Coruña",
    region: "Galicia",
    founded: 1906,
    colors: ["Azul", "Blanco"],
    stadium: {
      name: "Estadio Abanca-Riazor",
      capacity: 32660,
      location: { lat: 43.3672, lng: -8.4117 },
      distanceToCenter: "2 km",
    },
    badge: "/deportivo-coruna-badge.jpg",
    stadiumImage: "/stadium-riazor.jpg",
    history: "El Súper Dépor de finales de los 90 y principios de 2000, campeón de Liga en 2000 y semifinalista de Champions. Uno de los clubes históricos del fútbol español.",
    cityInfo: {
      description: "Ciudad atlántica gallega con la Torre de Hércules, playas urbanas y excelente marisco. Conocida por su ambiente marinero y cultural.",
      climate: "Oceánico (10-22°C, húmedo)",
      recommendedAreas: ["Ciudad Vieja", "Riazor", "Marina", "Monte Alto"],
    },
  },
  {
    id: "racing-santander",
    name: "Racing de Santander",
    shortName: "Racing",
    city: "Santander",
    region: "Cantabria",
    founded: 1913,
    colors: ["Verdiblanco"],
    stadium: {
      name: "Estadio El Sardinero",
      capacity: 22222,
      location: { lat: 43.4747, lng: -3.7872 },
      distanceToCenter: "2 km",
    },
    badge: "/racing-santander-badge.jpg",
    stadiumImage: "/stadium-sardinero.jpg",
    history: "Club histórico cántabro fundado en 1913, con tradición en Primera División. El Sardinero es uno de los estadios más emblemáticos del fútbol español por su ubicación junto al mar.",
    cityInfo: {
      description: "Capital cántabra, ciudad elegante junto al Cantábrico con playas urbanas, el Palacio de la Magdalena y excelente gastronomía.",
      climate: "Oceánico (10-22°C, húmedo)",
      recommendedAreas: ["El Sardinero", "Centro", "Puerto Chico", "Puertochico"],
    },
  },
]

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id)
}

export function searchTeams(query: string): Team[] {
  if (!query.trim()) return []
  
  const lowerQuery = query.toLowerCase().trim()
  const queryWords = lowerQuery.split(/\s+/)
  
  // Score-based search for better results
  const scoredTeams = teams.map(team => {
    let score = 0
    const teamNameLower = team.name.toLowerCase()
    const shortNameLower = team.shortName.toLowerCase()
    const cityLower = team.city.toLowerCase()
    const stadiumLower = team.stadium.name.toLowerCase()
    const regionLower = team.region.toLowerCase()
    
    // Exact match gets highest score
    if (teamNameLower === lowerQuery || shortNameLower === lowerQuery) {
      score += 100
    }
    
    // Starts with query gets high score
    if (teamNameLower.startsWith(lowerQuery) || shortNameLower.startsWith(lowerQuery)) {
      score += 50
    }
    
    // Contains full query
    if (teamNameLower.includes(lowerQuery)) score += 30
    if (shortNameLower.includes(lowerQuery)) score += 25
    if (cityLower.includes(lowerQuery)) score += 20
    if (stadiumLower.includes(lowerQuery)) score += 15
    if (regionLower.includes(lowerQuery)) score += 10
    
    // Match individual words
    queryWords.forEach(word => {
      if (word.length >= 2) {
        if (teamNameLower.includes(word)) score += 5
        if (shortNameLower.includes(word)) score += 4
        if (cityLower.includes(word)) score += 3
        if (stadiumLower.includes(word)) score += 2
        if (regionLower.includes(word)) score += 1
      }
    })
    
    return { team, score }
  })
  
  // Filter teams with score > 0 and sort by score descending
  return scoredTeams
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.team)
}

export function getAllTeamNames(): { id: string; name: string; shortName: string; badge: string }[] {
  return teams.map((t) => ({ id: t.id, name: t.name, shortName: t.shortName, badge: t.badge }))
}
