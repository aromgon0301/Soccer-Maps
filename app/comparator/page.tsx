import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { StadiumComparator } from "@/components/stadium-comparator"

export default function ComparatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <SiteHeader backHref="/" backLabel="Volver" subtitle="Comparador" />

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <StadiumComparator />
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
