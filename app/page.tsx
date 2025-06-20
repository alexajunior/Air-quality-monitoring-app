"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Wind,
  Eye,
  Droplets,
  Thermometer,
  RefreshCw,
  AlertTriangle,
  Heart,
  BookOpen,
  ShoppingCart,
  Users,
  Shield,
  Star,
  Play,
  Clock,
  Loader2,
  Navigation,
  Wifi,
  WifiOff,
  Crown,
  X,
  Bell,
} from "lucide-react"
import { fetchAirQualityData, getCurrentLocation, reverseGeocode, type AirQualityData } from "@/lib/air-quality-api"
import { SubscriptionModal } from "@/components/subscription-modal"
import { AlertsPanel } from "@/components/alerts-panel"
import {
  requestNotificationPermission,
  registerServiceWorker,
  checkAQIAlerts,
  sendDailyReport,
} from "@/lib/notifications"
import { getActiveSubscription as getSubscription } from "@/lib/mtn-api"
import { HealthInsights } from "@/components/health-insights"

// Mock data for air quality metrics
const healthTips = [
  {
    title: "Indoor Air Purification",
    description: "Use HEPA air purifiers and keep windows closed during high pollution days",
    icon: Shield,
    category: "Protection",
  },
  {
    title: "Breathing Exercises",
    description: "Practice deep breathing techniques to strengthen your respiratory system",
    icon: Heart,
    category: "Wellness",
  },
  {
    title: "Mask Selection Guide",
    description: "Choose N95 or P100 masks for effective protection against PM2.5 particles",
    icon: Shield,
    category: "Protection",
  },
  {
    title: "Exercise Timing",
    description: "Schedule outdoor activities during early morning when air quality is typically better",
    icon: Clock,
    category: "Lifestyle",
  },
]

const courses = [
  {
    title: "Air Quality Fundamentals",
    description: "Understanding pollutants, health impacts, and protection strategies",
    duration: "2 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    price: "Free",
  },
  {
    title: "Indoor Air Quality Management",
    description: "Create healthier indoor environments for your family",
    duration: "3 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 890,
    price: "$29",
  },
  {
    title: "Environmental Health Advocacy",
    description: "Become a community leader in environmental health awareness",
    duration: "5 hours",
    level: "Advanced",
    rating: 4.7,
    students: 456,
    price: "$49",
  },
]

const products = [
  {
    name: "HEPA Air Purifier Pro",
    price: "$299",
    rating: 4.8,
    reviews: 2341,
    image: "/placeholder.svg?height=200&width=200",
    category: "Air Purification",
  },
  {
    name: "N95 Respirator Masks (50-pack)",
    price: "$45",
    rating: 4.6,
    reviews: 1876,
    image: "/placeholder.svg?height=200&width=200",
    category: "Personal Protection",
  },
  {
    name: "Indoor Air Quality Monitor",
    price: "$149",
    rating: 4.7,
    reviews: 934,
    image: "/placeholder.svg?height=200&width=200",
    category: "Monitoring",
  },
  {
    name: "Plant-Based Air Purifier Kit",
    price: "$79",
    rating: 4.5,
    reviews: 567,
    image: "/placeholder.svg?height=200&width=200",
    category: "Natural Solutions",
  },
]

const newsArticles = [
  {
    title: "New Study Links Air Pollution to Cognitive Decline",
    source: "Environmental Health Journal",
    time: "2 hours ago",
    category: "Research",
  },
  {
    title: "City Implements New Clean Air Initiative",
    source: "Local News Network",
    time: "5 hours ago",
    category: "Policy",
  },
  {
    title: "Wildfire Season: Protecting Your Family's Health",
    source: "Health & Wellness Today",
    time: "1 day ago",
    category: "Safety",
  },
]

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { level: "Good", color: "bg-green-500", textColor: "text-green-700" }
  if (aqi <= 100) return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-700" }
  if (aqi <= 150)
    return { level: "Unhealthy for Sensitive Groups", color: "bg-orange-500", textColor: "text-orange-700" }
  if (aqi <= 200) return { level: "Unhealthy", color: "bg-red-500", textColor: "text-red-700" }
  if (aqi <= 300) return { level: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-700" }
  return { level: "Hazardous", color: "bg-red-800", textColor: "text-red-900" }
}

export default function AeroHealth() {
  const [data, setData] = useState<AirQualityData | null>(null)
  const [location, setLocation] = useState("San Francisco, CA")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [activeSubscription, setActiveSubscription] = useState(getSubscription())
  const [showAlerts, setShowAlerts] = useState(false)

  const loadAirQualityData = async (locationName: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const airQualityData = await fetchAirQualityData(locationName)
      if (airQualityData) {
        setData(airQualityData)
        setLocation(airQualityData.current.location)
      } else {
        setError("Unable to fetch air quality data. Please check the location name and try again.")
      }
    } catch (err) {
      setError("Failed to load air quality data. Please try again later.")
      console.error("Air quality data error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      loadAirQualityData(location.trim())
    }
  }

  const handleUseCurrentLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const position = await getCurrentLocation()
      const { latitude, longitude } = position.coords
      const locationName = await reverseGeocode(latitude, longitude)
      setLocation(locationName)
      await loadAirQualityData(locationName)
    } catch (err) {
      setError("Unable to get your current location. Please enter a location manually.")
      console.error("Geolocation error:", err)
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    if (data?.current.location) {
      loadAirQualityData(data.current.location)
    }
  }

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load initial data
  useEffect(() => {
    loadAirQualityData("San Francisco, CA")
  }, [])

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!data) return

    const interval = setInterval(() => {
      if (isOnline && data.current.location) {
        loadAirQualityData(data.current.location)
      }
    }, 600000) // 10 minutes

    return () => clearInterval(interval)
  }, [data, isOnline])

  // Setup notifications
  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermission()
      await registerServiceWorker()
    }
    setupNotifications()

    // Listen for subscription activation
    const handleSubscriptionActivated = () => {
      setActiveSubscription(getSubscription())
    }

    window.addEventListener("subscriptionActivated", handleSubscriptionActivated)
    return () => window.removeEventListener("subscriptionActivated", handleSubscriptionActivated)
  }, [])

  // Check for AQI alerts when data changes
  useEffect(() => {
    if (data) {
      checkAQIAlerts(data.current.aqi, data.current.location)

      // Send daily report at 8 AM
      const now = new Date()
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        sendDailyReport(data)
      }
    }
  }, [data])

  const aqiInfo = data ? getAQILevel(data.current.aqi) : getAQILevel(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wind className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AeroHealth
                  </h1>
                  {activeSubscription.active && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      {activeSubscription.subscription?.planName} Active
                    </Badge>
                  )}
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Empowering healthier lives through air quality awareness</p>
              </div>
            </div>
            <form onSubmit={handleLocationSubmit} className="flex gap-2">
              <Input
                placeholder="Enter location (e.g., New York, NY)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-64"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !isOnline}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleUseCurrentLocation}
                disabled={isLoading || !isOnline}
                title="Use current location"
              >
                <Navigation className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAlerts(!showAlerts)} className="relative">
                <Bell className="h-4 w-4" />
              </Button>
              {!activeSubscription.active && (
                <Button
                  type="button"
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Upgrade
                </Button>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && !data && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading air quality data...</p>
          </CardContent>
        </Card>
      )}

      {/* Offline Notice */}
      {!isOnline && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            You're currently offline. Data may not be up to date.
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          {/* Mission Statement */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">To prevent more stories like Ama's</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Real-time air quality monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Health tips & resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Educational courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Protective products</span>
                    {activeSubscription.active && (
                      <Badge className="bg-yellow-400 text-yellow-800 text-xs">Premium</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="monitor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="health">Health Tips</TabsTrigger>
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Air Quality Monitor Tab */}
            <TabsContent value="monitor" className="space-y-6">
              {/* Current Conditions */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <CardTitle>{data.current.location}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Last updated: {data.current.lastUpdated}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* AQI Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                      <Card className="h-full">
                        <CardContent className="p-6 text-center">
                          <div className="space-y-2">
                            <div
                              className={`w-20 h-20 rounded-full ${aqiInfo.color} mx-auto flex items-center justify-center`}
                            >
                              <span className="text-2xl font-bold text-white">{data.current.aqi}</span>
                            </div>
                            <h3 className="font-semibold text-lg">Air Quality Index</h3>
                            <Badge className={`${aqiInfo.color} text-white`}>{aqiInfo.level}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pollutants */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{data.current.pm25}</div>
                            <div className="text-sm text-gray-600">PM2.5 (μg/m³)</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{data.current.pm10}</div>
                            <div className="text-sm text-gray-600">PM10 (μg/m³)</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{data.current.o3}</div>
                            <div className="text-sm text-gray-600">O₃ (μg/m³)</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{data.current.no2}</div>
                            <div className="text-sm text-gray-600">NO₂ (μg/m³)</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{data.current.so2}</div>
                            <div className="text-sm text-gray-600">SO₂ (μg/m³)</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-600">{data.current.co}</div>
                            <div className="text-sm text-gray-600">CO (μg/m³)</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Thermometer className="h-8 w-8 text-red-500" />
                    <div>
                      <div className="text-2xl font-bold">{data.current.temperature}°C</div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Droplets className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{data.current.humidity}%</div>
                      <div className="text-sm text-gray-600">Humidity</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Wind className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{data.current.windSpeed} km/h</div>
                      <div className="text-sm text-gray-600">Wind Speed</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Eye className="h-8 w-8 text-gray-500" />
                    <div>
                      <div className="text-2xl font-bold">{data.current.visibility} km</div>
                      <div className="text-sm text-gray-600">Visibility</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>24-Hour Forecast</CardTitle>
                    <CardDescription>Hourly AQI trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        aqi: {
                          label: "AQI",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.hourly}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="aqi" stroke="var(--color-aqi)" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>7-Day Trend</CardTitle>
                    <CardDescription>Weekly air quality overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        aqi: {
                          label: "AQI",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.weekly}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="aqi"
                            stroke="var(--color-aqi)"
                            fill="var(--color-aqi)"
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Health Alert */}
              {data.current.aqi > 100 && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-orange-800">Health Advisory</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-orange-700">
                      <p>• Consider reducing outdoor activities, especially for sensitive individuals</p>
                      <p>• Keep windows closed and use air purifiers if available</p>
                      <p>• Wear a mask when going outside</p>
                      <p>• Stay hydrated and monitor any respiratory symptoms</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <HealthInsights airQualityData={data} />
            </TabsContent>

            {/* Health Tips Tab */}
            <TabsContent value="health" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthTips.map((tip, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <tip.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{tip.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {tip.category}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Learn Tab */}
            <TabsContent value="learn" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                          <p className="text-gray-600 text-sm">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{course.rating}</span>
                            </div>
                            <Badge variant="outline">{course.level}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{course.price}</div>
                            <Button size="sm" className="mt-2">
                              <Play className="h-4 w-4 mr-1" />
                              Start Course
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Shop Tab */}
            <TabsContent value="shop" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-2">
                            {product.category}
                          </Badge>
                          <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{product.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">{product.price}</span>
                            <Button size="sm">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-6">
              <div className="space-y-4">
                {newsArticles.map((article, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{article.time}</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                          <p className="text-sm text-gray-600">{article.source}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <AlertsPanel />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />

      {/* Alerts Panel Overlay */}
      {showAlerts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Alerts</h2>
                <Button variant="ghost" onClick={() => setShowAlerts(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AlertsPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
