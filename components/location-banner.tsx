"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, X, Settings, Wifi, WifiOff } from "lucide-react"
import {
  getCurrentLocation,
  checkLocationPermission,
  saveLocationPreference,
  getLocationPreference,
  findNearestGhanaLocation,
  type UserLocation,
} from "@/lib/location-service"
import { isOnline } from "@/lib/offline-service"
import { toast } from "@/hooks/use-toast"

interface LocationBannerProps {
  onLocationChange?: (location: string) => void
}

export function LocationBanner({ onLocationChange }: LocationBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const [isOnlineStatus, setIsOnlineStatus] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const locationEnabled = getLocationPreference()
    setIsLocationEnabled(locationEnabled)
    setIsOnlineStatus(isOnline())

    // Check if we should show the location permission banner
    if (!locationEnabled) {
      checkLocationPermission().then((permission) => {
        if (permission.prompt || permission.granted) {
          setShowBanner(true)
        }
      })
    } else {
      // If location is enabled, try to get current location
      handleLocationUpdate()
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnlineStatus(true)
    const handleOffline = () => setIsOnlineStatus(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleLocationUpdate = async () => {
    setIsLoading(true)
    try {
      const userLocation: UserLocation = await getCurrentLocation()
      const nearestLocation = findNearestGhanaLocation(userLocation.latitude, userLocation.longitude)

      if (nearestLocation) {
        const locationString = `${nearestLocation.name}, ${nearestLocation.region}`
        setCurrentLocation(locationString)
        onLocationChange?.(locationString)
      } else {
        toast({
          title: "Location Not Found",
          description: "Unable to match your coordinates to a Ghana location. Using default (Accra).",
        })
      }
    } catch (error: any) {
      if (error?.code === 3 /* PositionError.TIMEOUT */) {
        toast({
          title: "Location Timeout",
          description: "We couldn’t get your location in time. Please ensure GPS is enabled and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Location Error",
          description: "Failed to get your location. You can still select a city manually.",
          variant: "destructive",
        })
      }
      console.error("Failed to get location:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnableLocation = async () => {
    setIsLoading(true)
    try {
      await handleLocationUpdate()
      saveLocationPreference(true)
      setIsLocationEnabled(true)
      setShowBanner(false)
    } catch (error) {
      console.error("Location access denied:", error)
      saveLocationPreference(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableLocation = () => {
    saveLocationPreference(false)
    setIsLocationEnabled(false)
    setCurrentLocation(null)
    onLocationChange?.("Accra, Greater Accra") // Default location
  }

  const handleDismiss = () => {
    setShowBanner(false)
    saveLocationPreference(false)
  }

  return (
    <div className="space-y-2">
      {/* Online/Offline Status */}
      <div className="flex justify-center">
        <Badge
          variant={isOnlineStatus ? "default" : "destructive"}
          className={`${
            isOnlineStatus
              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {isOnlineStatus ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
          {isOnlineStatus ? "Online - Live Data" : "Offline - Cached Data"}
        </Badge>
      </div>

      {/* Location Permission Banner */}
      {showBanner && (
        <Alert className="border-teal-200 bg-teal-50">
          <MapPin className="h-4 w-4 text-teal-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-teal-800">Enable location for personalized air quality data</span>
              <p className="text-sm text-teal-700 mt-1">
                Get real-time air quality information for your exact location in Ghana
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={handleEnableLocation}
                disabled={isLoading}
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isLoading ? "Getting Location..." : "Enable"}
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Location Display */}
      {isLocationEnabled && currentLocation && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-emerald-800">Showing data for your location</span>
              <p className="text-sm text-emerald-700 mt-1">{currentLocation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleLocationUpdate} disabled={isLoading} variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
                {isLoading ? "Updating..." : "Update"}
              </Button>
              <Button onClick={handleDisableLocation} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
