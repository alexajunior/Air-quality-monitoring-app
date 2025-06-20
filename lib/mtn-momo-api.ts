"use client"

export interface MoMoTransferRequest {
  senderPhone: string
  amount: number
  planId: string
  reference: string
}

export interface MoMoTransferResponse {
  status: "PENDING" | "SUCCESSFUL" | "FAILED"
  transactionId: string
  reference: string
  amount: number
  senderPhone: string
  receiverPhone: string
  timestamp: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  duration: string
  features: string[]
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic Maps",
    price: 10,
    currency: "GHS",
    duration: "1 month",
    features: ["Ghana air quality maps", "Real-time pollution overlay", "Basic location tracking", "7-day history"],
  },
  {
    id: "premium",
    name: "Premium Maps",
    price: 25,
    currency: "GHS",
    duration: "1 month",
    popular: true,
    features: [
      "High-resolution Ghana maps",
      "Live pollution tracking",
      "Advanced analytics",
      "30-day history",
      "Health recommendations",
      "Export data",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 50,
    currency: "GHS",
    duration: "1 month",
    features: [
      "Ultra-high resolution maps",
      "Real-time alerts",
      "Custom location monitoring",
      "Unlimited history",
      "API access",
      "Priority support",
    ],
  },
]

// AeroHealth Business MoMo Details
export const AEROHEALTH_MOMO = {
  number: "0244567890",
  name: "AeroHealth Ghana",
  network: "MTN",
}

// Mock MTN MoMo API implementation for receiving transfers
export class MTNMoMoAPI {
  private businessNumber: string

  constructor() {
    this.businessNumber = AEROHEALTH_MOMO.number
  }

  // Simulate checking if we received a transfer
  async checkReceivedTransfer(reference: string, expectedAmount: number): Promise<MoMoTransferResponse | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful transfer for demo (90% success rate)
    const isSuccessful = Math.random() > 0.1

    if (isSuccessful) {
      return {
        status: "SUCCESSFUL",
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        reference,
        amount: expectedAmount,
        senderPhone: "0244123456", // Would be actual sender in real implementation
        receiverPhone: this.businessNumber,
        timestamp: new Date().toISOString(),
      }
    }

    return null // No transfer found
  }

  // Generate unique reference for tracking
  generateReference(planId: string): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 4)
    return `AH${planId.toUpperCase()}${timestamp}${random}`.toUpperCase()
  }

  // Validate Ghana phone number
  validateGhanaPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\s/g, "")
    const phoneRegex = /^(233[0-9]{9}|0[0-9]{9})$/
    return phoneRegex.test(cleanPhone)
  }

  // Format phone number to standard format
  formatGhanaPhone(phone: string): string {
    const cleanPhone = phone.replace(/\s/g, "")
    if (cleanPhone.startsWith("233")) {
      return cleanPhone
    }
    if (cleanPhone.startsWith("0")) {
      return `233${cleanPhone.substring(1)}`
    }
    return cleanPhone
  }
}

export function getSubscriptionStatus(): {
  isSubscribed: boolean
  plan: string | null
  expiresAt: Date | null
} {
  if (typeof window === "undefined") {
    return { isSubscribed: false, plan: null, expiresAt: null }
  }

  try {
    const subscription = localStorage.getItem("aerohealth-subscription")
    if (subscription) {
      const data = JSON.parse(subscription)
      const expiresAt = new Date(data.expiresAt)
      const isSubscribed = expiresAt > new Date()

      return {
        isSubscribed,
        plan: isSubscribed ? data.plan : null,
        expiresAt: isSubscribed ? expiresAt : null,
      }
    }
  } catch (error) {
    console.error("Error reading subscription status:", error)
  }

  return { isSubscribed: false, plan: null, expiresAt: null }
}

export function saveSubscription(plan: string, duration: number, transactionId: string): void {
  if (typeof window === "undefined") return

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + duration)

  const subscription = {
    plan,
    subscribedAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    transactionId,
  }

  localStorage.setItem("aerohealth-subscription", JSON.stringify(subscription))
}

// Store pending payment for verification
export function storePendingPayment(reference: string, planId: string, amount: number, senderPhone: string): void {
  if (typeof window === "undefined") return

  const pendingPayment = {
    reference,
    planId,
    amount,
    senderPhone,
    timestamp: new Date().toISOString(),
  }

  localStorage.setItem("aerohealth-pending-payment", JSON.stringify(pendingPayment))
}

export function getPendingPayment(): {
  reference: string
  planId: string
  amount: number
  senderPhone: string
  timestamp: string
} | null {
  if (typeof window === "undefined") return null

  try {
    const pending = localStorage.getItem("aerohealth-pending-payment")
    return pending ? JSON.parse(pending) : null
  } catch {
    return null
  }
}

export function clearPendingPayment(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("aerohealth-pending-payment")
}
