"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Newspaper, GraduationCap, ShoppingCart, Heart, Zap } from "lucide-react"
import { getAQILevel } from "@/lib/air-quality-utils"

interface QuickActionsProps {
  currentAQI: number
}

export function QuickActions({ currentAQI }: QuickActionsProps) {
  const aqiInfo = getAQILevel(currentAQI)

  const actions = [
    {
      title: "Track Air Exposure",
      description: "Monitor your daily air quality exposure",
      icon: Activity,
      href: "/exposure",
      color: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
      urgent: false,
    },
    {
      title: "Health Resources",
      description: "Latest news and health recommendations",
      icon: Newspaper,
      href: "/news",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      urgent: aqiInfo.riskLevel >= 3,
    },
    {
      title: "Learn Protection",
      description: "Personalized courses on air quality",
      icon: GraduationCap,
      href: "/courses",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
      urgent: false,
    },
    {
      title: "Protection Gear",
      description: "Shop masks, purifiers, and monitors",
      icon: ShoppingCart,
      href: "/shop",
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      urgent: aqiInfo.riskLevel >= 4,
    },
  ]

  return (
    <Card className="border-teal-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <Zap className="h-5 w-5" />
          Quick Actions
          {aqiInfo.riskLevel >= 3 && (
            <Badge className="bg-red-100 text-red-700 border-red-300 animate-pulse">High Risk Alert</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div
                className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${action.color} ${
                  action.urgent ? "ring-2 ring-red-200 shadow-md" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <action.icon className="h-5 w-5" />
                  {action.urgent && <Heart className="h-4 w-4 text-red-500 animate-pulse" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-xs opacity-80">{action.description}</p>
                {action.urgent && (
                  <Badge className="bg-red-100 text-red-700 border-red-300 text-xs mt-2">Recommended Now</Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
