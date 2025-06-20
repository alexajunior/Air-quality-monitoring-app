"use client"

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
}

export interface NotificationSettings {
  airQualityAlerts: boolean
  healthRecommendations: boolean
  courseUpdates: boolean
  productDeals: boolean
  weeklyReports: boolean
}

export interface UserSettings {
  profile: UserProfile
  notifications: NotificationSettings
  twoFactorEnabled: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    firstName: "Adelaide",
    lastName: "Godwyll",
    email: "adelaide@aerohealthapp.com",
    phone: "+233 24 123 4567",
    location: "Accra, Greater Accra",
  },
  notifications: {
    airQualityAlerts: true,
    healthRecommendations: true,
    courseUpdates: false,
    productDeals: true,
    weeklyReports: true,
  },
  twoFactorEnabled: false,
}

export function getUserSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem("aerohealth-settings")
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("Error loading user settings:", error)
  }

  return DEFAULT_SETTINGS
}

export function saveUserSettings(settings: Partial<UserSettings>): void {
  if (typeof window === "undefined") return

  try {
    const current = getUserSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem("aerohealth-settings", JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving user settings:", error)
  }
}

export function exportUserData(): string {
  const settings = getUserSettings()
  const exportData = {
    profile: settings.profile,
    notifications: settings.notifications,
    exportDate: new Date().toISOString(),
    version: "1.0",
  }

  return JSON.stringify(exportData, null, 2)
}

export function deleteUserData(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("aerohealth-settings")
    // Clear any other user data
    localStorage.removeItem("aerohealth-exposure-data")
    localStorage.removeItem("aerohealth-preferences")
  } catch (error) {
    console.error("Error deleting user data:", error)
  }
}
