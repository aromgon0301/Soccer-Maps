"use client"

import { Crown, Star, Zap, Award, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface PremiumBadgeProps {
  variant?: "default" | "compact" | "full"
  showTooltip?: boolean
  className?: string
}

export function PremiumBadge({ variant = "default", showTooltip = true, className = "" }: PremiumBadgeProps) {
  const { subscription } = useSubscriptionStore()
  const { locale } = useI18nStore()

  const isPremium = subscription?.status === "active" && subscription?.plan !== "free"
  const isUltra = subscription?.plan === "ultra"
  const isFan = subscription?.plan === "fan"

  if (!isPremium) return null

  const getBadgeConfig = () => {
    if (isUltra) {
      return {
        icon: Crown,
        label: "Ultra",
        gradient: "from-amber-500 to-orange-600",
        bgGradient: "bg-gradient-to-r from-amber-500 to-orange-600",
        tooltip: locale === "es" 
          ? "Miembro Ultra - Acceso completo a todas las funciones premium"
          : "Ultra Member - Full access to all premium features",
      }
    }
    if (isFan) {
      return {
        icon: Zap,
        label: "Fan",
        gradient: "from-blue-500 to-cyan-600",
        bgGradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
        tooltip: locale === "es"
          ? "Miembro Fan - Acceso a funciones de comunidad y favoritos"
          : "Fan Member - Access to community and favorites features",
      }
    }
    return null
  }

  const config = getBadgeConfig()
  if (!config) return null

  const Icon = config.icon

  const renderBadge = () => {
    switch (variant) {
      case "compact":
        return (
          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${config.bgGradient} text-white ${className}`}>
            <Icon className="w-3 h-3" />
          </span>
        )
      case "full":
        return (
          <Badge className={`${config.bgGradient} text-white border-0 gap-1 ${className}`}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
            <span className="opacity-75">
              {locale === "es" ? "Premium" : "Premium"}
            </span>
          </Badge>
        )
      default:
        return (
          <Badge className={`${config.bgGradient} text-white border-0 gap-1 ${className}`}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
          </Badge>
        )
    }
  }

  if (!showTooltip) {
    return renderBadge()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {renderBadge()}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Exclusive badges that can be earned
export interface UserBadge {
  id: string
  name: string
  nameEs: string
  description: string
  descriptionEs: string
  icon: typeof Crown
  color: string
  requirement: string
  requirementEs: string
  isPremiumOnly: boolean
}

export const AVAILABLE_BADGES: UserBadge[] = [
  {
    id: "early-adopter",
    name: "Early Adopter",
    nameEs: "Pionero",
    description: "Joined Soccer Maps in the early days",
    descriptionEs: "Se unio a Soccer Maps en los primeros dias",
    icon: Star,
    color: "from-purple-500 to-pink-600",
    requirement: "Join during beta period",
    requirementEs: "Unirse durante el periodo beta",
    isPremiumOnly: false,
  },
  {
    id: "stadium-explorer",
    name: "Stadium Explorer",
    nameEs: "Explorador de Estadios",
    description: "Visited 5 or more stadium pages",
    descriptionEs: "Visito 5 o mas paginas de estadios",
    icon: Shield,
    color: "from-green-500 to-emerald-600",
    requirement: "Visit 5+ stadium pages",
    requirementEs: "Visitar 5+ paginas de estadios",
    isPremiumOnly: false,
  },
  {
    id: "community-contributor",
    name: "Community Contributor",
    nameEs: "Colaborador de la Comunidad",
    description: "Made 10 or more posts in the community",
    descriptionEs: "Publico 10 o mas posts en la comunidad",
    icon: Award,
    color: "from-blue-500 to-indigo-600",
    requirement: "Make 10+ community posts",
    requirementEs: "Publicar 10+ posts en la comunidad",
    isPremiumOnly: true,
  },
  {
    id: "ultra-supporter",
    name: "Ultra Supporter",
    nameEs: "Ultra Supporter",
    description: "Premium Ultra subscriber for 3+ months",
    descriptionEs: "Suscriptor Ultra Premium por 3+ meses",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    requirement: "Subscribe to Ultra for 3 months",
    requirementEs: "Suscribirse a Ultra por 3 meses",
    isPremiumOnly: true,
  },
  {
    id: "fan-faithful",
    name: "Fan Faithful",
    nameEs: "Fan Fiel",
    description: "Premium Fan subscriber for 6+ months",
    descriptionEs: "Suscriptor Fan Premium por 6+ meses",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
    requirement: "Subscribe to Fan for 6 months",
    requirementEs: "Suscribirse a Fan por 6 meses",
    isPremiumOnly: true,
  },
]

interface BadgeDisplayProps {
  badges: string[]
  variant?: "default" | "compact"
  className?: string
}

export function BadgeDisplay({ badges, variant = "default", className = "" }: BadgeDisplayProps) {
  const { locale } = useI18nStore()

  const userBadges = AVAILABLE_BADGES.filter(badge => badges.includes(badge.id))

  if (userBadges.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {userBadges.map(badge => {
        const Icon = badge.icon
        return (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                {variant === "compact" ? (
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${badge.color} text-white cursor-help`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <Badge className={`bg-gradient-to-r ${badge.color} text-white border-0 gap-1 cursor-help`}>
                    <Icon className="w-3 h-3" />
                    <span>{locale === "es" ? badge.nameEs : badge.name}</span>
                  </Badge>
                )}
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold">{locale === "es" ? badge.nameEs : badge.name}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "es" ? badge.descriptionEs : badge.description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}
