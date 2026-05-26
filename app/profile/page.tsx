import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FanProfile } from "@/components/fan-profile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <SiteHeader backHref="/" backLabel="Volver" subtitle="Mi Perfil" />

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FanProfile />
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
