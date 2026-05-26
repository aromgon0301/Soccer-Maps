import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Iniciar Sesion | Soccer Maps - La Liga",
  description: "Accede a tu cuenta de Soccer Maps para gestionar tu perfil, reservas y comunidad.",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
