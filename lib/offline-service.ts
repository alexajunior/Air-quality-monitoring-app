"use client"

export interface CachedData {
  airQuality: any
  historical: any[]
  timestamp: number
  location: string
}

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes
const CACHE_KEY = "aerohealth-cached-data"

export function cacheAirQualityData(data: any, historical: any[], location: string): void {
  if (typeof window === "undefined") return

  const cachedData: CachedData = {
    airQuality: data,
    historical,
    timestamp: Date.now(),
    location,
  }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData))
  } catch (error) {
    console.error("Failed to cache data:", error)
  }
}

export function getCachedAirQualityData(location: string): CachedData | null {
  if (typeof window === "undefined") return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data: CachedData = JSON.parse(cached)

    // Check if cache is still valid and for the same location
    if (Date.now() - data.timestamp < CACHE_DURATION && data.location === location) {
      return data
    }
  } catch (error) {
    console.error("Failed to retrieve cached data:", error)
  }

  return null
}

export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true
}

export function setupOfflineHandlers(): void {
  if (typeof window === "undefined") return

  window.addEventListener("online", () => {
    console.log("Connection restored")
    // Trigger data refresh when back online
    window.dispatchEvent(new CustomEvent("connection-restored"))
  })

  window.addEventListener("offline", () => {
    console.log("Connection lost - switching to offline mode")
    window.dispatchEvent(new CustomEvent("connection-lost"))
  })
}

// Service Worker registration for offline support
export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", registration)
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  })
}
