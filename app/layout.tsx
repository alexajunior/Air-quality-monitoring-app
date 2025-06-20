import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { LiveChat } from "@/components/live-chat"
import { Toaster } from "@/components/ui/toaster"
import { Wind } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AeroHealth - Real-Time Air Quality Monitoring for Ghana",
  description:
    "Professional real-time air quality monitoring for Ghana. Track exposure, access health resources, and protect your health with live data from Accra, Kumasi, and all major cities. Works offline too!",
  keywords:
    "air quality, health monitoring, air pollution, real-time data, health protection, AeroHealth, Ghana, offline",
  authors: [
    { name: "Adelaide Godwyll", url: "https://aerohealthapp.com" },
    { name: "Antwi Alex Junior", url: "https://aerohealthapp.com" },
    { name: "Emile Daunor", url: "https://aerohealthapp.com" },
  ],
  openGraph: {
    title: "AeroHealth - Real-Time Air Quality Monitoring",
    description: "Professional air quality monitoring solutions for better health outcomes in Ghana",
    url: "https://aerohealthapp.com",
    siteName: "AeroHealth",
    type: "website",
  },
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <LiveChat />
        <Toaster />
        <footer className="bg-teal-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Wind className="h-6 w-6 text-teal-300" />
                  <span className="text-xl font-bold">AeroHealth</span>
                </div>
                <p className="text-teal-100 text-sm">
                  Real-time air quality monitoring solutions crafted for individuals across communities seeking better
                  health. Works online and offline.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Team</h3>
                <div className="space-y-2 text-sm text-teal-100">
                  <div>Adelaide Godwyll - Project Lead</div>
                  <div>Antwi Alex Junior - Research Coordinator</div>
                  <div>Emile Daunor - Technical Developer</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Connect</h3>
                <div className="space-y-2 text-sm text-teal-100">
                  <div>www.aerohealthapp.com</div>
                  <div>Professional Customer Support</div>
                  <div>Live Chat Available 24/7</div>
                </div>
              </div>
            </div>
            <div className="border-t border-teal-800 mt-8 pt-4 text-center text-sm text-teal-200">
              © 2025 AeroHealth. Startup building real-time health monitoring applications.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
