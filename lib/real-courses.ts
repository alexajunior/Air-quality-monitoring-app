export interface RealCourse {
  id: string
  title: string
  description: string
  provider: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  category: "health" | "environment" | "protection"
  price: number
  enrollmentUrl: string
  imageUrl: string
  rating: number
  students: number
  certificate: boolean
}

export const REAL_COURSES: RealCourse[] = [
  {
    id: "alison-1",
    title: "Introduction to Environmental Health",
    description:
      "Learn the fundamentals of environmental health, air quality monitoring, and pollution control measures.",
    provider: "Alison",
    duration: "2-3 hours",
    level: "beginner",
    category: "health",
    price: 0,
    enrollmentUrl: "https://alison.com/course/introduction-to-environmental-health",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    students: 15420,
    certificate: true,
  },
  {
    id: "alison-2",
    title: "Air Pollution and Public Health",
    description: "Comprehensive course on air pollution sources, health impacts, and prevention strategies.",
    provider: "Alison",
    duration: "3-4 hours",
    level: "intermediate",
    category: "health",
    price: 0,
    enrollmentUrl: "https://alison.com/course/air-pollution-and-public-health",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    students: 8930,
    certificate: true,
  },
  {
    id: "coursera-1",
    title: "Environmental Health: the Foundation of Global Public Health",
    description: "Yale University course covering environmental factors affecting human health including air quality.",
    provider: "Coursera",
    duration: "4 weeks",
    level: "intermediate",
    category: "health",
    price: 49,
    enrollmentUrl: "https://www.coursera.org/learn/environmental-health",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    students: 12500,
    certificate: true,
  },
  {
    id: "edx-1",
    title: "Air Quality Management",
    description: "Learn air quality monitoring techniques, data analysis, and management strategies.",
    provider: "edX",
    duration: "6 weeks",
    level: "advanced",
    category: "environment",
    price: 99,
    enrollmentUrl: "https://www.edx.org/course/air-quality-management",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    students: 6780,
    certificate: true,
  },
  {
    id: "alison-3",
    title: "Personal Protective Equipment in Healthcare",
    description: "Essential training on using masks, respirators, and other protective equipment effectively.",
    provider: "Alison",
    duration: "1-2 hours",
    level: "beginner",
    category: "protection",
    price: 0,
    enrollmentUrl: "https://alison.com/course/personal-protective-equipment-healthcare",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rating: 4.4,
    students: 22100,
    certificate: true,
  },
  {
    id: "futurelearn-1",
    title: "Climate Change and Health",
    description: "Explore the health impacts of climate change including air quality and respiratory health.",
    provider: "FutureLearn",
    duration: "3 weeks",
    level: "intermediate",
    category: "environment",
    price: 39,
    enrollmentUrl: "https://www.futurelearn.com/courses/climate-change-health",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    students: 9450,
    certificate: true,
  },
]
