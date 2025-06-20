"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Search, Clock, Users, Star, ExternalLink, BookOpen, Shield, Award } from "lucide-react"
import { REAL_COURSES, type RealCourse } from "@/lib/real-courses"

const levelColors = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
}

const categoryIcons = {
  health: Shield,
  environment: BookOpen,
  protection: Shield,
}

const providerColors = {
  Alison: "bg-blue-50 text-blue-700 border-blue-200",
  Coursera: "bg-purple-50 text-purple-700 border-purple-200",
  edX: "bg-green-50 text-green-700 border-green-200",
  FutureLearn: "bg-orange-50 text-orange-700 border-orange-200",
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProvider, setSelectedProvider] = useState<string>("")

  const filteredCourses = REAL_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    const matchesCategory = !selectedCategory || course.category === selectedCategory
    const matchesProvider = !selectedProvider || course.provider === selectedProvider
    return matchesSearch && matchesLevel && matchesCategory && matchesProvider
  })

  const handleEnroll = (course: RealCourse) => {
    window.open(course.enrollmentUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <GraduationCap className="h-8 w-8 text-teal-600" />
              </div>
              Professional Health Courses
            </h1>
            <p className="text-gray-600 mt-2">
              Learn from top universities and institutions - Real courses with certificates
            </p>
          </div>
          <Badge className="bg-teal-100 text-teal-700 border-teal-300">Accessible Certification</Badge>
        </div>

        {/* Search and Filters */}
        <Card className="border-teal-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="Alison">Alison</SelectItem>
                  <SelectItem value="Coursera">Coursera</SelectItem>
                  <SelectItem value="edX">edX</SelectItem>
                  <SelectItem value="FutureLearn">FutureLearn</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="protection">Protection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Course */}
        {filteredCourses.length > 0 && (
          <Card className="overflow-hidden border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="md:flex">
              <div className="md:w-1/3 p-6">
                <img
                  src={filteredCourses[0].imageUrl || "/placeholder.svg"}
                  alt={filteredCourses[0].title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-teal-100 text-teal-700 border-teal-300">Featured Course</Badge>
                  <Badge className={providerColors[filteredCourses[0].provider as keyof typeof providerColors]}>
                    {filteredCourses[0].provider}
                  </Badge>
                  <Badge className={levelColors[filteredCourses[0].level]}>
                    {filteredCourses[0].level.charAt(0).toUpperCase() + filteredCourses[0].level.slice(1)}
                  </Badge>
                  {filteredCourses[0].certificate && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      <Award className="h-3 w-3 mr-1" />
                      Certificate
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{filteredCourses[0].title}</h2>
                <p className="text-gray-600 mb-4">{filteredCourses[0].description}</p>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {filteredCourses[0].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {filteredCourses[0].students.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    {filteredCourses[0].rating}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handleEnroll(filteredCourses[0])}
                    className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {filteredCourses[0].price === 0 ? "Enroll Free" : `Enroll for $${filteredCourses[0].price}`}
                  </Button>
                  {filteredCourses[0].price === 0 && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">FREE</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(1).map((course) => {
            const CategoryIcon = categoryIcons[course.category]
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border-teal-100">
                <div className="aspect-video relative">
                  <img
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={levelColors[course.level]}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                    {course.price === 0 && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">FREE</Badge>
                    )}
                  </div>
                  {course.certificate && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                        <Award className="h-3 w-3" />
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={providerColors[course.provider as keyof typeof providerColors]}>
                      {course.provider}
                    </Badge>
                    <CategoryIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 capitalize">{course.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.students.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900">
                      {course.price === 0 ? "FREE" : `$${course.price}`}
                    </div>
                    {course.certificate && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">Certificate</Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => handleEnroll(course)}
                    className="w-full flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Learning Path */}
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <GraduationCap className="h-5 w-5" />
              Recommended Learning Path for Ghana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1
                </div>
                <h3 className="font-semibold text-emerald-900 mb-1">Start with Basics</h3>
                <p className="text-sm text-emerald-800">
                  Begin with "Introduction to Environmental Health" (Free on Alison)
                </p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200 text-center">
                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  2
                </div>
                <h3 className="font-semibold text-teal-900 mb-1">Deepen Knowledge</h3>
                <p className="text-sm text-teal-800">
                  Take "Air Pollution and Public Health" for Ghana-specific insights
                </p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200 text-center">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3
                </div>
                <h3 className="font-semibold text-cyan-900 mb-1">Advanced Protection</h3>
                <p className="text-sm text-cyan-800">Master "Personal Protective Equipment" for daily protection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
