import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AirQualityReading } from "@/lib/air-quality-api"

export function AirQualityCard({ data }: { data: AirQualityReading }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{"Current Air Quality"}</CardTitle>
        <p className="text-sm text-muted-foreground">Source:&nbsp;{data.source}</p>
      </CardHeader>
      <CardContent className="text-5xl font-semibold flex items-end gap-2">
        {data.aqi ?? "--"}
        <span className="text-lg font-medium">{data.unit}</span>
      </CardContent>
    </Card>
  )
}
