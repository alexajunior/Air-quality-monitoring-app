// Complete AI-Powered Health Insights System
export interface HealthInsight {
  id: string
  type: "recommendation" | "warning" | "tip" | "prediction" | "ghana_specific"
  title: string
  description: string
  confidence: number
  priority: "low" | "medium" | "high" | "critical"
  category: "respiratory" | "cardiovascular" | "general" | "exercise" | "diet" | "ghana_health"
  actionable: boolean
  sources: string[]
  ghanaRelevant: boolean
  harmattanRelated?: boolean
}

export interface PersonalizedRecommendation {
  userId: string
  location: string
  healthProfile: {
    age?: number
    conditions: string[]
    activityLevel: "low" | "moderate" | "high"
    sensitivity: "low" | "normal" | "high"
    occupation?: string
    ghanaResident: boolean
  }
  recommendations: HealthInsight[]
  generatedAt: string
}

// Ghana-specific health conditions and concerns
const GHANA_HEALTH_CONDITIONS = [
  "asthma",
  "bronchitis",
  "allergies",
  "sickle_cell",
  "hypertension",
  "diabetes",
  "respiratory_infections",
  "eye_irritation",
]

// Generate comprehensive AI-powered health insights
export function generateHealthInsights(
  aqiData: any,
  userProfile?: PersonalizedRecommendation["healthProfile"],
): HealthInsight[] {
  const insights: HealthInsight[] = []
  const aqi = aqiData.current.aqi
  const pm25 = aqiData.current.pm25
  const pm10 = aqiData.current.pm10
  const visibility = aqiData.current.visibility
  const location = aqiData.current.location

  // Ghana-specific AQI recommendations
  if (aqi > 150) {
    insights.push({
      id: "ghana-high-aqi-warning",
      type: "warning",
      title: "Unhealthy Air Quality in Ghana",
      description: `Current AQI of ${aqi} poses significant health risks. In Ghana's climate, this can worsen respiratory conditions. Stay indoors, use air purifiers, and keep medications accessible.`,
      confidence: 0.95,
      priority: "high",
      category: "respiratory",
      actionable: true,
      sources: ["Ghana Health Service", "EPA Air Quality Guidelines", "WHO Air Pollution Standards"],
      ghanaRelevant: true,
    })
  }

  // Harmattan-specific insights
  if (isHarmattanSeason() && (pm10 > 50 || visibility < 10)) {
    insights.push({
      id: "harmattan-health-alert",
      type: "ghana_specific",
      title: "Harmattan Season Health Alert",
      description: `Harmattan dust is affecting air quality in ${location}. The dry, dusty winds can cause respiratory irritation, dry skin, and eye problems. Use moisturizers, drink plenty of water, and protect your airways.`,
      confidence: 0.92,
      priority: "high",
      category: "ghana_health",
      actionable: true,
      sources: ["Ghana Meteorological Agency", "Ghana Health Service", "Tropical Medicine Research"],
      ghanaRelevant: true,
      harmattanRelated: true,
    })
  }

  // PM2.5 cardiovascular insights for Ghana
  if (pm25 > 35) {
    insights.push({
      id: "pm25-ghana-cardiovascular",
      type: "warning",
      title: "High PM2.5 - Cardiovascular Risk",
      description: `PM2.5 at ${pm25} μg/m³ significantly exceeds WHO guidelines. In Ghana's hot climate, this increases cardiovascular stress. Avoid strenuous outdoor activities, stay hydrated, and monitor blood pressure if you have hypertension.`,
      confidence: 0.88,
      priority: "high",
      category: "cardiovascular",
      actionable: true,
      sources: ["American Heart Association", "Ghana Cardiology Society", "Environmental Health Research"],
      ghanaRelevant: true,
    })
  }

  // Personalized recommendations for Ghana residents
  if (userProfile?.ghanaResident) {
    // Sickle cell disease considerations
    if (userProfile.conditions.includes("sickle_cell") && aqi > 100) {
      insights.push({
        id: "sickle-cell-air-quality",
        type: "recommendation",
        title: "Sickle Cell Disease - Air Quality Precautions",
        description:
          "Poor air quality can trigger sickle cell crises. Stay indoors, maintain hydration, avoid cold air conditioning, and have your medications ready. Contact your healthcare provider if you experience pain or breathing difficulties.",
        confidence: 0.94,
        priority: "critical",
        category: "ghana_health",
        actionable: true,
        sources: ["Sickle Cell Foundation Ghana", "Hematology Research", "Ghana Health Service"],
        ghanaRelevant: true,
      })
    }

    // Occupation-specific advice
    if (userProfile.occupation === "farmer" || userProfile.occupation === "outdoor_worker") {
      insights.push({
        id: "outdoor-worker-ghana",
        type: "recommendation",
        title: "Outdoor Worker Protection",
        description:
          "As an outdoor worker in Ghana, you're at higher risk during poor air quality days. Work during early morning hours when possible, wear protective masks, take frequent breaks in shaded areas, and stay hydrated.",
        confidence: 0.87,
        priority: "high",
        category: "general",
        actionable: true,
        sources: ["Ghana Labour Commission", "Occupational Health Ghana", "WHO Occupational Health"],
        ghanaRelevant: true,
      })
    }

    // Age-specific recommendations for Ghana
    if (userProfile.age && userProfile.age > 60 && aqi > 100) {
      insights.push({
        id: "elderly-ghana-protection",
        type: "recommendation",
        title: "Senior Health Protection",
        description:
          "Older adults in Ghana are more vulnerable to air pollution effects. Stay indoors during poor air quality, use fans instead of opening windows, maintain regular medication schedules, and have family check on you regularly.",
        confidence: 0.9,
        priority: "high",
        category: "general",
        actionable: true,
        sources: ["Ghana Geriatrics Society", "WHO Aging and Health", "Environmental Gerontology"],
        ghanaRelevant: true,
      })
    }
  }

  // Exercise recommendations for Ghana's climate
  if (userProfile?.activityLevel === "high" && aqi > 100) {
    insights.push({
      id: "exercise-ghana-climate",
      type: "recommendation",
      title: "Exercise Modifications for Ghana",
      description:
        "Combine poor air quality with Ghana's heat and humidity requires exercise adjustments. Exercise indoors or very early morning (5-7 AM), reduce intensity by 30-50%, stay well-hydrated, and avoid outdoor sports during Harmattan season.",
      confidence: 0.85,
      priority: "medium",
      category: "exercise",
      actionable: true,
      sources: ["Ghana Sports Medicine", "Exercise Physiology Research", "Tropical Sports Science"],
      ghanaRelevant: true,
    })
  }

  // Dietary recommendations for Ghana
  if (aqi > 100) {
    insights.push({
      id: "ghana-antioxidant-diet",
      type: "tip",
      title: "Ghana Foods for Air Pollution Protection",
      description:
        "Include local antioxidant-rich foods: moringa leaves, baobab fruit, garden eggs, ginger, turmeric, and palm nut soup. These traditional Ghanaian foods help combat oxidative stress from air pollution.",
      confidence: 0.78,
      priority: "medium",
      category: "diet",
      actionable: true,
      sources: ["Ghana Nutrition Association", "Traditional Medicine Research", "Nutritional Science Journal"],
      ghanaRelevant: true,
    })
  }

  // Predictive insights based on Ghana weather patterns
  const trend = calculateAQITrend(aqiData.hourly)
  if (trend === "worsening" && isHarmattanSeason()) {
    insights.push({
      id: "harmattan-trend-prediction",
      type: "prediction",
      title: "Worsening Air Quality During Harmattan",
      description:
        "Air quality is deteriorating during Harmattan season. Expect continued poor conditions for the next 24-48 hours. Stock up on medications, prepare indoor activities, and consider postponing non-essential outdoor plans.",
      confidence: 0.75,
      priority: "medium",
      category: "general",
      actionable: true,
      sources: ["Ghana Meteorological Agency", "Air Quality Forecasting Models", "Seasonal Health Patterns"],
      ghanaRelevant: true,
      harmattanRelated: true,
    })
  }

  // School and children recommendations
  if (aqi > 100) {
    insights.push({
      id: "children-school-ghana",
      type: "recommendation",
      title: "Protecting Children in Ghana Schools",
      description:
        "Poor air quality affects children more severely. Schools should limit outdoor activities, keep windows closed during dusty periods, ensure children have water bottles, and watch for respiratory symptoms.",
      confidence: 0.89,
      priority: "high",
      category: "general",
      actionable: true,
      sources: ["Ghana Education Service", "Pediatric Environmental Health", "School Health Guidelines"],
      ghanaRelevant: true,
    })
  }

  // Community health recommendations
  if (aqi > 150) {
    insights.push({
      id: "community-health-ghana",
      type: "recommendation",
      title: "Community Health Actions",
      description:
        "High pollution affects entire communities in Ghana. Check on elderly neighbors, share air quality information, organize community clean-up activities, and advocate for local environmental improvements.",
      confidence: 0.82,
      priority: "medium",
      category: "general",
      actionable: true,
      sources: ["Community Health Ghana", "Environmental Justice Research", "Public Health Advocacy"],
      ghanaRelevant: true,
    })
  }

  return insights.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

function calculateAQITrend(hourlyData: any[]): "improving" | "stable" | "worsening" {
  if (hourlyData.length < 6) return "stable"

  const recent = hourlyData.slice(-6).map((d) => d.aqi)
  const earlier = hourlyData.slice(-12, -6).map((d) => d.aqi)

  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
  const earlierAvg = earlier.reduce((sum, val) => sum + val, 0) / earlier.length

  const change = recentAvg - earlierAvg

  if (change > 10) return "worsening"
  if (change < -10) return "improving"
  return "stable"
}

// Check if it's Harmattan season in Ghana
function isHarmattanSeason(): boolean {
  const month = new Date().getMonth() + 1 // 1-12
  return month >= 11 || month <= 3
}

// Store user health profile with Ghana-specific fields
export function saveHealthProfile(profile: PersonalizedRecommendation["healthProfile"]) {
  try {
    const enhancedProfile = {
      ...profile,
      ghanaResident: true, // Default for this app
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem("aerohealth_profile", JSON.stringify(enhancedProfile))
  } catch (error) {
    console.error("Failed to save health profile:", error)
  }
}

// Get user health profile
export function getHealthProfile(): PersonalizedRecommendation["healthProfile"] | null {
  try {
    const stored = localStorage.getItem("aerohealth_profile")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Generate Ghana-specific health score
export function calculateHealthScore(
  aqiData: any,
  userProfile?: PersonalizedRecommendation["healthProfile"],
): {
  score: number
  level: "excellent" | "good" | "moderate" | "poor" | "dangerous"
  recommendations: string[]
} {
  let score = 100
  const recommendations: string[] = []

  // Base AQI impact
  const aqi = aqiData.current.aqi
  if (aqi > 300) score -= 70
  else if (aqi > 200) score -= 50
  else if (aqi > 150) score -= 35
  else if (aqi > 100) score -= 20
  else if (aqi > 50) score -= 10

  // Ghana-specific factors
  if (isHarmattanSeason()) {
    score -= 15
    recommendations.push("Extra precautions during Harmattan season")
  }

  // User profile adjustments
  if (userProfile) {
    if (userProfile.conditions.includes("asthma")) {
      score -= 20
      recommendations.push("Asthma management critical during poor air quality")
    }
    if (userProfile.conditions.includes("sickle_cell")) {
      score -= 25
      recommendations.push("Sickle cell patients need immediate protection")
    }
    if (userProfile.age && userProfile.age > 60) {
      score -= 15
      recommendations.push("Senior citizens need extra protection")
    }
    if (userProfile.sensitivity === "high") {
      score -= 10
      recommendations.push("High sensitivity requires immediate action")
    }
  }

  score = Math.max(0, Math.min(100, score))

  let level: "excellent" | "good" | "moderate" | "poor" | "dangerous"
  if (score >= 80) level = "excellent"
  else if (score >= 60) level = "good"
  else if (score >= 40) level = "moderate"
  else if (score >= 20) level = "poor"
  else level = "dangerous"

  return { score, level, recommendations }
}
