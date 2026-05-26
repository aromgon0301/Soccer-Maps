"use client"

import { X, Crown } from "lucide-react"
import { useState, useEffect } from "react"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdBannerProps {
  variant?: "horizontal" | "vertical" | "inline"
  className?: string
  showUpgradePrompt?: boolean
}

// Demo ad content
const AD_CONTENT = {
  horizontal: [
    {
      title: { en: "Book your match day experience", es: "Reserva tu experiencia de dia de partido" },
      description: { en: "Hotels, restaurants, and tickets", es: "Hoteles, restaurantes y entradas" },
      cta: { en: "Learn more", es: "Saber mas" },
      bg: "from-blue-600 to-blue-800",
    },
    {
      title: { en: "Official La Liga merchandise", es: "Merchandising oficial de La Liga" },
      description: { en: "Get your team's gear", es: "Consigue el equipamiento de tu equipo" },
      cta: { en: "Shop now", es: "Comprar" },
      bg: "from-red-600 to-red-800",
    },
  ],
  vertical: [
    {
      title: { en: "Premium Seats Available", es: "Asientos Premium Disponibles" },
      description: { en: "Best views guaranteed", es: "Mejores vistas garantizadas" },
      cta: { en: "Check tickets", es: "Ver entradas" },
      bg: "from-emerald-600 to-emerald-800",
    },
  ],
  inline: [
    {
      title: { en: "Special offer!", es: "Oferta especial!" },
      description: { en: "20% off match day packages", es: "20% descuento en paquetes" },
      cta: { en: "View", es: "Ver" },
      bg: "from-amber-600 to-amber-800",
    },
  ],
}

export function AdBanner({ variant = "horizontal", className = "", showUpgradePrompt = true }: AdBannerProps) {
  const { subscription } = useSubscriptionStore()
  const { locale } = useI18nStore()
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentAd, setCurrentAd] = useState(0)

  const isPremium = subscription?.status === "active" && subscription?.plan !== "free"

  // Rotate ads
  useEffect(() => {
    const ads = AD_CONTENT[variant]
    if (ads.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % ads.length)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [variant])

  // Don't show ads for premium users
  if (isPremium) {
    return null
  }

  if (isDismissed) {
    return null
  }

  const ads = AD_CONTENT[variant]
  const ad = ads[currentAd]
  const lang = locale === "es" ? "es" : "en"

  if (variant === "vertical") {
    return (
      <div className={`relative rounded-xl overflow-hidden ${className}`}>
        <div className={`bg-gradient-to-br ${ad.bg} p-6 text-white min-h-[200px] flex flex-col justify-between`}>
          <div>
            <div className="text-xs uppercase tracking-wider opacity-75 mb-2">
              {locale === "es" ? "Anuncio" : "Advertisement"}
            </div>
            <h3 className="text-lg font-bold mb-2">{ad.title[lang]}</h3>
            <p className="text-sm opacity-90">{ad.description[lang]}</p>
          </div>
          <Button variant="secondary" size="sm" className="mt-4 w-full">
            {ad.cta[lang]}
          </Button>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-colors"
          aria-label={locale === "es" ? "Cerrar anuncio" : "Close ad"}
        >
          <X className="w-4 h-4" />
        </button>
        
        {showUpgradePrompt && (
          <Link href="/premium">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-500/20 p-3 text-center hover:from-amber-500/20 hover:to-orange-500/20 transition-colors cursor-pointer">
              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" />
                {locale === "es" ? "Eliminar anuncios con Premium" : "Remove ads with Premium"}
              </p>
            </div>
          </Link>
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`relative ${className}`}>
        <div className={`bg-gradient-to-r ${ad.bg} rounded-lg p-3 text-white flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="text-[10px] uppercase tracking-wider opacity-75 px-1.5 py-0.5 bg-white/10 rounded">
              {locale === "es" ? "Ad" : "Ad"}
            </div>
            <div>
              <span className="font-semibold text-sm">{ad.title[lang]}</span>
              <span className="text-sm opacity-90 ml-2">{ad.description[lang]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              {ad.cta[lang]}
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/30 transition-colors"
              aria-label={locale === "es" ? "Cerrar" : "Close"}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Horizontal (default)
  return (
    <div className={`relative ${className}`}>
      <div className={`bg-gradient-to-r ${ad.bg} rounded-xl p-4 md:p-6 text-white`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-[10px] uppercase tracking-wider opacity-75 px-2 py-1 bg-white/10 rounded flex-shrink-0">
              {locale === "es" ? "Anuncio" : "Ad"}
            </div>
            <div>
              <h3 className="font-bold text-lg">{ad.title[lang]}</h3>
              <p className="text-sm opacity-90">{ad.description[lang]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="secondary" size="sm">
              {ad.cta[lang]}
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/30 transition-colors"
              aria-label={locale === "es" ? "Cerrar anuncio" : "Close ad"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {showUpgradePrompt && (
          <Link href="/premium">
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs opacity-75 hover:opacity-100 transition-opacity">
              <Crown className="w-3 h-3" />
              {locale === "es" ? "Hazte Premium y elimina los anuncios" : "Go Premium and remove ads"}
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

// A simpler component for showing a premium upgrade prompt instead of an ad
export function PremiumUpgradePrompt({ className = "" }: { className?: string }) {
  const { subscription } = useSubscriptionStore()
  const { locale } = useI18nStore()

  const isPremium = subscription?.status === "active" && subscription?.plan !== "free"

  if (isPremium) return null

  return (
    <Link href="/premium" className={className}>
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 hover:from-amber-500/15 hover:to-orange-500/15 transition-colors group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg group-hover:text-amber-600 transition-colors">
              {locale === "es" ? "Mejora a Premium" : "Upgrade to Premium"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {locale === "es"
                ? "Elimina anuncios y desbloquea funciones exclusivas"
                : "Remove ads and unlock exclusive features"}
            </p>
          </div>
          <div className="text-amber-600 font-bold">
            {locale === "es" ? "Desde 4,99€/mes" : "From €4.99/month"}
          </div>
        </div>
      </div>
    </Link>
  )
}
