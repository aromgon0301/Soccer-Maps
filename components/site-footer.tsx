import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-muted mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image src="/logo-soccer-maps.png" alt="Soccer Maps Logo" fill className="object-contain rounded-lg" />
              </div>
              <h4 className="font-display font-bold group-hover:text-accent transition-colors">Soccer Maps</h4>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu guía definitiva para estadios y ciudades de La Liga española.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-3 text-sm">Sobre nosotros</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Sobre Soccer Maps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Colaboraciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Prensa
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3 text-sm">Ayuda</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Soporte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Guía de uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3 text-sm">Legal</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Términos de uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Aviso legal
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground max-w-6xl mx-auto">
          <p>&copy; 2026 Soccer Maps - La Liga. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
