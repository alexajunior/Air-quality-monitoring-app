import { getAllGhanaLocations, getGhanaRegions } from "./ghana-locations"

export const AVAILABLE_CITIES = getAllGhanaLocations()
export const AVAILABLE_REGIONS = getGhanaRegions()

// Backwards-compatibility: some components still expect AVAILABLE_COUNTRIES
export const AVAILABLE_COUNTRIES = AVAILABLE_REGIONS

/**
 * Return the AQI category, colors, description and health advice.
 */
export function getAQILevel(aqi: number): {
  level: string
  color: string
  description: string
  healthAdvice: string
  riskLevel: number
} {
  if (aqi <= 50)
    return {
      level: "Good",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      description: "Air quality is satisfactory",
      healthAdvice: "Enjoy outdoor activities",
      riskLevel: 1,
    }
  if (aqi <= 100)
    return {
      level: "Moderate",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      description: "Air quality is acceptable",
      healthAdvice: "Sensitive individuals should limit outdoor activities",
      riskLevel: 2,
    }
  if (aqi <= 150)
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "text-orange-600 bg-orange-50 border-orange-200",
      description: "Sensitive groups may experience health effects",
      healthAdvice: "Children, elderly, and people with respiratory conditions should limit outdoor activities",
      riskLevel: 3,
    }
  if (aqi <= 200)
    return {
      level: "Unhealthy",
      color: "text-red-600 bg-red-50 border-red-200",
      description: "Everyone may experience health effects",
      healthAdvice: "Avoid outdoor activities, especially strenuous exercise",
      riskLevel: 4,
    }
  if (aqi <= 300)
    return {
      level: "Very Unhealthy",
      color: "text-purple-600 bg-purple-50 border-purple-200",
      description: "Health alert: everyone may experience serious health effects",
      healthAdvice: "Stay indoors and avoid all outdoor activities",
      riskLevel: 5,
    }
  return {
    level: "Hazardous",
    color: "text-red-800 bg-red-100 border-red-300",
    description: "Emergency conditions: entire population affected",
    healthAdvice: "Stay indoors, keep windows closed, use air purifiers",
    riskLevel: 6,
  }
}

export interface ExposureData {
  date: string
  aqi: number
  duration: number // minutes
  location: string
  riskLevel: number
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  url: string
  publishedAt: string
  category: "health" | "environment" | "research" | "policy"
  imageUrl?: string
}

export interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  category: "health" | "environment" | "protection"
  lessons: number
  price: number
  imageUrl: string
  rating: number
  enrolled: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: "masks" | "purifiers" | "monitors" | "supplements"
  imageUrl: string
  rating: number
  reviews: number
  inStock: boolean
  features: string[]
}

export const HEALTH_STATS = {
  ghanaDeaths: "28,000",
  globalDeaths: "7M",
  estimatedDeaths: "1.1M",
  marketForecast: "$12.3B",
  targetUsers: "200+",
}
