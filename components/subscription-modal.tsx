"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Check, Star, Shield, Users, Zap, Crown, Phone, Mail, CreditCard } from "lucide-react"
import {
  SUBSCRIPTION_PLANS,
  createMTNPayment,
  checkMTNPaymentStatus,
  activateSubscription,
  type MTNSubscriptionPlan,
} from "@/lib/mtn-api"

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<MTNSubscriptionPlan | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"plans" | "payment" | "processing" | "success">("plans")

  const handleSubscribe = async () => {
    if (!selectedPlan || !phoneNumber || !email) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)
    setStep("processing")

    try {
      const result = await createMTNPayment(phoneNumber, selectedPlan.id, email)

      if (result.success && result.transactionId) {
        setTransactionId(result.transactionId)
        // Start polling for payment status
        pollPaymentStatus(result.transactionId)
      } else {
        setError(result.error || "Payment initiation failed")
        setIsProcessing(false)
        setStep("payment")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setIsProcessing(false)
      setStep("payment")
    }
  }

  const pollPaymentStatus = async (txId: string) => {
    const maxAttempts = 60 // 10 minutes with 10-second intervals
    let attempts = 0

    const poll = async () => {
      attempts++

      try {
        const result = await checkMTNPaymentStatus(txId)

        if (result.success && result.status) {
          setPaymentStatus(result.status)

          if (result.status === "successful") {
            // Activate subscription
            if (selectedPlan) {
              activateSubscription(selectedPlan.id, email)
            }
            setIsProcessing(false)
            setStep("success")
            setTimeout(() => {
              onOpenChange(false)
              // Refresh page to show subscription features
              window.location.reload()
            }, 5000)
            return
          }

          if (result.status === "failed") {
            setError("Payment failed. Please try again with a different number or check your MTN Mobile Money balance.")
            setIsProcessing(false)
            setStep("payment")
            return
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 10000) // Poll every 10 seconds
        } else {
          setError("Payment verification timed out. Please check your MTN Mobile Money transaction history.")
          setIsProcessing(false)
          setStep("payment")
        }
      } catch (err) {
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000)
        } else {
          setError("Unable to verify payment status. Please contact support.")
          setIsProcessing(false)
          setStep("payment")
        }
      }
    }

    poll()
  }

  const resetModal = () => {
    setSelectedPlan(null)
    setPhoneNumber("")
    setEmail("")
    setIsProcessing(false)
    setTransactionId(null)
    setPaymentStatus(null)
    setError(null)
    setStep("plans")
  }

  useEffect(() => {
    if (!open) {
      resetModal()
    }
  }, [open])

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "basic_ghana":
        return Shield
      case "premium_ghana":
        return Star
      case "family_ghana":
        return Users
      default:
        return Zap
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "")

    // Format as Ghana number
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to Premium - Ghana
          </DialogTitle>
          <DialogDescription>
            Choose a subscription plan designed for Ghana's air quality challenges. Pay securely with MTN Mobile Money.
          </DialogDescription>
        </DialogHeader>

        {step === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const Icon = getPlanIcon(plan.id)
              return (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    plan.popular
                      ? "border-blue-500 bg-blue-50 relative"
                      : selectedPlan?.id === plan.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => {
                    setSelectedPlan(plan)
                    setStep("payment")
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-center">
                      <span className="text-3xl font-bold text-gray-900">GHS {plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Select {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {step === "payment" && selectedPlan && (
          <div className="space-y-6 mt-6">
            {/* Selected Plan Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {React.createElement(getPlanIcon(selectedPlan.id), { className: "h-6 w-6 text-blue-600" })}
                  <div>
                    <div className="text-xl">{selectedPlan.name}</div>
                    <div className="text-sm text-gray-600 font-normal">
                      GHS {selectedPlan.price}/month • {selectedPlan.duration} days • Ghana-optimized
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Payment Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        MTN Mobile Money Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="024 XXX XXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        maxLength={13}
                        className="text-lg"
                      />
                      <p className="text-xs text-gray-500">
                        Enter your MTN number (024, 054, 055, or 059). You'll receive a payment prompt on your phone.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-lg"
                      />
                      <p className="text-xs text-gray-500">
                        We'll send your subscription confirmation and receipts here.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => setStep("plans")} variant="outline" className="flex-1">
                    Back to Plans
                  </Button>
                  <Button
                    onClick={handleSubscribe}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!phoneNumber || !email}
                  >
                    Pay GHS {selectedPlan.price} with MTN MoMo
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">What You Get</h3>
                  <div className="space-y-3">
                    {selectedPlan.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {selectedPlan.features.length > 5 && (
                      <div className="text-sm text-gray-500">+{selectedPlan.features.length - 5} more features...</div>
                    )}
                  </div>
                </div>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Ghana-Specific Features</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Harmattan season alerts</li>
                      <li>• Dust storm early warnings</li>
                      <li>• Local health recommendations</li>
                      <li>• Support in English & Twi</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 mx-auto">
              <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600 mb-4">
                {paymentStatus === "pending"
                  ? "Please check your phone and approve the MTN Mobile Money payment request"
                  : "Initiating payment with MTN Mobile Money..."}
              </p>
              {transactionId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID:</p>
                  <p className="font-mono text-sm">{transactionId}</p>
                </div>
              )}
            </div>
            <div className="max-w-md mx-auto">
              <Alert>
                <AlertDescription>
                  <strong>Next Steps:</strong>
                  <br />
                  1. Check your phone for MTN MoMo prompt
                  <br />
                  2. Enter your MTN MoMo PIN
                  <br />
                  3. Confirm the payment
                  <br />
                  4. Wait for confirmation
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your {selectedPlan?.name} subscription is now active. Welcome to premium AeroHealth!
              </p>
              <div className="bg-green-50 p-6 rounded-lg max-w-md mx-auto">
                <h4 className="font-semibold text-green-800 mb-3">What happens next:</h4>
                <ul className="text-sm text-green-700 space-y-2 text-left">
                  <li>✓ Premium features are now unlocked</li>
                  <li>✓ You'll receive a confirmation email</li>
                  <li>✓ Advanced alerts are now active</li>
                  <li>✓ AI insights are available</li>
                  <li>✓ Family sharing is ready to set up</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
