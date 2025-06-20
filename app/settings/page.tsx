"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import {
  Settings,
  User,
  Lock,
  Bell,
  Shield,
  MapPin,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import {
  getUserSettings,
  saveUserSettings,
  exportUserData,
  deleteUserData,
  type UserProfile,
  type NotificationSettings,
} from "@/lib/user-storage"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    airQualityAlerts: true,
    healthRecommendations: true,
    courseUpdates: false,
    productDeals: true,
    weeklyReports: true,
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  // Load settings on component mount
  useEffect(() => {
    const settings = getUserSettings()
    setProfile(settings.profile)
    setNotifications(settings.notifications)
    setTwoFactorEnabled(settings.twoFactorEnabled)
  }, [])

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) errors.push("Password must be at least 8 characters long")
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter")
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter")
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number")
    return errors
  }

  const handleSaveProfile = async () => {
    setSaveStatus("saving")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      saveUserSettings({ profile })
      setSaveStatus("saved")

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const errors = validatePassword(passwords.newPassword)
    setPasswordErrors(errors)

    if (errors.length > 0) return

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordErrors(["Passwords do not match"])
      return
    }

    if (!passwords.currentPassword) {
      setPasswordErrors(["Current password is required"])
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setPasswordErrors([])

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    saveUserSettings({ notifications: updated })

    toast({
      title: "Notification Settings Updated",
      description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${value ? "enabled" : "disabled"}.`,
    })
  }

  const handleTwoFactorToggle = async (enabled: boolean) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTwoFactorEnabled(enabled)
      saveUserSettings({ twoFactorEnabled: enabled })

      toast({
        title: enabled ? "2FA Enabled" : "2FA Disabled",
        description: enabled
          ? "Two-factor authentication has been enabled for your account."
          : "Two-factor authentication has been disabled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update 2FA settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      const data = exportUserData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `aerohealth-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your data has been successfully exported.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      deleteUserData()

      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted.",
      })

      // In a real app, redirect to login page
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Settings className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600">Manage your AeroHealth account and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-teal-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <User className="h-5 w-5" />
                  Personal Information
                  {saveStatus === "saved" && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="border-teal-200 focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="border-teal-200 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-10 border-teal-200 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10 border-teal-200 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="pl-10 border-teal-200 focus:border-teal-500"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading || saveStatus === "saving"}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                </Button>
                {saveStatus === "saved" && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="pr-10 border-teal-200 focus:border-teal-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="pr-10 border-teal-200 focus:border-teal-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="text-teal-800">Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable 2FA</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} disabled={isLoading} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Air Quality Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified when air quality changes in your area</p>
                    </div>
                    <Switch
                      checked={notifications.airQualityAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("airQualityAlerts", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Health Recommendations</h3>
                      <p className="text-sm text-gray-600">Receive personalized health tips and advice</p>
                    </div>
                    <Switch
                      checked={notifications.healthRecommendations}
                      onCheckedChange={(checked) => handleNotificationChange("healthRecommendations", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Course Updates</h3>
                      <p className="text-sm text-gray-600">Get notified about new courses and learning materials</p>
                    </div>
                    <Switch
                      checked={notifications.courseUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("courseUpdates", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Product Deals</h3>
                      <p className="text-sm text-gray-600">Be informed about special offers and discounts</p>
                    </div>
                    <Switch
                      checked={notifications.productDeals}
                      onCheckedChange={(checked) => handleNotificationChange("productDeals", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Reports</h3>
                      <p className="text-sm text-gray-600">Receive weekly air quality and health summaries</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Shield className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Data Usage</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Your data is used to provide personalized air quality insights and health recommendations.
                    </p>
                    <Badge className="bg-teal-100 text-teal-700 border-teal-300">GDPR Compliant</Badge>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Data Export</h3>
                    <p className="text-sm text-gray-600 mb-3">Download all your personal data and activity history.</p>
                    <Button onClick={handleExportData} variant="outline" className="border-teal-200 text-teal-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2 text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isLoading}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your
                            data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                            {isLoading ? "Deleting..." : "Delete Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
