"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bell, BellOff, AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import {
  getStoredAlerts,
  markAlertAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  type AirQualityAlert,
  type NotificationSettings,
} from "@/lib/notifications"

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<AirQualityAlert[]>([])
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings())
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setAlerts(getStoredAlerts())

    const handleNewAlert = (event: CustomEvent) => {
      setAlerts((prev) => [event.detail, ...prev])
    }

    window.addEventListener("newAlert", handleNewAlert as EventListener)
    return () => window.removeEventListener("newAlert", handleNewAlert as EventListener)
  }, [])

  const handleMarkAsRead = (alertId: string) => {
    markAlertAsRead(alertId)
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))
  }

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    updateNotificationSettings({ [key]: value })
  }

  const getSeverityIcon = (severity: AirQualityAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: AirQualityAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "high":
        return "bg-orange-50 border-orange-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const unreadCount = alerts.filter((alert) => !alert.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
          {settings.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Customize your alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <Switch
                id="notifications-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
              />
            </div>

            {settings.enabled && (
              <>
                <div className="space-y-2">
                  <Label>AQI Alert Threshold: {settings.aqiThreshold}</Label>
                  <Slider
                    value={[settings.aqiThreshold]}
                    onValueChange={([value]) => handleSettingChange("aqiThreshold", value)}
                    max={200}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Get alerts when AQI exceeds this value</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="health-alerts">Health Alerts</Label>
                    <Switch
                      id="health-alerts"
                      checked={settings.healthAlerts}
                      onCheckedChange={(checked) => handleSettingChange("healthAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-reports">Daily Reports</Label>
                    <Switch
                      id="daily-reports"
                      checked={settings.dailyReports}
                      onCheckedChange={(checked) => handleSettingChange("dailyReports", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                    <Switch
                      id="emergency-alerts"
                      checked={settings.emergencyAlerts}
                      onCheckedChange={(checked) => handleSettingChange("emergencyAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-enabled">Sound</Label>
                    <Switch
                      id="sound-enabled"
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No alerts yet</p>
              <p className="text-sm text-gray-400">You'll see air quality alerts here</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={`${getSeverityColor(alert.severity)} ${alert.read ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{alert.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        {!alert.read && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{alert.location}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.read && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
