"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, MapPin, Clock, Thermometer, Wind, Eye, AlertTriangle, Globe } from "lucide-react"
import type { AirQualityReading, HistoricalData } from "@/lib/air-quality-api"
import { getAQILevel, AVAILABLE_CITIES, AVAILABLE_REGIONS } from "@/lib/air-quality-utils"
import { AirQualityChart } from "./air-quality-chart"
import { PollutantGrid } from "./pollutant-grid"
import { QuickActions } from "./quick-actions"
import { HealthImpactStats } from "./health-impact-stats"
import { LocationBanner } from "./location-banner"
import { cacheAirQualityData, getCachedAirQualityData, isOnline, setupOfflineHandlers } from "@/lib/offline-service"

interface AirQualityDashboardProps {
  initialData: AirQualityReading
  initialHistoricalData: HistoricalData[]
  initialCity: string
}

export function AirQualityDashboard({ initialData, initialHistoricalData, initialCity }: AirQualityDashboardProps) {
  const [data, setData] = useState<AirQualityReading>(initialData)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>(initialHistoricalData)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isOnlineStatus, setIsOnlineStatus] = useState(true)
  const [usingCachedData, setUsingCachedData] = useState(false)

  const aqiInfo = getAQILevel(data.aqi || 0)
  const filteredCities = selectedRegion
    ? AVAILABLE_CITIES.filter((city) => city.includes(selectedRegion))
    : AVAILABLE_CITIES

  useEffect(() => {
    setIsOnlineStatus(isOnline())
    setupOfflineHandlers()

    // Listen for connection changes
    const handleConnectionRestored = () => {
      setIsOnlineStatus(true)
      refreshData() // Refresh data when back online
    }

    const handleConnectionLost = () => {
      setIsOnlineStatus(false)
    }

    window.addEventListener("connection-restored", handleConnectionRestored)
    window.addEventListener("connection-lost", handleConnectionLost)

    return () => {
      window.removeEventListener("connection-restored", handleConnectionRestored)
      window.removeEventListener("connection-lost", handleConnectionLost)
    }
  }, [])

  useEffect(() => {
    // Cache initial data
    cacheAirQualityData(initialData, initialHistoricalData, initialCity)
  }, [initialData, initialHistoricalData, initialCity])

  const refreshData = async () => {
    setIsLoading(true)
    setUsingCachedData(false)

    try {
      if (!isOnlineStatus) {
        // Try to use cached data when offline
        const cached = getCachedAirQualityData(selectedCity)
        if (cached) {
          setData(cached.airQuality)
          setHistoricalData(cached.historical)
          setUsingCachedData(true)
          setLastUpdated(new Date(cached.timestamp))
        }
        return
      }

      const response = await fetch(`/api/air-quality?city=${encodeURIComponent(selectedCity)}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.current)
        setHistoricalData(result.historical)
        setLastUpdated(new Date())

        // Cache the new data
        cacheAirQualityData(result.current, result.historical, selectedCity)
      } else {
        throw new Error("Failed to fetch data")
      }
    } catch (error) {
      console.error("Failed to refresh data:", error)

      // Fallback to cached data
      const cached = getCachedAirQualityData(selectedCity)
      if (cached) {
        setData(cached.airQuality)
        setHistoricalData(cached.historical)
        setUsingCachedData(true)
        setLastUpdated(new Date(cached.timestamp))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCityChange = async (city: string) => {
    setSelectedCity(city)
    setIsLoading(true)
    setUsingCachedData(false)

    try {
      if (!isOnlineStatus) {
        // Try cached data first when offline
        const cached = getCachedAirQualityData(city)
        if (cached) {
          setData(cached.airQuality)
          setHistoricalData(cached.historical)
          setUsingCachedData(true)
          setLastUpdated(new Date(cached.timestamp))
          return
        }
      }

      const response = await fetch(`/api/air-quality?city=${encodeURIComponent(city)}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.current)
        setHistoricalData(result.historical)
        setLastUpdated(new Date())

        // Cache the new data
        cacheAirQualityData(result.current, result.historical, city)
      }
    } catch (error) {
      console.error("Failed to load city data:", error)

      // Fallback to cached data
      const cached = getCachedAirQualityData(city)
      if (cached) {
        setData(cached.airQuality)
        setHistoricalData(cached.historical)
        setUsingCachedData(true)
        setLastUpdated(new Date(cached.timestamp))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationChange = (location: string) => {
    handleCityChange(location)
  }

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (isOnlineStatus) {
          refreshData()
        }
      },
      15 * 60 * 1000,
    ) // Refresh every 15 minutes when online

    return () => clearInterval(interval)
  }, [selectedCity, isOnlineStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Location Banner */}
        <LocationBanner onLocationChange={handleLocationChange} />

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Globe className="h-8 w-8 text-teal-600" />
              </div>
              Real-Time Air Quality Monitoring
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString()} •
              <span className={`font-medium ${isOnlineStatus ? "text-teal-600" : "text-orange-600"}`}>
                {usingCachedData ? "Cached Data" : isOnlineStatus ? "Live Data" : "Offline Mode"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {AVAILABLE_REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger className="w-64 border-teal-200 focus:border-teal-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={refreshData}
              disabled={isLoading}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Health Impact Stats */}
        <HealthImpactStats />

        {/* Main AQI Card */}
        <Card className="relative overflow-hidden border-teal-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-xl text-gray-900">
                  {data.city}, {data.country}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                  {data.source}
                </Badge>
                {usingCachedData && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                    Cached
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">{data.aqi || "--"}</div>
                <Badge className={`${aqiInfo.color} text-sm px-3 py-1 mb-4`}>{aqiInfo.level}</Badge>
                <p className="text-gray-600 mb-2">{aqiInfo.description}</p>
                <div
                  className={`p-4 rounded-lg border ${aqiInfo.color.replace("text-", "border-").replace("bg-", "bg-")}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Health Advice</span>
                  </div>
                  <p className="text-sm">{aqiInfo.healthAdvice}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Current Conditions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border border-teal-100">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <div className="text-sm text-gray-600">PM2.5</div>
                    <div className="font-semibold">
                      {data.pollutants.find((p) => p.parameter === "pm25")?.value?.toFixed(1) || "--"} µg/m³
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-teal-100">
                    <Wind className="h-6 w-6 mx-auto mb-2 text-teal-500" />
                    <div className="text-sm text-gray-600">PM10</div>
                    <div className="font-semibold">
                      {data.pollutants.find((p) => p.parameter === "pm10")?.value?.toFixed(1) || "--"} µg/m³
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-teal-100">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                    <div className="text-sm text-gray-600">O₃</div>
                    <div className="font-semibold">
                      {data.pollutants.find((p) => p.parameter === "o3")?.value?.toFixed(1) || "--"} µg/m³
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-teal-100">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-sm text-gray-600">NO₂</div>
                    <div className="font-semibold">
                      {data.pollutants.find((p) => p.parameter === "no2")?.value?.toFixed(1) || "--"} µg/m³
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions currentAQI={data.aqi || 0} />

        {/* Charts and Details */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AirQualityChart data={historicalData} />
          </div>
          <div>
            <PollutantGrid pollutants={data.pollutants} />
          </div>
        </div>
      </div>
    </div>
  )
}
