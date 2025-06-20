export interface RealProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: "masks" | "purifiers" | "monitors" | "supplements"
  brand: string
  purchaseUrl: string
  imageUrl: string
  rating: number
  reviews: number
  inStock: boolean
  features: string[]
  shipping: string
}

export const REAL_PRODUCTS: RealProduct[] = [
  {
    id: "amazon-1",
    name: "LEVOIT Air Purifier for Home",
    description: "True HEPA filter air purifier for large rooms up to 1095 sq ft, removes 99.97% of particles.",
    price: 199.99,
    originalPrice: 249.99,
    category: "purifiers",
    brand: "LEVOIT",
    purchaseUrl: "https://www.amazon.com/dp/B08131HFPX",
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 15420,
    inStock: true,
    features: ["True HEPA Filter", "Smart WiFi Control", "Air Quality Monitor", "Sleep Mode"],
    shipping: "Free shipping",
  },
  {
    id: "amazon-2",
    name: "3M N95 Respirator Masks (20-Pack)",
    description: "NIOSH-approved N95 masks providing 95% filtration efficiency against airborne particles.",
    price: 45.99,
    category: "masks",
    brand: "3M",
    purchaseUrl: "https://www.amazon.com/dp/B08QTDX8JZ",
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 8930,
    inStock: true,
    features: ["NIOSH Approved", "95% Filtration", "Comfortable Fit", "Individual Packaging"],
    shipping: "Free shipping",
  },
  {
    id: "amazon-3",
    name: "PurpleAir PA-II-SD Air Quality Monitor",
    description: "Real-time air quality monitoring with PM2.5, PM10 sensors and WiFi connectivity.",
    price: 279.0,
    category: "monitors",
    brand: "PurpleAir",
    purchaseUrl: "https://www.amazon.com/dp/B08R3QNH8D",
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 2340,
    inStock: true,
    features: ["Real-time Monitoring", "WiFi Connectivity", "Mobile App", "Weather Resistant"],
    shipping: "Free shipping",
  },
  {
    id: "iherb-1",
    name: "Now Foods Lung Support Supplement",
    description: "Natural lung support supplement with antioxidants, quercetin, and respiratory herbs.",
    price: 24.99,
    originalPrice: 32.99,
    category: "supplements",
    brand: "Now Foods",
    purchaseUrl: "https://www.iherb.com/pr/now-foods-lung-support-90-veg-capsules/70122",
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 1250,
    inStock: true,
    features: ["Natural Ingredients", "Antioxidant Support", "90 Capsules", "Third-party Tested"],
    shipping: "Free shipping over $40",
  },
  {
    id: "amazon-4",
    name: "Honeywell HPA300 True HEPA Air Purifier",
    description: "Large room air purifier for spaces up to 465 sq ft, captures 99.97% of particles.",
    price: 249.99,
    originalPrice: 299.99,
    category: "purifiers",
    brand: "Honeywell",
    purchaseUrl: "https://www.amazon.com/dp/B00BWYO53G",
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 12800,
    inStock: true,
    features: ["True HEPA Filter", "Turbo Clean Setting", "Energy Star Certified", "5-Year Warranty"],
    shipping: "Free shipping",
  },
  {
    id: "amazon-5",
    name: "KN95 Face Masks (50-Pack)",
    description: "5-layer protection KN95 masks with comfortable ear loops and adjustable nose bridge.",
    price: 29.99,
    category: "masks",
    brand: "Powecom",
    purchaseUrl: "https://www.amazon.com/dp/B08QTDX8JZ",
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 5670,
    inStock: true,
    features: ["5-Layer Protection", "Comfortable Fit", "Adjustable Nose Bridge", "CE Certified"],
    shipping: "Free shipping",
  },
]
