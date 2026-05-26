import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TeamNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-display font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-display font-bold mb-2">Equipo no encontrado</h2>
        <p className="text-muted-foreground mb-8">El equipo que buscas no existe en nuestra base de datos.</p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a equipos
          </Link>
        </Button>
      </div>
    </div>
  )
}
