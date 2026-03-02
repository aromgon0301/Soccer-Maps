"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FanProfile } from "@/components/fan-profile"
import { useI18n } from "@/lib/i18n"

function ProfileContent() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader backHref="/" backLabel={t("back")} subtitle={t("myProfileTitle")} />
      <section className="py-6 sm:py-8 md:py-12 flex-1">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <FanProfile />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

export default function ProfilePage() {
  return <ProfileContent />
}
