"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { HistoricalData } from "@/lib/air-quality-api"

interface AirQualityChartProps {
  data: HistoricalData[]
}

export function AirQualityChart({ data }: AirQualityChartProps) {
  const chartData = data.slice(-24).map((item) => ({
    time: new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    aqi: item.aqi,
    pm25: item.pm25,
    pm10: item.pm10,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>24-Hour Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value: number, name: string) => [
                  `${value?.toFixed(1)} ${name === "aqi" ? "AQI" : "µg/m³"}`,
                  name === "aqi" ? "AQI" : name.toUpperCase(),
                ]}
              />
              <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pm10" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
