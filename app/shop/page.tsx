"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Star, Heart, Filter, Package, Shield, Wind, Activity, ExternalLink } from "lucide-react"
import { REAL_PRODUCTS, type RealProduct } from "@/lib/real-products"

const categoryIcons = {
  masks: Shield,
  purifiers: Wind,
  monitors: Activity,
  supplements: Package,
}

const categoryColors = {
  masks: "bg-teal-50 text-teal-700 border-teal-200",
  purifiers: "bg-emerald-50 text-emerald-700 border-emerald-200",
  monitors: "bg-cyan-50 text-cyan-700 border-cyan-200",
  supplements: "bg-blue-50 text-blue-700 border-blue-200",
}

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("featured")
  const [wishlist, setWishlist] = useState<string[]>([])

  const filteredProducts = REAL_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handlePurchase = (product: RealProduct) => {
    window.open(product.purchaseUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-teal-600" />
              </div>
              Air Quality Protection Shop
            </h1>
            <p className="text-gray-600 mt-2">
              Professional air quality products delivered to Ghana - Real products, real protection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2 border-teal-200 text-teal-700">
              <Heart className="h-4 w-4" />
              Wishlist ({wishlist.length})
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-teal-200">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
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
                  <SelectItem value="masks">Masks</SelectItem>
                  <SelectItem value="purifiers">Air Purifiers</SelectItem>
                  <SelectItem value="monitors">Monitors</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const CategoryIcon = categoryIcons[product.category]
            const isInWishlist = wishlist.includes(product.id)

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-teal-100">
                <div className="aspect-square relative">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={categoryColors[product.category]}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-red-100 text-red-700 border-red-300">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs">{product.brand}</Badge>
                    <Badge className="bg-teal-100 text-teal-700 border-teal-300 text-xs">{product.shipping}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                        <div className="w-1 h-1 bg-teal-400 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-gray-900">${product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                      )}
                    </div>
                    {product.inStock && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">In Stock</Badge>
                    )}
                  </div>

                  <Button
                    className="w-full flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                    disabled={!product.inStock}
                    onClick={() => handlePurchase(product)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {product.inStock ? "Buy Now" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Categories Overview */}
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Filter className="h-5 w-5" />
              Shop by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(categoryIcons).map(([category, Icon]) => {
                const productCount = REAL_PRODUCTS.filter((p) => p.category === category).length
                return (
                  <div
                    key={category}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${categoryColors[category as keyof typeof categoryColors]}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <Icon className="h-8 w-8 mb-2" />
                    <h3 className="font-semibold mb-1 capitalize">{category}</h3>
                    <p className="text-sm opacity-80">{productCount} products</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info for Ghana */}
        <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-teal-800">Shipping to Ghana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <Package className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-600">5-10 business days to major cities</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <Shield className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">Safe checkout with international cards</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg border border-teal-200">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Local Support</h3>
                <p className="text-sm text-gray-600">Customer service in Ghana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
