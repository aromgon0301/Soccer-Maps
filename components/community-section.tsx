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
import { useI18n } from "@/lib/i18n"

interface CommunitySectionProps {
  team: Team
}

const categoryConfig: Record<PostCategory, { labelKey: string; icon: typeof AlertTriangle; color: string }> = {
  aviso: { labelKey: "warning", icon: AlertTriangle, color: "text-yellow-500" },
  recomendacion: { labelKey: "recommendation", icon: Lightbulb, color: "text-accent" },
  ambiente: { labelKey: "atmosphere", icon: Music, color: "text-purple-500" },
  pregunta: { labelKey: "visitors", icon: HelpCircle, color: "text-blue-500" },
}

export function CommunitySection({ team }: CommunitySectionProps) {
  const { toast } = useToast()
  const { t } = useI18n()
  const { profile, isInitialized, initializeUser, incrementReviews, addExperience } = useUserStore()
  const { posts, createPost, toggleLikePost, addReply, getPostsByTeam } = useCommunityStore()

  const [activeTab, setActiveTab] = useState<"all" | PostCategory>("all")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>("recomendacion")
  const [newPostRating, setNewPostRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    if (!isInitialized) {
      initializeUser()
    }
  }, [isInitialized, initializeUser])

  const teamPosts = getPostsByTeam(team.id)
  const filteredPosts = activeTab === "all" ? teamPosts : teamPosts.filter((p) => p.category === activeTab)

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
      toast({ title: "Error", description: t("writeBeforePosting"), variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    createPost({
      userId: profile.id,
      userName: profile.name,
      userLevel: profile.level,
      content: newPostContent.trim(),
      category: newPostCategory,
      rating: newPostCategory === "recomendacion" || newPostCategory === "ambiente" ? newPostRating : undefined,
      teamId: team.id,
      teamName: team.name,
    })
    incrementReviews()
    addExperience(25)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setNewPostContent("")
    setIsSubmitting(false)
    toast({ title: t("published"), description: t("publishedDesc") })
  }

  const handleLikePost = (postId: string) => {
    if (!profile) {
      toast({ title: t("loginRequired"), description: t("loginRequiredDesc"), variant: "destructive" })
      return
    }
    toggleLikePost(postId, profile.id)
  }

  const handleAddReply = async (postId: string) => {
    if (!profile || !replyContent.trim()) return
    addReply(postId, { userId: profile.id, userName: profile.name, content: replyContent.trim() })
    setReplyContent("")
    setReplyingTo(null)
    toast({ title: t("replySent"), description: t("replySentDesc") })
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
    if (diffDays < 7) return `Hace ${diffDays} dias`
    return date.toLocaleDateString("es-ES")
  }

  const topTips = [...teamPosts].sort((a, b) => b.likes - a.likes).slice(0, 3).filter((p) => p.likes > 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Post Card */}
      <Card className="border-accent/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            Comparte tu experiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Textarea
              placeholder="Comparte tus recomendaciones..."
              className="min-h-[80px] sm:min-h-[100px] text-sm"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={newPostCategory} onValueChange={(v) => setNewPostCategory(v as PostCategory)}>
                  <SelectTrigger className="w-[140px] sm:w-[160px] text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const Icon = config.icon
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${config.color}`} />
                            {t(config.labelKey as any)}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {(newPostCategory === "recomendacion" || newPostCategory === "ambiente") && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="hover:scale-110 transition-transform" onClick={() => setNewPostRating(star)} aria-label={`${star} estrellas`}>
                        <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= newPostRating ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto text-sm"
                onClick={handleCreatePost}
                disabled={isSubmitting || !newPostContent.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                {t("post")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          { value: totalPosts, label: "Publicaciones" },
          { value: avgRating.toFixed(1), label: "Valoracion" },
          { value: `${recommendPercent}%`, label: "Recomiendan" },
          { value: uniqueUsers, label: "Aficionados" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-3 sm:pt-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <TabsList className="flex w-max min-w-full sm:grid sm:w-full sm:grid-cols-5">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">{t("all")}</TabsTrigger>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">
                {t(config.labelKey as any)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base sm:text-lg">
                {activeTab === "all" ? "Publicaciones de la Comunidad" : t(categoryConfig[activeTab as PostCategory]?.labelKey as any)}
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
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm">No hay publicaciones en esta categoria</p>
                  <p className="text-xs">Se el primero en compartir tu experiencia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {topTips.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base sm:text-lg">Consejos Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 sm:space-y-3">
              {topTips.map((tip, idx) => {
                const config = categoryConfig[tip.category]
                const Icon = config.icon
                return (
                  <li key={tip.id} className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg ${idx === 0 ? "bg-accent/10" : "bg-muted"}`}>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 ${idx === 0 ? "bg-accent" : "bg-secondary"} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={`text-[10px] font-bold ${idx === 0 ? "text-accent-foreground" : "text-secondary-foreground"}`}>{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                        <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${config.color}`} />
                        <span className="font-semibold text-xs sm:text-sm">{tip.userName}</span>
                        <Badge variant="outline" className="text-[10px]">Nivel {tip.userLevel}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{tip.content}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
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
  const { t } = useI18n()

  return (
    <div className="border-b border-border last:border-0 pb-4 last:pb-0">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-xs sm:text-sm truncate">{post.userName}</span>
              <Badge variant="outline" className="text-[10px]">Nivel {post.userLevel}</Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>·</span>
              <span className={`font-medium flex items-center gap-0.5 ${config.color}`}>
                <Icon className="w-3 h-3" />
                {t(config.labelKey as any)}
              </span>
            </div>
          </div>
        </div>
        {post.rating && (
          <div className="flex gap-0.5 shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < post.rating! ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">{post.content}</p>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onLike}
          className={`flex items-center gap-1 text-xs sm:text-sm transition-colors ${hasLiked ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${hasLiked ? "fill-current" : ""}`} />
          <span>{post.likes}</span>
        </button>
        <button onClick={onReply} className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors">
          Responder ({post.replies.length})
        </button>
      </div>
      {post.replies.length > 0 && (
        <div className="mt-3 pl-4 sm:pl-6 border-l-2 border-muted space-y-2 sm:space-y-3">
          {post.replies.map((reply) => (
            <div key={reply.id} className="text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <span className="font-semibold">{reply.userName}</span>
                <span className="text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-muted-foreground">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
      {isReplying && (
        <div className="mt-3 pl-4 sm:pl-6 flex gap-2">
          <Textarea
            placeholder="Escribe tu respuesta..."
            className="min-h-[50px] sm:min-h-[60px] text-xs sm:text-sm"
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
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
