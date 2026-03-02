import { type NextRequest, NextResponse } from "next/server"

// Sample posts - in production use a real database
const posts = [
  {
    id: "post-1",
    userId: "user-sample-1",
    userName: "Carlos M.",
    userLevel: 4,
    content:
      "El Bar Los Aficionados cerca del estadio es increíble. Precios buenos y ambiente genial antes del partido.",
    category: "recomendacion",
    rating: 5,
    teamId: "barcelona",
    teamName: "FC Barcelona",
    likes: 24,
    likedBy: [] as string[],
    replies: [
      {
        id: "reply-1",
        userId: "user-sample-2",
        userName: "Laura P.",
        content: "Totalmente de acuerdo! El personal es muy amable.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 5,
        likedBy: [] as string[],
      },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "post-2",
    userId: "user-sample-2",
    userName: "María G.",
    userLevel: 3,
    content: "Recomiendo llegar 1 hora antes. El acceso norte es el más rápido, casi sin colas.",
    category: "aviso",
    teamId: "barcelona",
    teamName: "FC Barcelona",
    likes: 18,
    likedBy: [] as string[],
    replies: [],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "post-3",
    userId: "user-sample-3",
    userName: "Javier R.",
    userLevel: 5,
    content: "Parking Sur es la mejor opción. Un poco más caro pero muy cerca y sin esperas para salir.",
    category: "recomendacion",
    rating: 4,
    teamId: "real-madrid",
    teamName: "Real Madrid",
    likes: 12,
    likedBy: [] as string[],
    replies: [],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")
  const category = searchParams.get("category")

  let filtered = posts

  if (teamId) {
    filtered = filtered.filter((p) => p.teamId === teamId)
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }

  // Sort by most recent
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ posts: filtered })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const post = {
    id: `post-${Date.now()}`,
    ...body,
    likes: 0,
    likedBy: [],
    replies: [],
    createdAt: new Date().toISOString(),
  }

  posts.unshift(post)

  return NextResponse.json({ post, success: true })
}
