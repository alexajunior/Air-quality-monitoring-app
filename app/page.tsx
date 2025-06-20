import { fetchAirQualityData, fetchHistoricalData, NoAirQualityData } from "@/lib/air-quality-api"
import { AirQualityDashboard } from "@/components/air-quality-dashboard"
import ErrorState from "@/components/error-state"

export const metadata = {
  title: "AeroHealth - Real-Time Air Quality Monitoring for Ghana",
  description:
    "Professional real-time air quality monitoring for Ghana. Track exposure, access health resources, and protect your health with live data from Accra, Kumasi, and all major cities.",
}

export default async function Page() {
  try {
    const [currentData, historicalData] = await Promise.all([
      fetchAirQualityData("Accra, Greater Accra"),
      fetchHistoricalData("Accra, Greater Accra", 7),
    ])

    return (
      <AirQualityDashboard
        initialData={currentData}
        initialHistoricalData={historicalData}
        initialCity="Accra, Greater Accra"
      />
    )
  } catch (err) {
    if (err instanceof NoAirQualityData) {
      return <ErrorState message="No air quality data available for Ghana locations. Please try again later." />
    }
    throw err
  }
}
