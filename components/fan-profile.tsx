"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Trophy,
  MapPin,
  Calendar,
  Star,
  Award,
  Target,
  Users,
  Heart,
  Flame,
  Zap,
  CheckCircle2,
  Edit,
  Save,
  Loader2,
  Car,
  Train,
  Footprints,
  Bus,
} from "lucide-react"
import Image from "next/image"
import { useUserStore, useReservationsStore } from "@/lib/stores"
import type { FanType, TransportPreference, AtmospherePreference, ArrivalPreference } from "@/lib/stores"
import { teams } from "@/lib/teams-data"

const BADGES_CONFIG = [
  {
    id: "first-visit",
    name: "Primera Visita",
    icon: MapPin,
    description: "Visitaste tu primer estadio",
  },
  {
    id: "local-hero",
    name: "Héroe Local",
    icon: Heart,
    description: "Has visitado el estadio de tu equipo 5 veces",
  },
  {
    id: "explorer",
    name: "Explorador",
    icon: Target,
    description: "Visitaste 3 estadios diferentes",
  },
  {
    id: "passionate",
    name: "Apasionado",
    icon: Flame,
    description: "Asiste a 10 partidos en una temporada",
  },
  {
    id: "legend",
    name: "Leyenda",
    icon: Trophy,
    description: "Visita todos los estadios de La Liga",
  },
  {
    id: "early-bird",
    name: "Madrugador",
    icon: Zap,
    description: "Llega 2 horas antes al partido",
  },
]

const FAN_TYPES: { value: FanType; label: string; description: string }[] = [
  { value: "familiar", label: "Familiar", description: "Vas con familia, prefieres zonas tranquilas" },
  { value: "visitante", label: "Visitante", description: "Sigues a tu equipo como visitante" },
  { value: "ultra", label: "Ultra/Hincha", description: "Vives el fútbol al máximo, zona de animación" },
  { value: "turista", label: "Turista", description: "Primera vez, quieres la mejor experiencia" },
]

const TRANSPORT_OPTIONS: { value: TransportPreference; label: string; icon: typeof Train }[] = [
  { value: "metro", label: "Metro", icon: Train },
  { value: "bus", label: "Autobús", icon: Bus },
  { value: "coche", label: "Coche", icon: Car },
  { value: "andando", label: "Andando", icon: Footprints },
]

const ATMOSPHERE_OPTIONS: { value: AtmospherePreference; label: string }[] = [
  { value: "tranquilo", label: "Tranquilo" },
  { value: "animado", label: "Animado" },
  { value: "hinchada", label: "Zona Hinchada" },
]

const ARRIVAL_OPTIONS: { value: ArrivalPreference; label: string }[] = [
  { value: "temprano", label: "2+ horas antes" },
  { value: "justo", label: "30-60 min antes" },
  { value: "ultimo-minuto", label: "Justo a tiempo" },
]

export function FanProfile() {
  const { profile, visits, isInitialized, initializeUser, updateProfile, setFavoriteTeam } = useUserStore()
  const { reservations, loadReservations } = useReservationsStore()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    favoriteTeamId: "",
    fanType: "familiar" as FanType,
    transportPreference: "metro" as TransportPreference,
    atmospherePreference: "animado" as AtmospherePreference,
    arrivalPreference: "temprano" as ArrivalPreference,
  })

  // Initialize user on mount
  useEffect(() => {
    if (!isInitialized) {
      void initializeUser()
    }
  }, [isInitialized, initializeUser])

  useEffect(() => {
    if (profile?.id) {
      void loadReservations(profile.id)
    }
  }, [profile?.id, loadReservations])

  // Sync form with profile when dialog opens
  useEffect(() => {
    if (profile && isEditDialogOpen) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        favoriteTeamId: profile.favoriteTeamId || "",
        fanType: profile.fanType,
        transportPreference: profile.transportPreference,
        atmospherePreference: profile.atmospherePreference,
        arrivalPreference: profile.arrivalPreference,
      })
    }
  }, [profile, isEditDialogOpen])

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    await updateProfile({
      name: editForm.name,
      email: editForm.email,
      fanType: editForm.fanType,
      transportPreference: editForm.transportPreference,
      atmospherePreference: editForm.atmospherePreference,
      arrivalPreference: editForm.arrivalPreference,
    })

    if (editForm.favoriteTeamId) {
      await setFavoriteTeam(editForm.favoriteTeamId)
    }

    setIsSaving(false)
    setIsEditDialogOpen(false)
  }

  if (!isInitialized || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  const favoriteTeam = teams.find((t) => t.id === profile.favoriteTeamId)
  const userReservations = reservations.filter((r) => r.userId === profile.id)
  const experienceToNextLevel = profile.level * 500 - profile.experience
  const progressPercent = (profile.experience % 500) / 5

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-12 h-12 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="font-display text-2xl mb-2">{profile.name}</CardTitle>
              <CardDescription className="text-base mb-4">
                Miembro desde{" "}
                {new Date(profile.createdAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {favoriteTeam && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Heart className="w-3 h-3 mr-1" />
                    {favoriteTeam.name}
                  </Badge>
                )}
                <Badge variant="outline">
                  Nivel {profile.level}: {getLevelName(profile.level)}
                </Badge>
                <Badge variant="outline">{profile.stadiumsVisited.length} Estadios</Badge>
                <Badge variant="outline">{FAN_TYPES.find((f) => f.value === profile.fanType)?.label}</Badge>
              </div>
            </div>
            <Button variant="outline" className="bg-transparent" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.stadiumsVisited.length}</div>
                <div className="text-xs text-muted-foreground">Estadios</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.matchesAttended}</div>
                <div className="text-xs text-muted-foreground">Partidos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.reviewsWritten}</div>
                <div className="text-xs text-muted-foreground">Reseñas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.badges.length}</div>
                <div className="text-xs text-muted-foreground">Insignias</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Progreso de Nivel
          </CardTitle>
          <CardDescription>
            {experienceToNextLevel > 0
              ? `${experienceToNextLevel} XP más para alcanzar ${getLevelName(profile.level + 1)}`
              : "Has alcanzado el nivel máximo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Nivel {profile.level}: {getLevelName(profile.level)}
              </span>
              <span className="text-muted-foreground">{profile.experience} XP</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-1">Nivel Actual</div>
              <div className="text-2xl font-bold text-accent">{profile.level}</div>
              <div className="text-xs text-muted-foreground">{getLevelName(profile.level)}</div>
            </div>
            <div className="p-4 bg-accent/10 border border-accent rounded-lg">
              <div className="text-sm font-semibold mb-1">Siguiente Nivel</div>
              <div className="text-2xl font-bold">{Math.min(profile.level + 1, 10)}</div>
              <div className="text-xs text-muted-foreground">{getLevelName(Math.min(profile.level + 1, 10))}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-1">Nivel Máximo</div>
              <div className="text-2xl font-bold">10</div>
              <div className="text-xs text-muted-foreground">Leyenda del Fútbol</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Colección de Insignias
          </CardTitle>
          <CardDescription>Consigue insignias completando desafíos y visitando estadios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BADGES_CONFIG.map((badge) => {
              const Icon = badge.icon
              const isUnlocked = profile.badges.includes(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-lg border-2 text-center transition-all ${
                    isUnlocked
                      ? "bg-accent/10 border-accent hover:scale-105 cursor-pointer"
                      : "bg-muted border-muted-foreground/20 opacity-50"
                  }`}
                  title={badge.description}
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      isUnlocked ? "bg-accent" : "bg-muted-foreground/20"
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${isUnlocked ? "text-accent-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div className={`text-xs font-semibold ${isUnlocked ? "" : "text-muted-foreground"}`}>
                    {badge.name}
                  </div>
                  {isUnlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stadium Visits History */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Historial de Visitas
          </CardTitle>
          <CardDescription>Estadios que has visitado y check-ins realizados</CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length > 0 ? (
            <div className="space-y-3">
              {visits.map((visit, idx) => {
                const team = teams.find((t) => t.id === visit.teamId)
                return (
                  <div
                    key={visit.id}
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="w-12 h-12 relative flex-shrink-0">
                      {team && (
                        <Image
                          src={`/${team.id}-badge.jpg`}
                          alt={team.name}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{visit.stadiumName}</div>
                      <div className="text-sm text-muted-foreground">{visit.teamName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{new Date(visit.date).toLocaleDateString("es-ES")}</div>
                      <Badge variant="outline" className="mt-1">
                        Visita #{visits.length - idx}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aún no has registrado ninguna visita</p>
              <p className="text-sm">Visita un estadio y haz check-in para empezar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reservations */}
      {userReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Mis Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userReservations.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-semibold">{res.poiName}</div>
                    <div className="text-sm text-muted-foreground">
                      {res.guests} personas · {res.time}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Código: {res.confirmationCode}</div>
                  </div>
                  <Badge
                    variant={res.status === "confirmed" ? "default" : "secondary"}
                    className={res.status === "confirmed" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {res.status === "confirmed" ? "Confirmada" : res.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            Mis Preferencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2 text-muted-foreground">Ambiente Preferido</div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" />
                <span className="font-medium">
                  {ATMOSPHERE_OPTIONS.find((a) => a.value === profile.atmospherePreference)?.label}
                </span>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2 text-muted-foreground">Tipo de Aficionado</div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="font-medium">{FAN_TYPES.find((f) => f.value === profile.fanType)?.label}</span>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2 text-muted-foreground">Transporte Habitual</div>
              <div className="flex items-center gap-2">
                {(() => {
                  const transport = TRANSPORT_OPTIONS.find((t) => t.value === profile.transportPreference)
                  const Icon = transport?.icon || Train
                  return (
                    <>
                      <Icon className="w-5 h-5 text-accent" />
                      <span className="font-medium">{transport?.label}</span>
                    </>
                  )
                })()}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2 text-muted-foreground">Llegada Típica</div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-medium">
                  {ARRIVAL_OPTIONS.find((a) => a.value === profile.arrivalPreference)?.label}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Personaliza tu perfil para recibir recomendaciones personalizadas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Equipo Favorito</Label>
              <Select
                value={editForm.favoriteTeamId}
                onValueChange={(v) => setEditForm({ ...editForm, favoriteTeamId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu equipo" />
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

            <div className="space-y-2">
              <Label>Tipo de Aficionado</Label>
              <Select
                value={editForm.fanType}
                onValueChange={(v) => setEditForm({ ...editForm, fanType: v as FanType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FAN_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transporte Preferido</Label>
                <Select
                  value={editForm.transportPreference}
                  onValueChange={(v) => setEditForm({ ...editForm, transportPreference: v as TransportPreference })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ambiente Preferido</Label>
                <Select
                  value={editForm.atmospherePreference}
                  onValueChange={(v) => setEditForm({ ...editForm, atmospherePreference: v as AtmospherePreference })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ATMOSPHERE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Llegada al Estadio</Label>
              <Select
                value={editForm.arrivalPreference}
                onValueChange={(v) => setEditForm({ ...editForm, arrivalPreference: v as ArrivalPreference })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARRIVAL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getLevelName(level: number): string {
  const names = [
    "Novato",
    "Aficionado",
    "Seguidor",
    "Aficionado Activo",
    "Experto",
    "Veterano",
    "Maestro",
    "Gurú",
    "Élite",
    "Leyenda del Fútbol",
  ]
  return names[Math.min(level - 1, names.length - 1)]
}
