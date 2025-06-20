import { type NextRequest, NextResponse } from "next/server"
import { fetchAirQualityData, fetchHistoricalData, NoAirQualityData } from "@/lib/air-quality-api"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "Los Angeles"

  try {
    const [current, historical] = await Promise.all([fetchAirQualityData(city), fetchHistoricalData(city, 7)])

    return NextResponse.json({ current, historical })
  } catch (error) {
    if (error instanceof NoAirQualityData) {
      return NextResponse.json({ error: "No air quality data available" }, { status: 404 })
    }

    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
