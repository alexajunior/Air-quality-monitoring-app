"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, MapPin, Activity, TrendingUp, AlertTriangle, Play, Square } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { getAQILevel } from "@/lib/air-quality-utils"
import { liveTracker, type LiveTrackingData } from "@/lib/live-tracking"
import { GhanaAirQualityMap } from "@/components/ghana-air-quality-map"
import { SubscriptionModal } from "@/components/subscription-modal"
import { getSubscriptionStatus } from "@/lib/mtn-momo-api"
import { toast } from "@/hooks/use-toast"

export default function ExposurePage() {
  const [trackingData, setTrackingData] = useState<LiveTrackingData>({
    currentLocation: "Accra, Greater Accra",
    currentAQI: 0,
    exposureStartTime: new Date(),
    totalExposureToday: 0,
    isTracking: false,
  })
  const [exposureLog, setExposureLog] = useState(liveTracker.getExposureLog())
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [subscription, setSubscription] = useState(getSubscriptionStatus())

  useEffect(() => {
    const handleTrackingUpdate = (data: LiveTrackingData) => {
      setTrackingData(data)
      setExposureLog(liveTracker.getExposureLog()) // Update log when tracking updates
    }

    liveTracker.addListener(handleTrackingUpdate)

    // Set initial state
    setTrackingData({
      currentLocation: "Accra, Greater Accra",
      currentAQI: 0,
      exposureStartTime: new Date(),
      totalExposureToday: liveTracker
        .getExposureLog()
        .filter((entry) => entry.date === new Date().toISOString().split("T")[0])
        .reduce((total, entry) => total + entry.duration, 0),
      isTracking: liveTracker.isTracking(),
    })

    return () => {
      liveTracker.removeListener(handleTrackingUpdate)
    }
  }, [])

  const handleStartTracking = async () => {
    try {
      await liveTracker.startTracking()
      toast({
        title: "Live Tracking Started",
        description: "Now tracking your air quality exposure based on your location.",
      })
    } catch (error) {
      toast({
        title: "Tracking Failed",
        description: "Unable to start location tracking. Please enable location permissions.",
        variant: "destructive",
      })
    }
  }

  const handleStopTracking = () => {
    liveTracker.stopTracking()
    toast({
      title: "Tracking Stopped",
      description: "Air quality exposure tracking has been stopped.",
    })
  }

  const handleSubscriptionSuccess = () => {
    setSubscription(getSubscriptionStatus())
    toast({
      title: "Subscription Active!",
      description: "You now have access to premium Ghana air quality maps.",
    })
  }

  const totalExposure = exposureLog.reduce((sum, day) => sum + day.duration, 0)
  const averageAQI =
    exposureLog.length > 0 ? exposureLog.reduce((sum, day) => sum + day.aqi, 0) / exposureLog.length : 0
  const highRiskDays = exposureLog.filter((day) => day.riskLevel >= 3).length
  const weeklyRisk = exposureLog.length > 0 ? (highRiskDays / exposureLog.length) * 100 : 0

  const chartData = exposureLog.slice(-7).map((day) => ({
    date: new Date(day.date).toLocaleDateString([], { month: "short", day: "numeric" }),
    aqi: day.aqi,
    duration: day.duration,
    risk: day.riskLevel,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              Live Air Exposure Tracking
            </h1>
            <p className="text-gray-600 mt-1">Real-time monitoring based on your phone's location settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={`${
                trackingData.isTracking
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {trackingData.isTracking ? "Live Tracking" : "Tracking Stopped"}
            </Badge>
            <Button
              onClick={trackingData.isTracking ? handleStopTracking : handleStartTracking}
              variant={trackingData.isTracking ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {trackingData.isTracking ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {trackingData.isTracking ? "Stop Tracking" : "Start Live Tracking"}
            </Button>
          </div>
        </div>

        {/* Live Tracking Status */}
        {trackingData.isTracking && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-emerald-800">Currently tracking at {trackingData.currentLocation}</p>
                    <p className="text-sm text-emerald-700">
                      Current AQI: {trackingData.currentAQI} • Tracking for{" "}
                      {Math.floor((Date.now() - trackingData.exposureStartTime.getTime()) / (1000 * 60))} minutes
                    </p>
                  </div>
                </div>
                <Badge className={`${getAQILevel(trackingData.currentAQI).color}`}>
                  {getAQILevel(trackingData.currentAQI).level}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Exposure (7 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totalExposure / 60)}h {totalExposure % 60}m
              </div>
              <p className="text-xs text-gray-500 mt-1">Outdoor exposure time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(trackingData.totalExposureToday / 60)}h {trackingData.totalExposureToday % 60}m
              </div>
              <p className="text-xs text-gray-500 mt-1">Live tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average AQI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageAQI)}</div>
              <Badge className={`${getAQILevel(averageAQI).color} text-xs mt-1`}>{getAQILevel(averageAQI).level}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Weekly Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(weeklyRisk)}%</div>
              <Progress value={weeklyRisk} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Ghana Air Quality Maps */}
        <GhanaAirQualityMap onSubscribeClick={() => setIsSubscriptionModalOpen(true)} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily AQI Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "aqi" ? `${value} AQI` : `${value} min`,
                        name === "aqi" ? "Air Quality" : "Duration",
                      ]}
                    />
                    <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Exposure Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`${value} minutes`, "Exposure Time"]} />
                    <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Recent Exposure Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Live Exposure Log
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Real-time Updates</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exposureLog.slice(0, 5).map((day, index) => {
                const aqiInfo = getAQILevel(day.aqi)
                const isToday = day.date === new Date().toISOString().split("T")[0]
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isToday ? "bg-emerald-50 border-emerald-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Calendar className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-medium">
                          {isToday
                            ? "Today"
                            : new Date(day.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{day.location}</span>
                          {isToday && trackingData.isTracking && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">Live</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor(day.duration / 60)}h {day.duration % 60}m exposure
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">{day.aqi}</div>
                      <Badge className={`${aqiInfo.color} text-xs`}>{aqiInfo.level}</Badge>
                      {day.riskLevel >= 3 && <AlertTriangle className="h-4 w-4 text-red-500 mt-1 mx-auto" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Health Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Health Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Live Location Tracking</h3>
                <p className="text-sm text-blue-800">
                  {trackingData.isTracking
                    ? `Currently monitoring air quality at ${trackingData.currentLocation}. Your exposure is being tracked automatically.`
                    : "Enable live tracking to get real-time exposure monitoring based on your location."}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Premium Maps</h3>
                <p className="text-sm text-green-800">
                  {subscription.isSubscribed
                    ? "You have access to premium Ghana air quality maps with real-time data."
                    : "Subscribe to unlock detailed air quality maps across all regions of Ghana."}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">Today's Exposure</h3>
                <p className="text-sm text-orange-800">
                  You've been exposed to air pollution for {Math.round(trackingData.totalExposureToday / 60)} hours
                  today.{" "}
                  {trackingData.totalExposureToday > 240
                    ? "Consider limiting outdoor activities."
                    : "Exposure is within safe limits."}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">MTN MoMo Subscription</h3>
                <p className="text-sm text-purple-800">
                  {subscription.isSubscribed
                    ? `Your ${subscription.plan} subscription expires on ${subscription.expiresAt?.toLocaleDateString()}.`
                    : "Subscribe with MTN Mobile Money to unlock premium features and detailed air quality maps."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
      />
    </div>
  )
}
