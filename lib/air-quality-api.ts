// Air Quality API integration with OpenWeatherMap
export interface AirQualityData {
  current: {
    location: string
    coordinates: {
      lat: number
      lon: number
    }
    aqi: number
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
    temperature: number
    humidity: number
    windSpeed: number
    visibility: number
    lastUpdated: string
  }
  hourly: Array<{
    time: string
    aqi: number
    pm25: number
    pm10: number
    o3: number
  }>
  weekly: Array<{
    day: string
    aqi: number
    pm25: number
    pm10: number
  }>
}

// OpenWeatherMap API interfaces
interface OpenWeatherAirPollution {
  coord: {
    lon: number
    lat: number
  }
  list: Array<{
    dt: number
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}

interface OpenWeatherCurrent {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  name: string
  country?: string
}

interface GeocodeResult {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "demo_key"
const BASE_URL = "https://api.openweathermap.org"

// Geocoding to get coordinates from location name
export async function geocodeLocation(locationName: string): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`)
    }

    const data: GeocodeResult[] = await response.json()
    return data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

// Get current air pollution data
export async function getCurrentAirPollution(lat: number, lon: number): Promise<OpenWeatherAirPollution | null> {
  try {
    const response = await fetch(`${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`Air pollution API failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Air pollution API error:", error)
    return null
  }
}

// Get historical air pollution data (last 24 hours)
export async function getHistoricalAirPollution(lat: number, lon: number): Promise<OpenWeatherAirPollution | null> {
  try {
    const end = Math.floor(Date.now() / 1000)
    const start = end - 24 * 60 * 60 // 24 hours ago

    const response = await fetch(
      `${BASE_URL}/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`Historical air pollution API failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Historical air pollution API error:", error)
    return null
  }
}

// Get current weather data
export async function getCurrentWeather(lat: number, lon: number): Promise<OpenWeatherCurrent | null> {
  try {
    const response = await fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Weather API error:", error)
    return null
  }
}

// Convert OpenWeatherMap AQI (1-5) to US EPA AQI (0-500)
function convertAQI(owmAqi: number, pm25: number): number {
  // OpenWeatherMap uses a 1-5 scale, we'll use PM2.5 to calculate US EPA AQI
  if (pm25 <= 12.0) return Math.round((50 / 12.0) * pm25)
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51)
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101)
  if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151)
  if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201)
  return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301)
}

// Main function to fetch all air quality data
export async function fetchAirQualityData(locationName: string): Promise<AirQualityData | null> {
  try {
    // Step 1: Get coordinates from location name
    const geocode = await geocodeLocation(locationName)
    if (!geocode) {
      throw new Error("Location not found")
    }

    // Step 2: Fetch current air pollution, historical data, and weather in parallel
    const [currentPollution, historicalPollution, currentWeather] = await Promise.all([
      getCurrentAirPollution(geocode.lat, geocode.lon),
      getHistoricalAirPollution(geocode.lat, geocode.lon),
      getCurrentWeather(geocode.lat, geocode.lon),
    ])

    if (!currentPollution || !currentWeather) {
      throw new Error("Failed to fetch air quality or weather data")
    }

    const current = currentPollution.list[0]
    const components = current.components

    // Convert units and calculate AQI
    const pm25 = Math.round(components.pm2_5)
    const aqi = convertAQI(current.main.aqi, components.pm2_5)

    // Process historical data for hourly chart
    const hourlyData =
      historicalPollution?.list.slice(-24).map((item, index) => {
        const hour = new Date(item.dt * 1000).getHours()
        return {
          time: `${hour}:00`,
          aqi: convertAQI(item.main.aqi, item.components.pm2_5),
          pm25: Math.round(item.components.pm2_5),
          pm10: Math.round(item.components.pm10),
          o3: Math.round(item.components.o3),
        }
      }) || []

    // Generate weekly data (mock for now, as OpenWeatherMap doesn't provide weekly forecasts for air quality)
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const variation = (Math.random() - 0.5) * 0.3 // ±15% variation
      return {
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        aqi: Math.round(aqi * (1 + variation)),
        pm25: Math.round(pm25 * (1 + variation)),
        pm10: Math.round(components.pm10 * (1 + variation)),
      }
    })

    const locationDisplay = geocode.state
      ? `${geocode.name}, ${geocode.state}, ${geocode.country}`
      : `${geocode.name}, ${geocode.country}`

    return {
      current: {
        location: locationDisplay,
        coordinates: {
          lat: geocode.lat,
          lon: geocode.lon,
        },
        aqi,
        pm25,
        pm10: Math.round(components.pm10),
        o3: Math.round(components.o3),
        no2: Math.round(components.no2),
        so2: Math.round(components.so2),
        co: Math.round(components.co),
        temperature: Math.round(currentWeather.main.temp),
        humidity: currentWeather.main.humidity,
        windSpeed: Math.round(currentWeather.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(currentWeather.visibility / 1000), // Convert m to km
        lastUpdated: new Date().toLocaleTimeString(),
      },
      hourly: hourlyData,
      weekly: weeklyData,
    }
  } catch (error) {
    console.error("Error fetching air quality data:", error)
    return null
  }
}

// Get user's current location
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    })
  })
}

// Reverse geocoding to get location name from coordinates
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`)
    }

    const data: GeocodeResult[] = await response.json()
    if (data.length > 0) {
      const location = data[0]
      return location.state
        ? `${location.name}, ${location.state}, ${location.country}`
        : `${location.name}, ${location.country}`
    }

    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  }
}
