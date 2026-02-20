import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/mongodb"
import { registerSchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    const parsed = registerSchema.safeParse(rawBody)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Datos de registro invalidos"
      logApiError("/api/auth/register", "VALIDATION", message, { payload: rawBody })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const normalizedEmail = email.trim().toLowerCase()
    const db = await getDb()
    const users = db.collection("users")

    const exists = await users.findOne({ email: normalizedEmail })
    if (exists) {
      logApiError("/api/auth/register", "CONFLICT", "duplicate email", { email: normalizedEmail })
      return NextResponse.json({ error: "Ya existe una cuenta con este email" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const newUser = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    await users.insertOne(newUser)

    const authUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    }

    logApiSuccess("/api/auth/register", "REGISTER", { userId: authUser.id, email: authUser.email })

    return NextResponse.json({ success: true, user: authUser })
  } catch (error) {
    logApiError("/api/auth/register", "REGISTER", error)
    return NextResponse.json({ error: "No se pudo registrar el usuario" }, { status: 500 })
  }
}
