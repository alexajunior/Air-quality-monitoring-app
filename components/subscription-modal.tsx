"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Check, Send, Copy, CheckCircle, Loader2, AlertTriangle, RefreshCw, Phone } from "lucide-react"
import {
  SUBSCRIPTION_PLANS,
  AEROHEALTH_MOMO,
  MTNMoMoAPI,
  saveSubscription,
  storePendingPayment,
  getPendingPayment,
  clearPendingPayment,
} from "@/lib/mtn-momo-api"
import { toast } from "@/hooks/use-toast"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]) // Default to premium
  const [senderPhone, setSenderPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "transfer" | "verification" | "success">("select")
  const [reference, setReference] = useState("")
  const [verificationAttempts, setVerificationAttempts] = useState(0)
  const [copiedNumber, setCopiedNumber] = useState(false)
  const [copiedReference, setCopiedReference] = useState(false)

  const momoAPI = new MTNMoMoAPI()

  useEffect(() => {
    // Check for pending payment on modal open
    if (isOpen) {
      const pending = getPendingPayment()
      if (pending) {
        const plan = SUBSCRIPTION_PLANS.find((p) => p.id === pending.planId)
        if (plan) {
          setSelectedPlan(plan)
          setReference(pending.reference)
          setSenderPhone(pending.senderPhone)
          setPaymentStep("verification")
        }
      }
    }
  }, [isOpen])

  const handlePlanSelect = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
    if (plan) {
      setSelectedPlan(plan)
    }
  }

  const handleInitiateTransfer = () => {
    if (!senderPhone.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your MTN phone number.",
        variant: "destructive",
      })
      return
    }

    if (!momoAPI.validateGhanaPhone(senderPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Ghana phone number (e.g., 0244123456 or 233244123456).",
        variant: "destructive",
      })
      return
    }

    // Generate unique reference
    const newReference = momoAPI.generateReference(selectedPlan.id)
    setReference(newReference)

    // Store pending payment
    storePendingPayment(newReference, selectedPlan.id, selectedPlan.price, senderPhone)

    setPaymentStep("transfer")
  }

  const copyToClipboard = async (text: string, type: "number" | "reference") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "number") {
        setCopiedNumber(true)
        setTimeout(() => setCopiedNumber(false), 2000)
      } else {
        setCopiedReference(true)
        setTimeout(() => setCopiedReference(false), 2000)
      }
      toast({
        title: "Copied!",
        description: `${type === "number" ? "Phone number" : "Reference"} copied to clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually.",
        variant: "destructive",
      })
    }
  }

  const handleVerifyPayment = async () => {
    setIsProcessing(true)
    setVerificationAttempts((prev) => prev + 1)

    try {
      const transferResult = await momoAPI.checkReceivedTransfer(reference, selectedPlan.price)

      if (transferResult && transferResult.status === "SUCCESSFUL") {
        // Save subscription
        saveSubscription(selectedPlan.id, 1, transferResult.transactionId)

        // Clear pending payment
        clearPendingPayment()

        toast({
          title: "Payment Verified!",
          description: `Your ${selectedPlan.name} subscription is now active!`,
        })

        setPaymentStep("success")
        setTimeout(() => {
          onSuccess()
          onClose()
          resetModal()
        }, 2000)
      } else {
        toast({
          title: "Payment Not Found",
          description:
            verificationAttempts >= 3
              ? "Payment not received yet. Please ensure you've sent the exact amount with the reference."
              : "Payment not received yet. Please try again in a moment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetModal = () => {
    setPaymentStep("select")
    setSenderPhone("")
    setReference("")
    setIsProcessing(false)
    setVerificationAttempts(0)
    setCopiedNumber(false)
    setCopiedReference(false)
    clearPendingPayment()
  }

  const handleClose = () => {
    onClose()
    // Don't reset if we're in verification step (keep pending payment)
    if (paymentStep !== "verification") {
      resetModal()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Subscribe to Ghana Air Quality Maps
          </DialogTitle>
          <DialogDescription>Send money via MTN Mobile Money to activate your subscription</DialogDescription>
        </DialogHeader>

        {paymentStep === "select" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan.id === plan.id
                      ? "ring-2 ring-teal-500 border-teal-300"
                      : "border-gray-200 hover:border-teal-300"
                  } ${plan.popular ? "relative" : ""}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-teal-600">
                      GHS {plan.price}
                      <span className="text-sm font-normal text-gray-500">/{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Your MTN Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0244123456 or 233244123456"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="pl-10 border-teal-200 focus:border-teal-500"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter your MTN Ghana phone number for verification</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{selectedPlan.name}</span> - GHS {selectedPlan.price}/month
                </div>
                <Button onClick={handleInitiateTransfer} className="bg-teal-600 hover:bg-teal-700">
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        )}

        {paymentStep === "transfer" && (
          <div className="space-y-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Money via MTN MoMo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-orange-700 mb-4">
                    Send <span className="font-bold text-xl">GHS {selectedPlan.price}</span> to our business number:
                  </p>

                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Send to:</span>
                      <Badge className="bg-orange-100 text-orange-700">MTN Business</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-gray-900">{AEROHEALTH_MOMO.number}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(AEROHEALTH_MOMO.number, "number")}
                        className="flex items-center gap-1"
                      >
                        {copiedNumber ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedNumber ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{AEROHEALTH_MOMO.name}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-orange-200 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Reference (Important!):</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-mono font-bold text-gray-900 break-all">{reference}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(reference, "reference")}
                        className="flex items-center gap-1 ml-2"
                      >
                        {copiedReference ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedReference ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important Steps:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                      <li>Dial *170# on your MTN phone</li>
                      <li>Select "Send Money"</li>
                      <li>Enter our number: {AEROHEALTH_MOMO.number}</li>
                      <li>Enter amount: GHS {selectedPlan.price}</li>
                      <li>Add reference: {reference}</li>
                      <li>Confirm with your MoMo PIN</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetModal} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => setPaymentStep("verification")}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                I've Sent the Money
              </Button>
            </div>
          </div>
        )}

        {paymentStep === "verification" && (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Verifying Your Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-sm text-blue-700">
                    <p>
                      <strong>Amount:</strong> GHS {selectedPlan.price}
                    </p>
                    <p>
                      <strong>Reference:</strong> {reference}
                    </p>
                    <p>
                      <strong>From:</strong> {senderPhone}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      We're checking our system for your payment. This usually takes 1-2 minutes.
                    </p>
                    {verificationAttempts > 0 && (
                      <p className="text-xs text-blue-600">Verification attempts: {verificationAttempts}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleVerifyPayment}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Checking Payment...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check Payment Status
                      </>
                    )}
                  </Button>

                  {verificationAttempts >= 2 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Payment not found yet?</strong>
                        <ul className="mt-2 space-y-1">
                          <li>• Ensure you sent exactly GHS {selectedPlan.price}</li>
                          <li>• Check that you included the reference: {reference}</li>
                          <li>• Wait 2-3 minutes for processing</li>
                          <li>• Contact support if issues persist</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaymentStep("transfer")} className="flex-1">
                Back to Instructions
              </Button>
              <Button variant="outline" onClick={resetModal} className="flex-1">
                Cancel Payment
              </Button>
            </div>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your {selectedPlan.name} subscription is now active. You have full access to Ghana air quality maps!
            </p>
            <Badge className="bg-green-100 text-green-700 border-green-300">Subscription Active</Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
