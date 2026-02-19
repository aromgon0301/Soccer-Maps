import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const body = await request.json()
  const { userId } = body

  // This would update the database in production
  // For now, return success
  return NextResponse.json({
    success: true,
    postId,
    userId,
    action: "liked",
  })
}
