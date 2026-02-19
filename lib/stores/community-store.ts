import { create } from "zustand"

export type PostCategory = "aviso" | "recomendacion" | "ambiente" | "visitantes" | "pregunta"

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
  replies: Reply[]
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
  isLoading: boolean
  initializePosts: () => Promise<void>
  createPost: (post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "likedBy" | "replies">) => Promise<CommunityPost>
  toggleLikePost: (postId: string, userId: string) => Promise<void>
  addReply: (postId: string, reply: Omit<Reply, "id" | "createdAt" | "likes" | "likedBy">) => Promise<void>
  toggleLikeReply: (postId: string, replyId: string, userId: string) => Promise<void>
  getPostsByTeam: (teamId: string) => CommunityPost[]
  getPostsByCategory: (category: PostCategory) => CommunityPost[]
  getGlobalPosts: () => CommunityPost[]
  getAllPosts: () => CommunityPost[]
  deletePost: (postId: string) => Promise<void>
}

export const useCommunityStore = create<CommunityState>()((set, get) => ({
  posts: [],
  isLoading: false,

  initializePosts: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/community")
      const data = await response.json()
      set({ posts: data.posts ?? [] })
    } finally {
      set({ isLoading: false })
    }
  },

  createPost: async (postData) => {
    const response = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      throw new Error("No se pudo crear la publicación")
    }

    const data = await response.json()
    const post = data.post as CommunityPost

    set((state) => ({ posts: [post, ...state.posts] }))
    return post
  },

  toggleLikePost: async (postId, userId) => {
    const response = await fetch(`/api/community/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      throw new Error("No se pudo actualizar el like")
    }

    const data = await response.json()
    const updatedPost = data.post as CommunityPost

    if (!updatedPost?.id) return

    set((state) => ({
      posts: state.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    }))
  },

  addReply: async (postId, replyData) => {
    const response = await fetch(`/api/community/${postId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(replyData),
    })

    if (!response.ok) {
      throw new Error("No se pudo publicar la respuesta")
    }

    const data = await response.json()
    const updatedPost = data.post as CommunityPost

    if (!updatedPost?.id) return

    set((state) => ({
      posts: state.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    }))
  },

  toggleLikeReply: async (postId, replyId, userId) => {
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
              likes: hasLiked ? Math.max(0, reply.likes - 1) : reply.likes + 1,
              likedBy: hasLiked ? reply.likedBy.filter((id) => id !== userId) : [...reply.likedBy, userId],
            }
          }),
        }
      }),
    }))
  },

  getPostsByTeam: (teamId) => get().posts.filter((p) => p.teamId === teamId && !p.isGlobalPost),
  getPostsByCategory: (category) => get().posts.filter((p) => p.category === category),
  getGlobalPosts: () => get().posts.filter((p) => p.isGlobalPost),
  getAllPosts: () => [...get().posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  deletePost: async (postId) => {
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) }))
  },
}))
