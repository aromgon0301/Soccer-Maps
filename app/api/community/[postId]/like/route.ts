import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { communityLikeSchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const body = await request.json()
    const parsed = communityLikeSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid payload"
      logApiError("/api/community/[postId]/like", "VALIDATION", message, { postId, payload: body })
      return NextResponse.json({ error: message }, { status: 400 })
    }
    const { userId } = parsed.data

    const db = await getDb()
    const collection = db.collection("community_posts")
    const post = await collection.findOne({ id: postId })

    if (!post) {
      logApiError("/api/community/[postId]/like", "NOT_FOUND", "Post not found", { postId, userId })
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : []
    const currentLikes = typeof post.likes === "number" ? post.likes : 0
    const hasLiked = likedBy.includes(userId)
    const action = hasLiked ? "unliked" : "liked"

    if (hasLiked) {
      await collection.updateOne(
        { id: postId },
        {
          $set: {
            likedBy: likedBy.filter((id: string) => id !== userId),
            likes: Math.max(0, currentLikes - 1),
          },
        },
      )
    } else {
      await collection.updateOne(
        { id: postId },
        {
          $set: {
            likedBy: [...likedBy, userId],
            likes: currentLikes + 1,
          },
        },
      )
    }

    const updated = await collection.findOne({ id: postId }, { projection: { _id: 0 } })
    logApiSuccess("/api/community/[postId]/like", "POST", { postId, userId, action })

    return NextResponse.json({
      success: true,
      postId,
      userId,
      action,
      post: updated,
    })
  } catch (error) {
    logApiError("/api/community/[postId]/like", "POST", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
