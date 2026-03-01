"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
  User,
  Heart,
} from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useUserStore } from "@/lib/stores/user-store"
import { teams } from "@/lib/teams-data"
import { useI18n } from "@/lib/i18n"

interface AuthFormProps {
  mode: "register" | "login"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const { register, login, isLoading, error, clearError } = useAuthStore()
  const { initializeUser, updateProfile, setFavoriteTeam } = useUserStore()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    favoriteTeamId: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (mode === "register") {
      if (!form.name.trim()) errors.name = "El nombre es obligatorio"
      if (form.name.trim().length < 2) errors.name = "El nombre debe tener al menos 2 caracteres"
    }
    if (!form.email.trim()) {
      errors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Introduce un email valido"
    }
    if (!form.password) {
      errors.password = "La contrasena es obligatoria"
    } else if (form.password.length < 6) {
      errors.password = "Minimo 6 caracteres"
    }
    if (mode === "register" && form.password !== form.confirmPassword) {
      errors.confirmPassword = "Las contrasenas no coinciden"
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return

    if (mode === "register") {
      const result = await register(form.name, form.email, form.password)
      if (result.success) {
        initializeUser()
        updateProfile({ name: form.name, email: form.email })
        if (form.favoriteTeamId) setFavoriteTeam(form.favoriteTeamId)
        setSuccess(true)
        setTimeout(() => router.push("/profile"), 1200)
      }
    } else {
      const result = await login(form.email, form.password)
      if (result.success) {
        initializeUser()
        setSuccess(true)
        setTimeout(() => router.push("/"), 800)
      }
    }
  }

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
    if (error) clearError()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header bar */}
      <header className="bg-primary text-primary-foreground py-2.5 sm:py-3">
        <div className="container mx-auto px-3 sm:px-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group w-fit">
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
              <Image src="/logo-soccer-maps.png" alt="Soccer Maps Logo" fill className="object-contain rounded-lg" priority />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight group-hover:text-accent transition-colors font-sans">
                Soccer Maps
              </h1>
              <p className="text-[10px] sm:text-xs text-primary-foreground/80">La Liga</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main form */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-8 px-3 sm:px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2 px-4 sm:px-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              {mode === "register" ? (
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              ) : (
                <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              )}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {mode === "register" ? t("createAccountTitle") : t("signIn")}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {mode === "register" ? t("createAccountDesc") : t("signInDesc")}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {success && (
              <Alert className="mb-3 sm:mb-4 border-accent bg-accent/10">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertDescription className="text-accent text-xs sm:text-sm">
                  {mode === "register" ? t("accountCreatedSuccess") : t("signedInSuccess")}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-3 sm:mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {mode === "register" && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name" className="text-sm">{t("name")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className={`pl-10 text-sm ${validationErrors.name ? "border-destructive" : ""}`}
                      disabled={isLoading || success}
                      autoComplete="name"
                    />
                  </div>
                  {validationErrors.name && <p className="text-xs text-destructive">{validationErrors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className={`pl-10 text-sm ${validationErrors.email ? "border-destructive" : ""}`}
                    disabled={isLoading || success}
                    autoComplete="email"
                  />
                </div>
                {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "register" ? "Minimo 6 caracteres" : "Tu contrasena"}
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    className={`pl-10 pr-10 text-sm ${validationErrors.password ? "border-destructive" : ""}`}
                    disabled={isLoading || success}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && <p className="text-xs text-destructive">{validationErrors.password}</p>}
              </div>

              {mode === "register" && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">{t("confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contrasena"
                      value={form.confirmPassword}
                      onChange={(e) => updateForm("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 text-sm ${validationErrors.confirmPassword ? "border-destructive" : ""}`}
                      disabled={isLoading || success}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && <p className="text-xs text-destructive">{validationErrors.confirmPassword}</p>}
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm">
                    <Heart className="w-3.5 h-3.5 text-accent" />
                    {t("favoriteTeam")}
                    <span className="text-muted-foreground text-xs">({t("optional")})</span>
                  </Label>
                  <Select value={form.favoriteTeamId} onValueChange={(v) => updateForm("favoriteTeamId", v)} disabled={isLoading || success}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder={t("selectTeamPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-1 sm:mt-2"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "register" ? t("creatingAccount") : t("signingIn")}
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {mode === "register" ? t("accountCreated") : t("signedIn")}
                  </>
                ) : mode === "register" ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("createAccountBtn")}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("signInBtn")}
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">o</span>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              {mode === "register" ? (
                <>
                  {t("hasAccount")}{" "}
                  <Link href="/login" className="font-semibold text-accent hover:underline">
                    {t("signInLink")}
                  </Link>
                </>
              ) : (
                <>
                  {t("noAccount")}{" "}
                  <Link href="/registro" className="font-semibold text-accent hover:underline">
                    {t("registerFreeLink")}
                  </Link>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
