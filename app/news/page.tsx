"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Newspaper, Search, ExternalLink, Calendar, Heart, Leaf, FlaskConical, Scale, TrendingUp } from "lucide-react"
import type { NewsArticle } from "@/lib/air-quality-utils"

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Ghana Reports 28,000 Premature Deaths from Air Pollution Annually",
    summary:
      "New health ministry data reveals the devastating impact of air pollution in Ghana, highlighting the urgent need for real-time monitoring solutions like AeroHealth.",
    url: "#",
    publishedAt: "2024-01-20T10:00:00Z",
    category: "health",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Global Air Pollution Crisis: 7 Million Deaths Annually",
    summary:
      "WHO reports that 7 million people die prematurely each year due to air pollution, making real-time monitoring critical for public health protection.",
    url: "#",
    publishedAt: "2024-01-19T14:30:00Z",
    category: "research",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Air Quality Solutions Market to Reach $12.3B by 2034",
    summary:
      "Industry forecasts show massive growth in air quality monitoring solutions, driven by increasing health awareness and technological advances.",
    url: "#",
    publishedAt: "2024-01-18T09:15:00Z",
    category: "policy",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Real-Time Health Monitoring: The Future of Air Quality Management",
    summary:
      "How innovative apps like AeroHealth are revolutionizing personal health protection through accessible, real-time air quality data.",
    url: "#",
    publishedAt: "2024-01-17T16:45:00Z",
    category: "environment",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "Improved Health Outcomes Through Air Quality Awareness",
    summary:
      "Studies show that individuals with access to real-time air quality data make better health decisions and experience fewer pollution-related symptoms.",
    url: "#",
    publishedAt: "2024-01-16T11:20:00Z",
    category: "health",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "Sustainable Growth in Health-Tech Certification Programs",
    summary:
      "The success of platforms like TimedTech demonstrates growing demand for accessible health and technology education programs.",
    url: "#",
    publishedAt: "2024-01-15T13:10:00Z",
    category: "research",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

const categoryIcons = {
  health: Heart,
  environment: Leaf,
  research: FlaskConical,
  policy: Scale,
}

const categoryColors = {
  health: "bg-red-50 text-red-700 border-red-200",
  environment: "bg-emerald-50 text-emerald-700 border-emerald-200",
  research: "bg-teal-50 text-teal-700 border-teal-200",
  policy: "bg-cyan-50 text-cyan-700 border-cyan-200",
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [news] = useState<NewsArticle[]>(mockNews)

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Newspaper className="h-8 w-8 text-teal-600" />
              </div>
              News & Health Resources
            </h1>
            <p className="text-gray-600 mt-2">
              Stay informed about air quality research, health insights, and real-time monitoring solutions
            </p>
          </div>
          <Badge className="bg-teal-100 text-teal-700 border-teal-300">Real-Time Health Insights</Badge>
        </div>

        {/* Search and Filters */}
        <Card className="border-teal-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search health articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Article */}
        {filteredNews.length > 0 && (
          <Card className="overflow-hidden border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={filteredNews[0].imageUrl || "/placeholder.svg"}
                  alt={filteredNews[0].title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={categoryColors[filteredNews[0].category]}>
                    {filteredNews[0].category.charAt(0).toUpperCase() + filteredNews[0].category.slice(1)}
                  </Badge>
                  <Badge className="bg-teal-100 text-teal-700 border-teal-300">Featured</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(filteredNews[0].publishedAt).toLocaleDateString()}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{filteredNews[0].title}</h2>
                <p className="text-gray-600 mb-4">{filteredNews[0].summary}</p>
                <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
                  Read Full Article
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(1).map((article) => {
            const CategoryIcon = categoryIcons[article.category]
            return (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow border-teal-100">
                <div className="aspect-video relative">
                  <img
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={categoryColors[article.category]}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    Read More
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Health Tips Section */}
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Heart className="h-5 w-5 text-red-500" />
              Real-Time Health Insights
              <Badge className="bg-teal-100 text-teal-700 border-teal-300">Improved Health Outcomes</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-2">Morning Health Check</h3>
                <p className="text-sm text-teal-800">
                  Use AeroHealth to check real-time air quality before opening windows. Optimal ventilation times are
                  typically 6-8 AM when pollution levels are lower.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="font-semibold text-emerald-900 mb-2">Smart Exercise Planning</h3>
                <p className="text-sm text-emerald-800">
                  Avoid outdoor exercise when AQI {"> 100"}. Use real-time monitoring to choose indoor alternatives or
                  exercise during cleaner air periods.
                </p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <h3 className="font-semibold text-cyan-900 mb-2">Indoor Air Protection</h3>
                <p className="text-sm text-cyan-800">
                  Monitor indoor air quality with AeroHealth. Use HEPA air purifiers and keep windows closed during high
                  pollution alerts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <TrendingUp className="h-5 w-5" />
              AeroHealth Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Real-Time Health Insights</h3>
                <p className="text-sm text-gray-600">Instant air quality data for better health decisions</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <FlaskConical className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Accessible Certification</h3>
                <p className="text-sm text-gray-600">Professional health-tech training and courses</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Improved Health Outcomes</h3>
                <p className="text-sm text-gray-600">Better health through informed air quality awareness</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Sustainable Growth</h3>
                <p className="text-sm text-gray-600">Long-term health protection and skill development</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
