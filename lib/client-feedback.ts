"use client"

import { toast } from "@/hooks/use-toast"

type FeedbackOptions = {
  detail?: string
  showToast?: boolean
  context?: Record<string, unknown>
}

export function reportSuccess(step: string, options: FeedbackOptions = {}) {
  const { detail, showToast = true, context } = options

  console.info(`[SUCCESS] ${step}`, context || {})

  if (showToast) {
    toast({
      title: `✅ ${step}`,
      description: detail,
    })
  }
}

export function reportError(step: string, options: FeedbackOptions = {}) {
  const { detail, showToast = true, context } = options

  console.error(`[ERROR] ${step}`, context || {})

  if (showToast) {
    toast({
      title: `❌ ${step}`,
      description: detail || "Ha ocurrido un error inesperado",
      variant: "destructive",
    })
  }
}
