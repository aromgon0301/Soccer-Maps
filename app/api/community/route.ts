import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { communityPostSchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")
    const category = searchParams.get("category")

    const filter: Record<string, unknown> = {}
    if (teamId) filter.teamId = teamId
    if (category) filter.category = category

    const db = await getDb()
    const posts = await db
      .collection("community_posts")
      .find(filter, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    logApiSuccess("/api/community", "GET", { count: posts.length, filter })

    return NextResponse.json({ posts })
  } catch (error) {
    logApiError("/api/community", "GET", error)
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = communityPostSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid post payload"
      logApiError("/api/community", "POST_VALIDATION", message, { payload: body })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const post = {
      id: `post-${crypto.randomUUID()}`,
      ...parsed.data,
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date().toISOString(),
    }

    const db = await getDb()
    await db.collection("community_posts").insertOne(post)

    logApiSuccess("/api/community", "POST", { postId: post.id, userId: post.userId })

    return NextResponse.json({ post, success: true })
  } catch (error) {
    logApiError("/api/community", "POST", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
