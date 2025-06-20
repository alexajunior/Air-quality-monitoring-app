"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Target, DollarSign, AlertTriangle, Globe } from "lucide-react"
import { HEALTH_STATS } from "@/lib/air-quality-utils"

export function HealthImpactStats() {
  const stats = [
    {
      title: "Ghana Deaths Annually",
      value: HEALTH_STATS.ghanaDeaths,
      subtitle: "premature deaths",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50 border-red-200",
      trend: "critical",
    },
    {
      title: "Global Impact",
      value: HEALTH_STATS.globalDeaths,
      subtitle: "die prematurely each year",
      icon: Globe,
      color: "text-orange-600 bg-orange-50 border-orange-200",
      trend: "urgent",
    },
    {
      title: "Estimated Deaths",
      value: HEALTH_STATS.estimatedDeaths,
      subtitle: "annually worldwide",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      trend: "rising",
    },
    {
      title: "Market Forecast",
      value: HEALTH_STATS.marketForecast,
      subtitle: "solutions by 2034",
      icon: DollarSign,
      color: "text-teal-600 bg-teal-50 border-teal-200",
      trend: "growth",
    },
  ]

  return (
    <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <Target className="h-5 w-5" />
          Global Health Impact
          <Badge className="bg-teal-100 text-teal-700 border-teal-300">Real-Time Insights</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg border ${stat.color}`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5" />
                <Badge variant="outline" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.subtitle}</div>
              <div className="text-xs font-medium mt-1">{stat.title}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <Users className="h-4 w-4" />
            <span className="font-medium">{HEALTH_STATS.targetUsers} targeted users</span>
            <span className="text-teal-600">joined in first week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
