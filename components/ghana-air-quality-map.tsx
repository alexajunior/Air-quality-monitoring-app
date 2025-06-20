"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, Crown, Lock } from "lucide-react"
import { GHANA_LOCATIONS } from "@/lib/ghana-locations"
import { getAQILevel } from "@/lib/air-quality-utils"
import { getSubscriptionStatus } from "@/lib/mtn-momo-api"

interface MapLocation {
  name: string
  region: string
  lat: number
  lon: number
  aqi: number
}

interface GhanaAirQualityMapProps {
  onSubscribeClick: () => void
}

export function GhanaAirQualityMap({ onSubscribeClick }: GhanaAirQualityMapProps) {
  const [mapData, setMapData] = useState<MapLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const subscription = getSubscriptionStatus()

  useEffect(() => {
    loadMapData()
  }, [])

  const loadMapData = async () => {
    setIsLoading(true)
    try {
      // Simulate loading air quality data for all Ghana locations
      const data: MapLocation[] = GHANA_LOCATIONS.map((location) => ({
        name: location.name,
        region: location.region,
        lat: location.lat,
        lon: location.lon,
        aqi: Math.floor(Math.random() * 200) + 20, // Mock AQI data
      }))

      setMapData(data)
    } catch (error) {
      console.error("Error loading map data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLocationColor = (aqi: number): string => {
    const aqiInfo = getAQILevel(aqi)
    if (aqi <= 50) return "#10b981" // Green
    if (aqi <= 100) return "#f59e0b" // Yellow
    if (aqi <= 150) return "#f97316" // Orange
    if (aqi <= 200) return "#ef4444" // Red
    return "#8b5cf6" // Purple
  }

  const getMapResolution = (): string => {
    if (!subscription.isSubscribed) return "Low Resolution"
    if (subscription.plan === "basic") return "Standard Resolution"
    if (subscription.plan === "premium") return "High Resolution"
    return "Ultra-High Resolution"
  }

  if (!subscription.isSubscribed) {
    return (
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-800">
            <MapPin className="h-5 w-5" />
            Ghana Air Quality Maps
            <Badge className="bg-orange-100 text-orange-700 border-orange-300">
              <Lock className="h-3 w-3 mr-1" />
              Subscription Required
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Ghana Air Quality Maps</h3>
            <p className="text-gray-600 mb-4">
              Get access to real-time air quality maps across all regions of Ghana with detailed pollution overlays.
            </p>
            <Button onClick={onSubscribeClick} className="bg-teal-600 hover:bg-teal-700">
              <Crown className="h-4 w-4 mr-2" />
              Subscribe with MTN MoMo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-teal-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <MapPin className="h-5 w-5" />
          Ghana Air Quality Maps
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
            <Crown className="h-3 w-3 mr-1" />
            {getMapResolution()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Container */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "400px" }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading map data...</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100">
                {/* Ghana outline simulation */}
                <div className="absolute inset-4 border-2 border-gray-400 rounded-lg bg-white/50">
                  {/* Location markers */}
                  {mapData.map((location, index) => {
                    const x = ((location.lon + 3.5) / 4) * 100 // Normalize longitude
                    const y = ((11 - location.lat) / 6) * 100 // Normalize latitude (inverted)

                    return (
                      <div
                        key={index}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${Math.max(5, Math.min(95, x))}%`,
                          top: `${Math.max(5, Math.min(95, y))}%`,
                        }}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                          style={{ backgroundColor: getLocationColor(location.aqi) }}
                        />
                        {subscription.plan !== "basic" && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                            {location.name}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
                  <h4 className="text-xs font-semibold mb-2">Air Quality Index</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Good (0-50)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">Moderate (51-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-xs">Unhealthy (101-150)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs">Very Unhealthy (151+)</span>
                    </div>
                  </div>
                </div>

                {/* Subscription badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                    <Zap className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-teal-900">
                  {selectedLocation.name}, {selectedLocation.region}
                </h3>
                <Badge className={`${getAQILevel(selectedLocation.aqi).color}`}>AQI {selectedLocation.aqi}</Badge>
              </div>
              <p className="text-sm text-teal-800">{getAQILevel(selectedLocation.aqi).description}</p>
              <p className="text-xs text-teal-700 mt-1">{getAQILevel(selectedLocation.aqi).healthAdvice}</p>
            </div>
          )}

          {/* Map Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {mapData.length} locations • Updated every 15 minutes</div>
            <Button onClick={loadMapData} disabled={isLoading} variant="outline" size="sm">
              Refresh Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
