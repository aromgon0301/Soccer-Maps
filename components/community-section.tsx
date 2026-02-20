"use client"

import { useState, useEffect } from "react"
import { MessageSquare, ThumbsUp, Star, User, Send, AlertTriangle, Lightbulb, Music, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUserStore, useCommunityStore } from "@/lib/stores"
import type { PostCategory, CommunityPost } from "@/lib/stores"
import type { Team } from "@/lib/teams-data"

interface CommunitySectionProps {
  team: Team
}

const categoryConfig: Record<PostCategory, { label: string; icon: typeof AlertTriangle; color: string }> = {
  aviso: { label: "Aviso", icon: AlertTriangle, color: "text-yellow-500" },
  recomendacion: { label: "Recomendación", icon: Lightbulb, color: "text-accent" },
  ambiente: { label: "Ambiente", icon: Music, color: "text-purple-500" },
  visitantes: { label: "Visitantes", icon: HelpCircle, color: "text-blue-500" },
}

export function CommunitySection({ team }: CommunitySectionProps) {
  const { toast } = useToast()
  const { profile, isInitialized, initializeUser, incrementReviews, addExperience } = useUserStore()
  const { posts, createPost, toggleLikePost, addReply, getPostsByTeam } = useCommunityStore()

  const [activeTab, setActiveTab] = useState<"all" | PostCategory>("all")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>("recomendacion")
  const [newPostRating, setNewPostRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  // Initialize user if needed
  useEffect(() => {
    if (!isInitialized) {
      initializeUser()
    }
  }, [isInitialized, initializeUser])

  // Get posts for this team
  const teamPosts = getPostsByTeam(team.id)
  const filteredPosts = activeTab === "all" ? teamPosts : teamPosts.filter((p) => p.category === activeTab)

  // Calculate stats
  const totalPosts = teamPosts.length
  const avgRating =
    teamPosts.filter((p) => p.rating).reduce((acc, p) => acc + (p.rating || 0), 0) /
      teamPosts.filter((p) => p.rating).length || 0
  const recommendPercent =
    teamPosts.filter((p) => p.rating).length > 0
      ? Math.round(
          (teamPosts.filter((p) => (p.rating || 0) >= 4).length / teamPosts.filter((p) => p.rating).length) * 100,
        )
      : 0
  const uniqueUsers = new Set(teamPosts.map((p) => p.userId)).size

  const handleCreatePost = async () => {
    if (!profile || !newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Escribe algo antes de publicar",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create post in store
    createPost({
      userId: profile.id,
      userName: profile.name,
      userLevel: profile.level,
      content: newPostContent.trim(),
      category: newPostCategory,
      rating: newPostCategory === "recomendacion" || newPostCategory === "ambiente" ? newPostRating : undefined,
      teamId: team.id,
      teamName: team.name,
      isGlobalPost: false,
    })

    // Update user stats
    incrementReviews()
    addExperience(25)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    setNewPostContent("")
    setIsSubmitting(false)

    toast({
      title: "Publicado",
      description: "Tu publicación ha sido compartida con la comunidad",
    })
  }

  const handleLikePost = (postId: string) => {
    if (!profile) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas un perfil para dar like",
        variant: "destructive",
      })
      return
    }
    toggleLikePost(postId, profile.id)
  }

  const handleAddReply = async (postId: string) => {
    if (!profile || !replyContent.trim()) return

    addReply(postId, {
      userId: profile.id,
      userName: profile.name,
      content: replyContent.trim(),
    })

    setReplyContent("")
    setReplyingTo(null)

    toast({
      title: "Respuesta enviada",
      description: "Tu respuesta ha sido publicada",
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Ahora mismo"
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString("es-ES")
  }

  // Get top tips (most liked posts)
  const topTips = [...teamPosts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
    .filter((p) => p.likes > 0)

  return (
    <div className="space-y-6">
      {/* Add Post Card */}
      <Card className="border-accent/50">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            Comparte tu experiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Comparte tus recomendaciones sobre bares, accesos, parkings o tu experiencia general..."
              className="min-h-[100px]"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {/* Category Select */}
                <Select value={newPostCategory} onValueChange={(v) => setNewPostCategory(v as PostCategory)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const Icon = config.icon
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${config.color}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                {/* Rating (for recommendations) */}
                {(newPostCategory === "recomendacion" || newPostCategory === "ambiente") && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="hover:scale-110 transition-transform"
                        onClick={() => setNewPostRating(star)}
                        aria-label={`${star} estrellas`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newPostRating ? "fill-accent text-accent" : "fill-muted text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleCreatePost}
                disabled={isSubmitting || !newPostContent.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{totalPosts}</div>
            <div className="text-sm text-muted-foreground">Publicaciones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{avgRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Valoración</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{recommendPercent}%</div>
            <div className="text-sm text-muted-foreground">Recomiendan</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{uniqueUsers}</div>
            <div className="text-sm text-muted-foreground">Aficionados</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <TabsTrigger key={key} value={key}>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                {activeTab === "all"
                  ? "Publicaciones de la Comunidad"
                  : categoryConfig[activeTab as PostCategory].label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={profile?.id}
                      onLike={() => handleLikePost(post.id)}
                      onReply={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      isReplying={replyingTo === post.id}
                      replyContent={replyContent}
                      onReplyContentChange={setReplyContent}
                      onSubmitReply={() => handleAddReply(post.id)}
                      formatTimeAgo={formatTimeAgo}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay publicaciones en esta categoría</p>
                  <p className="text-sm">Sé el primero en compartir tu experiencia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Tips */}
      {topTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Consejos Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topTips.map((tip, idx) => {
                const config = categoryConfig[tip.category]
                const Icon = config.icon
                return (
                  <li
                    key={tip.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${idx === 0 ? "bg-accent/10" : "bg-muted"}`}
                  >
                    <div
                      className={`w-6 h-6 ${idx === 0 ? "bg-accent" : "bg-secondary"} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <span
                        className={`text-xs font-bold ${idx === 0 ? "text-accent-foreground" : "text-secondary-foreground"}`}
                      >
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${config.color}`} />
                        <span className="font-semibold text-sm">{tip.userName}</span>
                        <Badge variant="outline" className="text-xs">
                          Nivel {tip.userLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{tip.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{tip.likes} likes</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Separate component for individual posts
function PostCard({
  post,
  currentUserId,
  onLike,
  onReply,
  isReplying,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  formatTimeAgo,
}: {
  post: CommunityPost
  currentUserId?: string
  onLike: () => void
  onReply: () => void
  isReplying: boolean
  replyContent: string
  onReplyContentChange: (content: string) => void
  onSubmitReply: () => void
  formatTimeAgo: (date: string) => string
}) {
  const config = categoryConfig[post.category]
  const Icon = config.icon
  const hasLiked = currentUserId ? post.likedBy.includes(currentUserId) : false

  return (
    <div className="border-b border-border last:border-0 pb-4 last:pb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.userName}</span>
              <Badge variant="outline" className="text-xs">
                Nivel {post.userLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <span className={`font-medium flex items-center gap-1 ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
              </span>
            </div>
          </div>
        </div>
        {post.rating && (
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < post.rating! ? "fill-accent text-accent" : "fill-muted text-muted"}`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-muted-foreground leading-relaxed mb-3">{post.content}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={onLike}
          className={`flex items-center gap-1 text-sm transition-colors ${
            hasLiked ? "text-accent" : "text-muted-foreground hover:text-accent"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
          <span>{post.likes}</span>
        </button>
        <button onClick={onReply} className="text-sm text-muted-foreground hover:text-accent transition-colors">
          Responder ({post.replies.length})
        </button>
      </div>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-muted space-y-3">
          {post.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{reply.userName}</span>
                <span className="text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-muted-foreground">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {isReplying && (
        <div className="mt-4 pl-6 flex gap-2">
          <Textarea
            placeholder="Escribe tu respuesta..."
            className="min-h-[60px] text-sm"
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={onSubmitReply}
            disabled={!replyContent.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
