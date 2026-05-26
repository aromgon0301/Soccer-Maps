"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18nStore } from "@/lib/stores"

export function SiteFooter() {
  const { t } = useI18nStore()

  return (
    <footer className="bg-primary mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image 
                src="/logo-soccer-maps.png" 
                alt="Soccer Maps Logo" 
                fill 
                className="object-contain rounded-lg" 
              />
            </div>
            <span className="font-display font-bold text-xl text-primary-foreground group-hover:text-accent transition-colors">
              Soccer Maps
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground/60 text-sm">La Liga</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
