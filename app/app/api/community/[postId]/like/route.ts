import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import type { CommunityPost } from "@/lib/default-data"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const db = await getDb()
  const collection = db.collection<CommunityPost>("community_posts")
  const post = await collection.findOne({ id: postId })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const hasLiked = post.likedBy.includes(userId)
  const nextLikedBy = hasLiked ? post.likedBy.filter((id) => id !== userId) : [...post.likedBy, userId]
  const nextLikes = hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1

  await collection.updateOne({ id: postId }, { $set: { likedBy: nextLikedBy, likes: nextLikes } })

  const updated = await collection.findOne({ id: postId })

  return NextResponse.json({
    success: true,
    post: updated,
  })
}
