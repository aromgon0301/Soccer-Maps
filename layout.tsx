import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/lib/theme"
import { I18nProvider } from "@/lib/i18n"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Soccer Maps - La Liga | Stadium & City Guide",
  description: "Explore La Liga stadiums with interactive maps, team information, and match day guides",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <I18nProvider>
            {children}
            <Toaster />
            <Analytics />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
