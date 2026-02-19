import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { SAMPLE_COMMUNITY_POSTS, type CommunityPost } from "@/lib/default-data"

const toPost = (document: CommunityPost & { _id?: unknown }): CommunityPost => {
  const { _id, ...post } = document
  return post
}

const ensureSeedData = async () => {
  const db = await getDb()
  const collection = db.collection<CommunityPost>("community_posts")
  const count = await collection.estimatedDocumentCount()

  if (count === 0) {
    await collection.insertMany(SAMPLE_COMMUNITY_POSTS)
  }

  return collection
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")
  const category = searchParams.get("category")

  const collection = await ensureSeedData()
  const filter: Partial<CommunityPost> = {}

  if (teamId) {
    filter.teamId = teamId
  }

  if (category) {
    filter.category = category as CommunityPost["category"]
  }

  const posts = await collection.find(filter).sort({ createdAt: -1 }).toArray()

  return NextResponse.json({ posts: posts.map((post) => toPost(post as CommunityPost & { _id?: unknown })) })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const collection = await ensureSeedData()

  const post: CommunityPost = {
    id: `post-${Date.now()}`,
    ...body,
    likes: 0,
    likedBy: [],
    replies: [],
    isGlobalPost: body.isGlobalPost ?? false,
    createdAt: new Date().toISOString(),
  }

  await collection.insertOne(post)

  return NextResponse.json({ post, success: true })
}
