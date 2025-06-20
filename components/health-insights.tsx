"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, TrendingUp, AlertCircle, Lightbulb, Target, Shield } from "lucide-react"
import { generateHealthInsights, getHealthProfile, calculateHealthScore, type HealthInsight } from "@/lib/ai-insights"
import { hasFeature } from "@/lib/mtn-api"

interface HealthInsightsProps {
  airQualityData: any
}

export function HealthInsights({ airQualityData }: HealthInsightsProps) {
  const [insights, setInsights] = useState<HealthInsight[]>([])
  const [userProfile, setUserProfile] = useState(getHealthProfile())
  const [healthScore, setHealthScore] = useState<any>(null)
  const [showAllInsights, setShowAllInsights] = useState(false)

  useEffect(() => {
    if (airQualityData) {
      const generatedInsights = generateHealthInsights(airQualityData, userProfile || undefined)
      setInsights(generatedInsights)
      
      const score = calculateHealthScore(airQualityData, userProfile || undefined)
      setHealthScore(score)
    }
  }, [airQualityData, userProfile])

  const getInsightIcon = (type: HealthInsight["type"]) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "recommendation":
        return <Target className="h-5 w-5 text-blue-500" />
      case "tip":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case "prediction":
        return <TrendingUp className="h-5 w-5 text-purple-500" />
      case "ghana_specific":
        return <Shield className="h-5 w-5 text-green-500" />
      default:
        return <Brain className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: HealthInsight["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 border-red-200 border-l-4 border-l-red-500"
      case "high":
        return "bg-orange-50 border-orange-200 border-l-4 border-l-orange-500"
      case "medium":
        return "bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500"
      case "low":
        return "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getCategoryColor = (category: HealthInsight["category"]) => {
    switch (category) {
      case "respiratory":
        return "bg-red-100 text-red-800"
      case "cardiovascular":
        return "bg-orange-100 text-orange-800"
      case "exercise":
        return "bg-green-100 text-green-800"
      case "diet":
        return "bg-purple-100 text-purple-800"
      case "ghana_health":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getHealthScoreColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "text-green-600 bg-green-100"
      case "good":
        return "text-blue-600 bg-blue-100"
      case "moderate":
        return "text-yellow-600 bg-yellow-100"
      case "poor":
        return "text-orange-600 bg-orange-100"
      case "dangerous":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const isPremiumFeature = !hasFeature("AI insights")
  const displayInsights = showAllInsights ? insights : insights.slice(0, isPremiumFeature ? 2 : insights.length)

  if (!insights.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading AI insights...</p>
          <p className="text-sm text-gray-400">Analyzing air quality data for personalized recommendations</p>
        </CardContent>
      </Card>
    )
  }
