"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { StadiumComparator } from "@/components/stadium-comparator"
import { useI18n } from "@/lib/i18n"

function ComparatorContent() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader backHref="/" backLabel={t("back")} subtitle={t("comparator")} />
      <section className="py-6 sm:py-8 md:py-12 flex-1">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <StadiumComparator />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

export default function ComparatorPage() {
  return <ComparatorContent />
}
