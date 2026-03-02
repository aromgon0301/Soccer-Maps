"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="bg-muted mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-3 group w-fit">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
                <Image src="/logo-soccer-maps.png" alt="Soccer Maps Logo" fill className="object-contain rounded-lg" />
              </div>
              <h4 className="font-display font-bold group-hover:text-accent transition-colors text-sm sm:text-base">
                Soccer Maps
              </h4>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("footerDesc")}</p>
          </div>

          <div>
            <h5 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">{t("aboutUs")}</h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">{t("aboutSoccerMaps")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("contact")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("collaborations")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("press")}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">{t("help")}</h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">{t("faq")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("support")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("usageGuide")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("feedback")}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">{t("legal")}</h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">{t("terms")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("privacy")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("cookies")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("legalNotice")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground max-w-6xl mx-auto">
          <p>&copy; 2026 Soccer Maps - La Liga. {t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  )
}
