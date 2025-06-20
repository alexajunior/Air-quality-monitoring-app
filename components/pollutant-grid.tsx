"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PollutantReading } from "@/lib/air-quality-api"

interface PollutantGridProps {
  pollutants: PollutantReading[]
}

const POLLUTANT_INFO: Record<string, { name: string; limit: number; description: string }> = {
  pm25: { name: "PM2.5", limit: 35, description: "Fine particulate matter" },
  pm10: { name: "PM10", limit: 150, description: "Coarse particulate matter" },
  o3: { name: "Ozone", limit: 100, description: "Ground-level ozone" },
  no2: { name: "NO₂", limit: 100, description: "Nitrogen dioxide" },
  co: { name: "CO", limit: 10, description: "Carbon monoxide" },
}

export function PollutantGrid({ pollutants }: PollutantGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollutant Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pollutants.map((pollutant) => {
          const info = POLLUTANT_INFO[pollutant.parameter]
          if (!info || !pollutant.value) return null

          const percentage = Math.min((pollutant.value / info.limit) * 100, 100)
          const isHigh = percentage > 80

          return (
            <div key={pollutant.parameter} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{info.name}</div>
                  <div className="text-sm text-gray-500">{info.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {pollutant.value.toFixed(1)} {pollutant.unit}
                  </div>
                  <div className="text-sm text-gray-500">{percentage.toFixed(0)}% of limit</div>
                </div>
              </div>
              <Progress value={percentage} className={`h-2 ${isHigh ? "bg-red-100" : "bg-green-100"}`} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
