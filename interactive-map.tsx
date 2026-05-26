"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  useCommunityStore,
  type PostCategory,
  type CommunityPost,
  type MatchSelection,
} from "@/lib/stores/community-store"
import { useUserStore } from "@/lib/stores/user-store"
import { teams } from "@/lib/teams-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Heart,
  MessageCircle,
  Send,
  AlertTriangle,
  Star,
  Users,
  Eye,
  Crown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const CATEGORY_CONFIG: Record<PostCategory, { label: string; icon: React.ElementType; color: string }> = {
  aviso: { label: "Aviso", icon: AlertTriangle, color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  recomendacion: { label: "Recomendación", icon: Star, color: "bg-accent/10 text-accent border-accent/30" },
  ambiente: { label: "Ambiente", icon: Users, color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  visitantes: { label: "Visitantes", icon: Eye, color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

interface PostCardProps {
  post: CommunityPost
  onLike: () => void
  onReply: (content: string) => void
  currentUserId: string
}

function PostCard({ post, onLike, onReply, currentUserId }: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const hasLiked = post.likedBy.includes(currentUserId)
  const CategoryIcon = CATEGORY_CONFIG[post.category].icon

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent)
      setReplyContent("")
      setIsReplying(false)
      setShowReplies(true)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* User badge */}
            <div className="relative w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
              {post.userFavoriteTeamBadge ? (
                <Image src={post.userFavoriteTeamBadge || "/placeholder.svg"} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                  {post.userName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{post.userName}</span>
                {post.isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] px-1.5 py-0 h-4">
                    <Crown className="w-2.5 h-2.5 mr-0.5" />
                    PRO
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  Nivel {post.userLevel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {post.userFavoriteTeamName && <span>Fan de {post.userFavoriteTeamName}</span>}
                <span>·</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", CATEGORY_CONFIG[post.category].color)}>
            <CategoryIcon className="w-3 h-3 mr-1" />
            {CATEGORY_CONFIG[post.category].label}
          </Badge>
        </div>

        {/* Match info */}
        {post.match && (
          <div className="mb-3 p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <Image src={post.match.homeTeamBadge || "/placeholder.svg"} alt="" fill className="object-contain" />
                </div>
                <span className="text-sm font-medium">{post.match.homeTeamName}</span>
              </div>
              <span className="text-xs text-muted-foreground font-bold">vs</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{post.match.awayTeamName}</span>
                <div className="relative w-6 h-6">
                  <Image src={post.match.awayTeamBadge || "/placeholder.svg"} alt="" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post without match - General LaLiga */}
        {post.isGlobalPost && !post.match && (
          <div className="mb-3 p-2 bg-primary/5 rounded-lg">
            <span className="text-xs font-medium text-primary">General LaLiga</span>
          </div>
        )}

        {/* Content */}
        <p className="text-sm leading-relaxed mb-3">{post.content}</p>

        {/* Rating */}
        {post.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("w-3.5 h-3.5", i < post.rating! ? "fill-amber-400 text-amber-400" : "text-muted")}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
          <button
            onClick={onLike}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              hasLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500",
            )}
          >
            <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
            <span>{post.likes}</span>
          </button>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.replies.length}</span>
          </button>
          {post.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary ml-auto"
            >
              {showReplies ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Ocultar
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Ver {post.replies.length} {post.replies.length === 1 ? "respuesta" : "respuestas"}
                </>
              )}
            </button>
          )}
        </div>

        {/* Reply input */}
        {isReplying && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                placeholder="Escribe una respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {showReplies && post.replies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
            {post.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2 pl-2 border-l-2 border-muted">
                <div className="relative w-6 h-6 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  {reply.userFavoriteTeamBadge ? (
                    <Image
                      src={reply.userFavoriteTeamBadge || "/placeholder.svg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold">
                      {reply.userName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{reply.userName}</span>
                    {reply.isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                    <span className="text-[10px] text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function GlobalCommunity() {
  const { posts, createPost, toggleLikePost, addReply, getAllPosts } = useCommunityStore()
  const { profile, initializeUser } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>("recomendacion")
  const [postType, setPostType] = useState<"general" | "match">("general")
  const [homeTeamId, setHomeTeamId] = useState("")
  const [awayTeamId, setAwayTeamId] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | "all">("all")

  useEffect(() => {
    setMounted(true)
    initializeUser()
  }, [initializeUser])

  if (!mounted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Cargando comunidad...</div>
        </CardContent>
      </Card>
    )
  }

  const allPosts = getAllPosts()
  const filteredPosts = categoryFilter === "all" ? allPosts : allPosts.filter((p) => p.category === categoryFilter)

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !profile) return

    let match: MatchSelection | undefined
    if (postType === "match" && homeTeamId && awayTeamId) {
      const homeTeam = teams.find((t) => t.id === homeTeamId)
      const awayTeam = teams.find((t) => t.id === awayTeamId)
      if (homeTeam && awayTeam) {
        match = {
          homeTeamId: homeTeam.id,
          homeTeamName: homeTeam.name,
          homeTeamBadge: homeTeam.badge,
          awayTeamId: awayTeam.id,
          awayTeamName: awayTeam.name,
          awayTeamBadge: awayTeam.badge,
        }
      }
    }

    const favoriteTeam = profile.favoriteTeamId ? teams.find((t) => t.id === profile.favoriteTeamId) : null

    createPost({
      userId: profile.id,
      userName: profile.name,
      userLevel: profile.level,
      userFavoriteTeamId: favoriteTeam?.id,
      userFavoriteTeamName: favoriteTeam?.name,
      userFavoriteTeamBadge: favoriteTeam?.badge,
      isPremium: false, // Will be updated when subscription store is connected
      content: newPostContent,
      category: newPostCategory,
      isGlobalPost: true,
      match,
    })

    setNewPostContent("")
    setPostType("general")
    setHomeTeamId("")
    setAwayTeamId("")
    setIsCreating(false)
  }

  const handleReply = (postId: string, content: string) => {
    if (!profile) return
    const favoriteTeam = profile.favoriteTeamId ? teams.find((t) => t.id === profile.favoriteTeamId) : null
    addReply(postId, {
      userId: profile.id,
      userName: profile.name,
      userFavoriteTeamBadge: favoriteTeam?.badge,
      isPremium: false,
      content,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Comunidad LaLiga
            </CardTitle>
            <Button onClick={() => setIsCreating(!isCreating)} size="sm">
              {isCreating ? "Cancelar" : "Publicar"}
            </Button>
          </div>
        </CardHeader>
        {isCreating && (
          <CardContent className="pt-0">
            <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
              {/* Post type selector */}
              <div className="flex gap-2">
                <Button
                  variant={postType === "general" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostType("general")}
                >
                  General LaLiga
                </Button>
                <Button
                  variant={postType === "match" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostType("match")}
                >
                  Partido específico
                </Button>
              </div>

              {/* Match selector */}
              {postType === "match" && (
                <div className="grid grid-cols-2 gap-2">
                  <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Equipo local" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id} disabled={team.id === awayTeamId}>
                          <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4">
                              <Image src={team.badge || "/placeholder.svg"} alt="" fill className="object-contain" />
                            </div>
                            {team.shortName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Equipo visitante" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id} disabled={team.id === homeTeamId}>
                          <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4">
                              <Image src={team.badge || "/placeholder.svg"} alt="" fill className="object-contain" />
                            </div>
                            {team.shortName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Category selector */}
              <Select value={newPostCategory} onValueChange={(v) => setNewPostCategory(v as PostCategory)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {/* Content */}
              <Textarea
                placeholder="¿Qué quieres compartir con la comunidad?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />

              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || (postType === "match" && (!homeTeamId || !awayTeamId))}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Publicar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("all")}
        >
          Todos
        </Button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const Icon = config.icon
          return (
            <Button
              key={key}
              variant={categoryFilter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(key as PostCategory)}
            >
              <Icon className="w-3.5 h-3.5 mr-1" />
              {config.label}
            </Button>
          )
        })}
      </div>

      {/* Posts feed */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No hay publicaciones aún. ¡Sé el primero en compartir!
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => toggleLikePost(post.id, profile?.id || "anonymous")}
              onReply={(content) => handleReply(post.id, content)}
              currentUserId={profile?.id || "anonymous"}
            />
          ))
        )}
      </div>
    </div>
  )
}
