"use client"

import Link from "next/link"
import { UserPlus, LogIn, Star, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"

export function AuthBanner() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) return null

  return (
    <section className="py-4 bg-accent/5 border-b border-accent/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Registrate gratis para:</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-accent" />
              Guardar favoritos
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Hacer check-in
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              Publicar en comunidad
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="w-4 h-4 mr-1.5" />
                Entrar
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <UserPlus className="w-4 h-4 mr-1.5" />
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
