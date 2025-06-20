"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Key, CheckCircle, AlertTriangle, Copy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function ApiKeySetup() {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            API Key Setup
          </h1>
          <p className="text-gray-600">Configure your OpenWeatherMap API key for live air quality data</p>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Current API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentKey && currentKey !== "demo_key" ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700">API key is configured and ready</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-700">Using demo mode - live data unavailable</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Demo
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="test">Test API</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Your OpenWeatherMap API Key</CardTitle>
                <CardDescription>Follow these steps to get your free API key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Create an OpenWeatherMap Account</p>
                      <p className="text-sm text-gray-600 mb-2">Visit OpenWeatherMap and sign up for a free account</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit OpenWeatherMap
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Subscribe to Air Pollution API</p>
                      <p className="text-sm text-gray-600">
                        The Air Pollution API is free with up to 1,000 calls per day
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Get Your API Key</p>
                      <p className="text-sm text-gray-600">Find your API key in your account dashboard</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Add to Environment Variables</p>
                      <p className="text-sm text-gray-600 mb-2">Add your API key to your environment variables</p>
                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here")}
                          >
                            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> It may take up to 10 minutes for your new API key to become active after
                creation.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="configure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Configuration</CardTitle>
                <CardDescription>Set up your API key for the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">OpenWeatherMap API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="api-key"
                        type={showKey ? "text" : "password"}
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    To use your API key, add it to your environment variables and restart the application. In
                    production, configure this through your deployment platform's environment settings.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>For Local Development (.env.local)</Label>
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_OPENWEATHER_API_KEY={apiKey || "your_api_key_here"}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(`NEXT_PUBLIC_OPENWEATHER_API_KEY=${apiKey || "your_api_key_here"}`)
                        }
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Connection Test</CardTitle>
                <CardDescription>Test your API key configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current API Key Status</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {currentKey && currentKey !== "demo_key" ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">API key configured</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">No API key configured</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>API Endpoints</Label>
                      <div className="space-y-1 text-sm">
                        <div>✓ Air Pollution API</div>
                        <div>✓ Current Weather API</div>
                        <div>✓ Geocoding API</div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => (window.location.href = "/")} className="w-full">
                    Return to AeroHealth Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
