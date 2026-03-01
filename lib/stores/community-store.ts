import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PostCategory = "aviso" | "recomendacion" | "ambiente" | "visitantes"

export interface MatchSelection {
  homeTeamId: string
  homeTeamName: string
  homeTeamBadge: string
  awayTeamId: string
  awayTeamName: string
  awayTeamBadge: string
}

export interface CommunityPost {
  id: string

  // Author info
  userId: string
  userName: string
  userLevel: number
  userFavoriteTeamId?: string
  userFavoriteTeamName?: string
  userFavoriteTeamBadge?: string
  isPremium?: boolean

  // Content
  content: string
  category: PostCategory
  rating?: number

  // Context - can be team-specific OR global with match
  teamId?: string // Optional - for team-specific posts
  teamName?: string
  match?: MatchSelection // For match-specific posts
  isGlobalPost: boolean // true = General LaLiga, false = team-specific

  // Engagement
  likes: number
  likedBy: string[]
  replies: Reply[]

  // Metadata
  createdAt: string
}

export interface Reply {
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

interface CommunityState {
  posts: CommunityPost[]

  // Actions
  createPost: (post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "likedBy" | "replies">) => CommunityPost
  toggleLikePost: (postId: string, userId: string) => void
  addReply: (postId: string, reply: Omit<Reply, "id" | "createdAt" | "likes" | "likedBy">) => void
  toggleLikeReply: (postId: string, replyId: string, userId: string) => void
  getPostsByTeam: (teamId: string) => CommunityPost[]
  getPostsByCategory: (category: PostCategory) => CommunityPost[]
  getGlobalPosts: () => CommunityPost[]
  getAllPosts: () => CommunityPost[]
  deletePost: (postId: string) => void
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-global-1",
    userId: "user-sample-1",
    userName: "Carlos M.",
    userLevel: 4,
    userFavoriteTeamId: "fc-barcelona",
    userFavoriteTeamName: "FC Barcelona",
    userFavoriteTeamBadge: "/fc-barcelona-football-badge.jpg",
    isPremium: true,
    content:
      "Increíble derbi sevillano, se espera mucho ambiente en el Sánchez-Pizjuán. Recomiendo llegar 2 horas antes para disfrutar del ambiente en los bares de la zona.",
    category: "ambiente",
    rating: 5,
    isGlobalPost: true,
    match: {
      homeTeamId: "sevilla-fc",
      homeTeamName: "Sevilla FC",
      homeTeamBadge: "/sevilla-fc-football-badge.jpg",
      awayTeamId: "real-betis",
      awayTeamName: "Real Betis",
      awayTeamBadge: "/real-betis-football-badge-green-white.jpg",
    },
    likes: 45,
    likedBy: [],
    replies: [
      {
        id: "reply-g1",
        userId: "user-sample-2",
        userName: "Laura P.",
        userFavoriteTeamBadge: "/sevilla-fc-football-badge.jpg",
        content: "El mejor derbi de España sin duda. La zona de Nervión estará increíble!",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 12,
        likedBy: [],
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "post-global-2",
    userId: "user-sample-3",
    userName: "Javier R.",
    userLevel: 5,
    userFavoriteTeamId: "real-madrid",
    userFavoriteTeamName: "Real Madrid",
    userFavoriteTeamBadge: "/real-madrid-football-badge.jpg",
    content:
      "Para los que vayan al Clásico: el acceso por la parada de metro Santiago Bernabéu es el más directo, pero va muy lleno. Recomiendo Nuevos Ministerios y caminar 10 min.",
    category: "aviso",
    isGlobalPost: true,
    match: {
      homeTeamId: "real-madrid",
      homeTeamName: "Real Madrid",
      homeTeamBadge: "/real-madrid-football-badge.jpg",
      awayTeamId: "fc-barcelona",
      awayTeamName: "FC Barcelona",
      awayTeamBadge: "/fc-barcelona-football-badge.jpg",
    },
    likes: 78,
    likedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "post-global-3",
    userId: "user-sample-4",
    userName: "María G.",
    userLevel: 3,
    userFavoriteTeamId: "athletic-club",
    userFavoriteTeamName: "Athletic Club",
    userFavoriteTeamBadge: "/athletic-bilbao-football-badge-red-white.jpg",
    isPremium: true,
    content:
      "General LaLiga: ¿Alguien ha ido a Montilivi este año? Quiero ir a ver al Girona en Champions y no conozco la zona. Agradezco recomendaciones de bares y parking.",
    category: "recomendacion",
    isGlobalPost: true,
    likes: 23,
    likedBy: [],
    replies: [
      {
        id: "reply-g2",
        userId: "user-sample-5",
        userName: "Pere C.",
        userFavoriteTeamBadge: "/girona-fc-football-badge-red-white.jpg",
        isPremium: true,
        content:
          "El estadio es pequeño pero muy acogedor. Te recomiendo el Bar El Corner, está a 5 min andando. El parking del centro comercial cercano es gratuito.",
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        likes: 8,
        likedBy: [],
      },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "post-global-4",
    userId: "user-sample-6",
    userName: "Ana L.",
    userLevel: 2,
    userFavoriteTeamId: "real-sociedad",
    userFavoriteTeamName: "Real Sociedad",
    userFavoriteTeamBadge: "/real-sociedad-football-badge-blue-white.jpg",
    content:
      "Visitantes en San Mamés: Zona segura alrededor del estadio, pero evitad las calles pequeñas del Casco Viejo con colores del equipo visitante. La afición del Athletic es intensa pero respetuosa.",
    category: "visitantes",
    isGlobalPost: true,
    match: {
      homeTeamId: "athletic-club",
      homeTeamName: "Athletic Club",
      homeTeamBadge: "/athletic-bilbao-football-badge-red-white.jpg",
      awayTeamId: "real-sociedad",
      awayTeamName: "Real Sociedad",
      awayTeamBadge: "/real-sociedad-football-badge-blue-white.jpg",
    },
    likes: 34,
    likedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "post-team-1",
    userId: "user-sample-7",
    userName: "Diego M.",
    userLevel: 4,
    userFavoriteTeamId: "atletico-madrid",
    userFavoriteTeamName: "Atlético de Madrid",
    userFavoriteTeamBadge: "/atletico-madrid-football-badge.jpg",
    content:
      "El Metropolitano es espectacular, pero el metro va hasta arriba después del partido. Recomiendo esperar 20-30 min en algún bar de la zona antes de coger transporte.",
    category: "recomendacion",
    rating: 4,
    teamId: "atletico-madrid",
    teamName: "Atlético de Madrid",
    isGlobalPost: false,
    likes: 19,
    likedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: INITIAL_POSTS,

      createPost: (postData) => {
        const post: CommunityPost = {
          ...postData,
          id: `post-${Date.now()}`,
          likes: 0,
          likedBy: [],
          replies: [],
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          posts: [post, ...state.posts],
        }))

        return post
      },

      toggleLikePost: (postId, userId) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post
            const hasLiked = post.likedBy.includes(userId)
            return {
              ...post,
              likes: hasLiked ? post.likes - 1 : post.likes + 1,
              likedBy: hasLiked ? post.likedBy.filter((id) => id !== userId) : [...post.likedBy, userId],
            }
          }),
        }))
      },

      addReply: (postId, replyData) => {
        const reply: Reply = {
          ...replyData,
          id: `reply-${Date.now()}`,
          likes: 0,
          likedBy: [],
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, replies: [...post.replies, reply] } : post,
          ),
        }))
      },

      toggleLikeReply: (postId, replyId, userId) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post
            return {
              ...post,
              replies: post.replies.map((reply) => {
                if (reply.id !== replyId) return reply
                const hasLiked = reply.likedBy.includes(userId)
                return {
                  ...reply,
                  likes: hasLiked ? reply.likes - 1 : reply.likes + 1,
                  likedBy: hasLiked ? reply.likedBy.filter((id) => id !== userId) : [...reply.likedBy, userId],
                }
              }),
            }
          }),
        }))
      },

      getPostsByTeam: (teamId) => {
        return get().posts.filter((p) => p.teamId === teamId && !p.isGlobalPost)
      },

      getPostsByCategory: (category) => {
        return get().posts.filter((p) => p.category === category)
      },

      getGlobalPosts: () => {
        return get().posts.filter((p) => p.isGlobalPost)
      },

      getAllPosts: () => {
        return [...get().posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        }))
      },
    }),
    {
      name: "soccer-maps-community",
    },
  ),
)
