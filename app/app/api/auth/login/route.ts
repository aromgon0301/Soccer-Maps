import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/mongodb"
import { loginSchema } from "@/lib/validation"
import { logApiError, logApiSuccess } from "@/lib/server-logger"

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    const parsed = loginSchema.safeParse(rawBody)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Datos de acceso invalidos"
      logApiError("/api/auth/login", "VALIDATION", message, { payload: rawBody })
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { email, password } = parsed.data

    const normalizedEmail = email.trim().toLowerCase()
    const db = await getDb()
    const users = db.collection("users")
    const user = await users.findOne({ email: normalizedEmail })

    if (!user) {
      logApiError("/api/auth/login", "NOT_FOUND", "user not found", { email: normalizedEmail })
      return NextResponse.json({ error: "No existe una cuenta con este email" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      logApiError("/api/auth/login", "AUTH", "invalid password", { email: normalizedEmail })
      return NextResponse.json({ error: "Contrasena incorrecta" }, { status: 401 })
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    }

    logApiSuccess("/api/auth/login", "LOGIN", { userId: authUser.id, email: authUser.email })

    return NextResponse.json({ success: true, user: authUser })
  } catch (error) {
    logApiError("/api/auth/login", "LOGIN", error)
    return NextResponse.json({ error: "No se pudo iniciar sesion" }, { status: 500 })
  }
}
