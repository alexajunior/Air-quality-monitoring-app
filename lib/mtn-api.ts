// Ghana MTN Mobile Money API Integration - Complete Implementation
export interface MTNSubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  duration: number // days
  features: string[]
  popular?: boolean
  ghanaSpecific: boolean
}

export interface MTNPaymentRequest {
  amount: string
  currency: string
  externalId: string
  payer: {
    partyIdType: string
    partyId: string
  }
  payerMessage: string
  payeeNote: string
}

export interface MTNPaymentResponse {
  financialTransactionId: string
  externalId: string
  amount: string
  currency: string
  payer: {
    partyIdType: string
    partyId: string
  }
  status: string
  reason?: string
}

const MTN_API_BASE_URL = process.env.NEXT_PUBLIC_MTN_API_URL || "https://sandbox.momodeveloper.mtn.com"
const MTN_API_KEY = process.env.MTN_API_KEY || "demo_key"
const MTN_SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY || "demo_subscription"

// Ghana-specific subscription plans with local pricing
export const SUBSCRIPTION_PLANS: MTNSubscriptionPlan[] = [
  {
    id: "basic_ghana",
    name: "Basic Protection",
    price: 10,
    currency: "GHS",
    duration: 30,
    ghanaSpecific: true,
    features: [
      "Real-time air quality monitoring for Ghana cities",
      "Basic health alerts in English & Twi",
      "Daily air quality reports",
      "Access to health tips",
      "Harmattan season alerts",
    ],
  },
  {
    id: "premium_ghana",
    name: "Premium Health Guard",
    price: 25,
    currency: "GHS",
    duration: 30,
    ghanaSpecific: true,
    features: [
      "Everything in Basic",
      "AI-powered health predictions",
      "Personalized recommendations",
      "Priority customer support",
      "Offline data access",
      "Family sharing (up to 4 members)",
      "Dust storm early warnings",
      "School air quality monitoring",
    ],
    popular: true,
  },
  {
    id: "family_ghana",
    name: "Family Shield",
    price: 40,
    currency: "GHS",
    duration: 30,
    ghanaSpecific: true,
    features: [
      "Everything in Premium",
      "Unlimited family members",
      "Multiple location monitoring",
      "Emergency alert system",
      "Health consultation credits",
      "Custom location monitoring",
      "Community health reports",
      "Agricultural air quality data",
    ],
  },
]

// Generate UUID for transaction IDs
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Format Ghana phone number for MTN API
function formatGhanaPhoneNumber(phoneNumber: string): string {
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, "")

  // Handle different formats
  if (cleaned.startsWith("233")) {
    return cleaned // Already in international format
  } else if (cleaned.startsWith("0")) {
    return "233" + cleaned.substring(1) // Remove leading 0 and add country code
  } else if (cleaned.length === 9) {
    return "233" + cleaned // Add country code
  }

  return cleaned
}

// Validate MTN Ghana number
function isValidMTNNumber(phoneNumber: string): boolean {
  const formatted = formatGhanaPhoneNumber(phoneNumber)
  // MTN Ghana prefixes: 024, 054, 055, 059
  const mtnPrefixes = ["23324", "23354", "23355", "23359"]
  return mtnPrefixes.some((prefix) => formatted.startsWith(prefix)) && formatted.length === 12
}

// Create MTN Mobile Money payment request
export async function createMTNPayment(
  phoneNumber: string,
  planId: string,
  userEmail: string,
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Validate phone number
    if (!isValidMTNNumber(phoneNumber)) {
      throw new Error("Please enter a valid MTN Ghana number (024, 054, 055, or 059)")
    }

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
    if (!plan) {
      throw new Error("Invalid subscription plan")
    }

    const externalId = generateUUID()
    const formattedPhone = formatGhanaPhoneNumber(phoneNumber)

    const paymentRequest: MTNPaymentRequest = {
      amount: plan.price.toString(),
      currency: plan.currency,
      externalId,
      payer: {
        partyIdType: "MSISDN",
        partyId: formattedPhone,
      },
      payerMessage: `AeroHealth ${plan.name} - Ghana Air Quality Protection`,
      payeeNote: `Subscription for ${userEmail} - ${plan.name} (Ghana)`,
    }

    // For demo purposes, simulate API call
    if (MTN_API_KEY === "demo_key") {
      // Simulate successful payment initiation
      const transaction = {
        id: externalId,
        planId,
        phoneNumber: formattedPhone,
        userEmail,
        amount: plan.price,
        currency: plan.currency,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(`mtn_transaction_${externalId}`, JSON.stringify(transaction))

      // Simulate payment completion after 5 seconds
      setTimeout(() => {
        const updatedTransaction = { ...transaction, status: "successful" }
        localStorage.setItem(`mtn_transaction_${externalId}`, JSON.stringify(updatedTransaction))
        window.dispatchEvent(new CustomEvent("paymentCompleted", { detail: updatedTransaction }))
      }, 5000)

      return {
        success: true,
        transactionId: externalId,
      }
    }

    // Real API call for production
    const response = await fetch(`${MTN_API_BASE_URL}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MTN_API_KEY}`,
        "X-Reference-Id": externalId,
        "X-Target-Environment": process.env.NODE_ENV === "production" ? "live" : "sandbox",
        "Ocp-Apim-Subscription-Key": MTN_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    })

    if (!response.ok) {
      throw new Error(`MTN API error: ${response.status}`)
    }

    // Store transaction for tracking
    const transaction = {
      id: externalId,
      planId,
      phoneNumber: formattedPhone,
      userEmail,
      amount: plan.price,
      currency: plan.currency,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(`mtn_transaction_${externalId}`, JSON.stringify(transaction))

    return {
      success: true,
      transactionId: externalId,
    }
  } catch (error) {
    console.error("MTN payment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    }
  }
}

// Check MTN payment status
export async function checkMTNPaymentStatus(transactionId: string): Promise<{
  success: boolean
  status?: string
  error?: string
}> {
  try {
    // For demo mode, check local storage
    if (MTN_API_KEY === "demo_key") {
      const storedTransaction = localStorage.getItem(`mtn_transaction_${transactionId}`)
      if (storedTransaction) {
        const transaction = JSON.parse(storedTransaction)
        return {
          success: true,
          status: transaction.status,
        }
      }
      return {
        success: false,
        error: "Transaction not found",
      }
    }

    // Real API call for production
    const response = await fetch(`${MTN_API_BASE_URL}/collection/v1_0/requesttopay/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${MTN_API_KEY}`,
        "X-Target-Environment": process.env.NODE_ENV === "production" ? "live" : "sandbox",
        "Ocp-Apim-Subscription-Key": MTN_SUBSCRIPTION_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`MTN API error: ${response.status}`)
    }

    const paymentStatus: MTNPaymentResponse = await response.json()

    // Update local storage
    const storedTransaction = localStorage.getItem(`mtn_transaction_${transactionId}`)
    if (storedTransaction) {
      const transaction = JSON.parse(storedTransaction)
      transaction.status = paymentStatus.status.toLowerCase()
      transaction.updatedAt = new Date().toISOString()
      localStorage.setItem(`mtn_transaction_${transactionId}`, JSON.stringify(transaction))
    }

    return {
      success: true,
      status: paymentStatus.status.toLowerCase(),
    }
  } catch (error) {
    console.error("MTN status check error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Status check failed",
    }
  }
}

// Activate subscription after successful payment
export function activateSubscription(planId: string, userEmail: string): void {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
  if (!plan) return

  const subscription = {
    planId,
    planName: plan.name,
    userEmail,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
    features: plan.features,
    active: true,
    country: "Ghana",
    currency: plan.currency,
  }

  localStorage.setItem("aerohealth_subscription", JSON.stringify(subscription))

  // Trigger subscription activation event
  window.dispatchEvent(new CustomEvent("subscriptionActivated", { detail: subscription }))
}

// Check if user has active subscription
export function getActiveSubscription(): {
  active: boolean
  subscription?: any
} {
  try {
    const stored = localStorage.getItem("aerohealth_subscription")
    if (!stored) return { active: false }

    const subscription = JSON.parse(stored)
    const now = new Date()
    const endDate = new Date(subscription.endDate)

    if (now > endDate) {
      localStorage.removeItem("aerohealth_subscription")
      return { active: false }
    }

    return {
      active: true,
      subscription,
    }
  } catch {
    return { active: false }
  }
}

// Get subscription features for current user
export function getSubscriptionFeatures(): string[] {
  const { active, subscription } = getActiveSubscription()
  if (!active || !subscription) {
    return ["Basic air quality monitoring", "Limited health tips"]
  }
  return subscription.features || []
}

// Check if feature is available for current subscription
export function hasFeature(feature: string): boolean {
  const features = getSubscriptionFeatures()
  return features.some((f) => f.toLowerCase().includes(feature.toLowerCase()))
}
