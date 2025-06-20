// Complete Push Notifications and Alert System
export interface NotificationSettings {
  enabled: boolean
  aqiThreshold: number
  healthAlerts: boolean
  dailyReports: boolean
  emergencyAlerts: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  harmattanAlerts: boolean // Ghana-specific
  dustStormWarnings: boolean // Ghana-specific
  language: "en" | "tw" // English or Twi
}

export interface AirQualityAlert {
  id: string
  type: "aqi" | "health" | "emergency" | "daily" | "harmattan" | "dust_storm"
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  location: string
  timestamp: string
  read: boolean
  actionable: boolean
  actions?: string[]
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  aqiThreshold: 100,
  healthAlerts: true,
  dailyReports: true,
  emergencyAlerts: true,
  soundEnabled: true,
  vibrationEnabled: true,
  harmattanAlerts: true,
  dustStormWarnings: true,
  language: "en",
}

// Ghana-specific alert messages in English and Twi
const ALERT_MESSAGES = {
  en: {
    aqi_high: "Air quality is unhealthy. Stay indoors and wear masks when going out.",
    harmattan: "Harmattan season alert! Dust levels are high. Protect your respiratory health.",
    dust_storm: "Dust storm approaching! Close windows and avoid outdoor activities.",
    daily_report: "Your daily air quality report is ready.",
  },
  tw: {
    aqi_high: "Mframa no nyɛ papa. Tena fie na hyɛ mask bere a worekɔ abɔnten no.",
    harmattan: "Harmattan bere yi! Mfutuma pii wɔ hɔ. Bɔ wo home kwan ho ban.",
    dust_storm: "Mfutuma ahum reba! To mfɛnsere mu na nkɔ abɔnten.",
    daily_report: "Wo da biara mframa ho amanneɛbɔ no aba.",
  },
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission === "denied") {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

// Register service worker for push notifications
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js")
    console.log("Service worker registered:", registration)

    // Listen for service worker messages
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "NOTIFICATION_CLICKED") {
        // Handle notification click
        window.focus()
      }
    })

    return registration
  } catch (error) {
    console.error("Service worker registration failed:", error)
    return null
  }
}

// Show notification with Ghana-specific features
export function showNotification(alert: Omit<AirQualityAlert, "id" | "timestamp" | "read">) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return
  }

  const settings = getNotificationSettings()
  if (!settings.enabled) return

  // Get localized message
  const lang = settings.language
  let localizedMessage = alert.message

  if (alert.type === "aqi" && lang === "tw") {
    localizedMessage = ALERT_MESSAGES.tw.aqi_high
  } else if (alert.type === "harmattan" && lang === "tw") {
    localizedMessage = ALERT_MESSAGES.tw.harmattan
  }

  const notification = new Notification(alert.title, {
    body: localizedMessage,
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    tag: alert.type,
    requireInteraction: alert.severity === "critical",
    silent: !settings.soundEnabled,
    vibrate: settings.vibrationEnabled ? [200, 100, 200, 100, 200] : undefined,
    data: {
      location: alert.location,
      severity: alert.severity,
      type: alert.type,
      actionable: alert.actionable,
    },
    actions: alert.actionable
      ? [
          {
            action: "view",
            title: "View Details",
          },
          {
            action: "dismiss",
            title: "Dismiss",
          },
        ]
      : undefined,
  })

  notification.onclick = () => {
    window.focus()
    notification.close()

    // Navigate to relevant section
    if (alert.type === "aqi") {
      window.location.hash = "#monitor"
    } else if (alert.type === "health") {
      window.location.hash = "#health"
    }
  }

  // Store alert
  storeAlert({
    ...alert,
    id: generateAlertId(),
    timestamp: new Date().toISOString(),
    read: false,
  })
}

// Generate alert ID
function generateAlertId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Store alert in local storage
function storeAlert(alert: AirQualityAlert) {
  try {
    const stored = localStorage.getItem("aerohealth_alerts") || "[]"
    const alerts: AirQualityAlert[] = JSON.parse(stored)

    alerts.unshift(alert)

    // Keep only last 100 alerts
    if (alerts.length > 100) {
      alerts.splice(100)
    }

    localStorage.setItem("aerohealth_alerts", JSON.stringify(alerts))

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent("newAlert", { detail: alert }))
  } catch (error) {
    console.error("Failed to store alert:", error)
  }
}

// Get stored alerts
export function getStoredAlerts(): AirQualityAlert[] {
  try {
    const stored = localStorage.getItem("aerohealth_alerts") || "[]"
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Mark alert as read
export function markAlertAsRead(alertId: string) {
  try {
    const stored = localStorage.getItem("aerohealth_alerts") || "[]"
    const alerts: AirQualityAlert[] = JSON.parse(stored)

    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.read = true
      localStorage.setItem("aerohealth_alerts", JSON.stringify(alerts))
    }
  } catch (error) {
    console.error("Failed to mark alert as read:", error)
  }
}

// Get notification settings
export function getNotificationSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem("aerohealth_notification_settings")
    if (!stored) return DEFAULT_SETTINGS

    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

// Update notification settings
export function updateNotificationSettings(settings: Partial<NotificationSettings>) {
  try {
    const current = getNotificationSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem("aerohealth_notification_settings", JSON.stringify(updated))

    window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: updated }))
  } catch (error) {
    console.error("Failed to update notification settings:", error)
  }
}

// Check AQI and trigger alerts with Ghana-specific logic
export function checkAQIAlerts(aqi: number, location: string) {
  const settings = getNotificationSettings()

  if (!settings.enabled || !settings.healthAlerts) return

  if (aqi >= settings.aqiThreshold) {
    let severity: AirQualityAlert["severity"] = "medium"
    let message = ""
    const actionable = true

    if (aqi >= 300) {
      severity = "critical"
      message = `HAZARDOUS air quality in ${location}! Stay indoors immediately. Close all windows and use air purifiers.`
    } else if (aqi >= 200) {
      severity = "high"
      message = `VERY UNHEALTHY air quality in ${location}. Everyone should avoid outdoor activities. Wear N95 masks if you must go out.`
    } else if (aqi >= 150) {
      severity = "high"
      message = `UNHEALTHY air quality in ${location}. Sensitive groups should stay indoors. Others should limit outdoor activities.`
    } else if (aqi >= 100) {
      severity = "medium"
      message = `MODERATE air quality in ${location}. Sensitive individuals should consider limiting prolonged outdoor activities.`
    }

    if (message) {
      showNotification({
        type: "aqi",
        title: "Air Quality Alert - Ghana",
        message,
        severity,
        location,
        actionable,
        actions: ["View air quality map", "Get health recommendations", "Share with family"],
      })
    }
  }
}

// Ghana-specific Harmattan season alerts
export function checkHarmattanAlerts(visibility: number, location: string) {
  const settings = getNotificationSettings()

  if (!settings.enabled || !settings.harmattanAlerts) return

  // Harmattan typically reduces visibility significantly
  if (visibility < 5) {
    // Less than 5km visibility
    showNotification({
      type: "harmattan",
      title: "Harmattan Alert - Ghana",
      message: `Heavy dust from Harmattan in ${location}. Visibility is very low. Protect your respiratory health.`,
      severity: "high",
      location,
      actionable: true,
      actions: ["Get protection tips", "Find nearby pharmacies", "Check family members"],
    })
  }
}

// Dust storm early warning system
export function checkDustStormWarnings(windSpeed: number, pm10: number, location: string) {
  const settings = getNotificationSettings()

  if (!settings.enabled || !settings.dustStormWarnings) return

  // High wind speed + high PM10 indicates potential dust storm
  if (windSpeed > 30 && pm10 > 150) {
    // km/h and μg/m³
    showNotification({
      type: "dust_storm",
      title: "Dust Storm Warning - Ghana",
      message: `Dust storm conditions detected in ${location}. High winds and dust particles. Take immediate precautions.`,
      severity: "critical",
      location,
      actionable: true,
      actions: ["Emergency checklist", "Find shelter", "Contact emergency services"],
    })
  }
}

// Send daily report with Ghana-specific insights
export function sendDailyReport(data: any) {
  const settings = getNotificationSettings()

  if (!settings.enabled || !settings.dailyReports) return

  const avgAQI = Math.round(data.hourly.reduce((sum: number, item: any) => sum + item.aqi, 0) / data.hourly.length)
  const maxAQI = Math.max(...data.hourly.map((item: any) => item.aqi))
  const minAQI = Math.min(...data.hourly.map((item: any) => item.aqi))

  // Ghana-specific insights
  const isHarmattanSeason = isHarmattanPeriod()
  const harmattanNote = isHarmattanSeason ? " (Harmattan season - extra precautions needed)" : ""

  showNotification({
    type: "daily",
    title: "Daily Air Quality Report - Ghana",
    message: `${data.current.location}: Avg AQI ${avgAQI}, Range ${minAQI}-${maxAQI}${harmattanNote}. Tap for detailed insights and health tips.`,
    severity: avgAQI > 100 ? "medium" : "low",
    location: data.current.location,
    actionable: true,
    actions: ["View full report", "Get health tips", "Share with family"],
  })
}

// Check if it's Harmattan season (November to March in Ghana)
function isHarmattanPeriod(): boolean {
  const month = new Date().getMonth() + 1 // 1-12
  return month >= 11 || month <= 3
}

// Schedule notifications based on Ghana time zone
export function scheduleNotifications() {
  // Schedule daily report at 7 AM Ghana time
  const now = new Date()
  const ghanaTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Accra" }))

  if (ghanaTime.getHours() === 7 && ghanaTime.getMinutes() === 0) {
    // Trigger daily report
    const data = localStorage.getItem("latest_air_quality_data")
    if (data) {
      sendDailyReport(JSON.parse(data))
    }
  }
}

// Initialize notification system
export function initializeNotifications() {
  // Request permission
  requestNotificationPermission()

  // Register service worker
  registerServiceWorker()

  // Set up periodic checks
  setInterval(scheduleNotifications, 60000) // Check every minute

  // Listen for payment completion
  window.addEventListener("paymentCompleted", () => {
    showNotification({
      type: "health",
      title: "Subscription Activated!",
      message: "Your AeroHealth premium subscription is now active. Enjoy advanced features!",
      severity: "low",
      location: "Ghana",
      actionable: true,
      actions: ["Explore premium features", "Set up family sharing"],
    })
  })
}
