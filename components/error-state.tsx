"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = "Unable to load air quality data. Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>{"Error Loading Data"}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
