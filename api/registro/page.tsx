import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Crear Cuenta | Soccer Maps - La Liga",
  description: "Registrate en Soccer Maps para acceder a mapas interactivos, comunidad de aficionados y planes de dia del partido.",
}

export default function RegistroPage() {
  return <AuthForm mode="register" />
}
