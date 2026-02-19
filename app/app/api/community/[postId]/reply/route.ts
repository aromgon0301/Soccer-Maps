import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import type { CommunityPost, CommunityReply } from "@/lib/default-data"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const body = await request.json()

  if (!body?.userId || !body?.userName || !body?.content) {
    return NextResponse.json({ error: "Reply data is incomplete" }, { status: 400 })
  }

  const db = await getDb()
  const collection = db.collection<CommunityPost>("community_posts")
  const post = await collection.findOne({ id: postId })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const reply: CommunityReply = {
    id: `reply-${Date.now()}`,
    userId: body.userId,
    userName: body.userName,
    userFavoriteTeamBadge: body.userFavoriteTeamBadge,
    isPremium: body.isPremium,
    content: body.content,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
  }

  await collection.updateOne({ id: postId }, { $push: { replies: reply } })

  const updated = await collection.findOne({ id: postId })

  return NextResponse.json({ success: true, post: updated, reply })
}
