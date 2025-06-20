export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
}

export async function getCurrentLocation(retry = false): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      async (error) => {
        // If the first call times-out, immediately retry once with a longer timeout
        if (error.code === error.TIMEOUT && !retry) {
          try {
            const pos = await getCurrentLocation(true) // second attempt
            resolve(pos)
            return
          } catch (e) {
            /* fall through to final reject below */
          }
        }
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: retry ? 30000 : 10000, // extend to 30 s on second attempt
        maximumAge: 300000,
      },
    )
  })
}

/* ---------- Permission Helpers ---------- */
export async function checkLocationPermission(): Promise<{
  granted: boolean
  denied: boolean
  prompt: boolean
}> {
  if (!navigator.permissions) {
    return { granted: false, denied: false, prompt: true }
  }

  try {
    const permission = await navigator.permissions.query({ name: "geolocation" })
    return {
      granted: permission.state === "granted",
      denied: permission.state === "denied",
      prompt: permission.state === "prompt",
    }
  } catch {
    return { granted: false, denied: false, prompt: true }
  }
}

/* ---------- Local-Storage Helpers ---------- */
const LOCATION_PREF_KEY = "aerohealth-location-enabled"

export function saveLocationPreference(enabled: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCATION_PREF_KEY, JSON.stringify(enabled))
  }
}

export function getLocationPreference(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem(LOCATION_PREF_KEY)
    return stored ? JSON.parse(stored) : false
  } catch {
    return false
  }
}

/* ---------- Ghana Nearest-City Helper ---------- */

// Haversine distance (km)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

import { GHANA_LOCATIONS, type GhanaLocation } from "./ghana-locations"

/**
 * Given user coordinates, return the nearest Ghana location
 * (only if within 100 km – otherwise returns null).
 */
export function findNearestGhanaLocation(userLat: number, userLon: number): GhanaLocation | null {
  let closest: GhanaLocation | null = null
  let min = Number.POSITIVE_INFINITY

  for (const loc of GHANA_LOCATIONS) {
    const d = haversine(userLat, userLon, loc.lat, loc.lon)
    if (d < min) {
      min = d
      closest = loc
    }
  }

  return min <= 100 ? closest : null
}
