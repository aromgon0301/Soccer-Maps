import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { communityReplySchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const body = await request.json()
    const parsed = communityReplySchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid reply payload"
      logApiError("/api/community/[postId]/reply", "VALIDATION", message, { postId, payload: body })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const reply = {
      id: `reply-${crypto.randomUUID()}`,
      userId: parsed.data.userId,
      userName: parsed.data.userName,
      userFavoriteTeamBadge: parsed.data.userFavoriteTeamBadge,
      isPremium: parsed.data.isPremium,
      content: parsed.data.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [] as string[],
    }

    const db = await getDb()
    const posts = db.collection<{ id: string; replies: typeof reply[] }>("community_posts")
    const result = await posts.updateOne({ id: postId }, { $push: { replies: reply } })

    if (result.matchedCount === 0) {
      logApiError("/api/community/[postId]/reply", "NOT_FOUND", "Post not found", { postId, userId: parsed.data.userId })
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    logApiSuccess("/api/community/[postId]/reply", "POST", {
      postId,
      replyId: reply.id,
      userId: parsed.data.userId,
    })

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    logApiError("/api/community/[postId]/reply", "POST", error)
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 })
  }
}
