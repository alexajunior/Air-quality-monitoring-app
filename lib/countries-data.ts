export interface CountryData {
  name: string
  code: string
  cities: CityData[]
}

export interface CityData {
  name: string
  lat: number
  lon: number
  tz: string
  population?: number
}

export const COUNTRIES_DATA: CountryData[] = [
  {
    name: "United States",
    code: "US",
    cities: [
      { name: "New York", lat: 40.7128, lon: -74.006, tz: "America/New_York", population: 8336817 },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles", population: 3979576 },
      { name: "Chicago", lat: 41.8781, lon: -87.6298, tz: "America/Chicago", population: 2693976 },
      { name: "Houston", lat: 29.7604, lon: -95.3698, tz: "America/Chicago", population: 2320268 },
      { name: "Phoenix", lat: 33.4484, lon: -112.074, tz: "America/Phoenix", population: 1680992 },
      { name: "Philadelphia", lat: 39.9526, lon: -75.1652, tz: "America/New_York", population: 1584064 },
    ],
  },
  {
    name: "China",
    code: "CN",
    cities: [
      { name: "Beijing", lat: 39.9042, lon: 116.4074, tz: "Asia/Shanghai", population: 21540000 },
      { name: "Shanghai", lat: 31.2304, lon: 121.4737, tz: "Asia/Shanghai", population: 24870000 },
      { name: "Guangzhou", lat: 23.1291, lon: 113.2644, tz: "Asia/Shanghai", population: 15300000 },
      { name: "Shenzhen", lat: 22.5431, lon: 114.0579, tz: "Asia/Shanghai", population: 12590000 },
      { name: "Chengdu", lat: 30.5728, lon: 104.0668, tz: "Asia/Shanghai", population: 11400000 },
    ],
  },
  {
    name: "India",
    code: "IN",
    cities: [
      { name: "Mumbai", lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata", population: 20411000 },
      { name: "Delhi", lat: 28.7041, lon: 77.1025, tz: "Asia/Kolkata", population: 31400000 },
      { name: "Bangalore", lat: 12.9716, lon: 77.5946, tz: "Asia/Kolkata", population: 12340000 },
      { name: "Kolkata", lat: 22.5726, lon: 88.3639, tz: "Asia/Kolkata", population: 14850000 },
      { name: "Chennai", lat: 13.0827, lon: 80.2707, tz: "Asia/Kolkata", population: 10970000 },
    ],
  },
  {
    name: "Ghana",
    code: "GH",
    cities: [
      { name: "Accra", lat: 5.6037, lon: -0.187, tz: "Africa/Accra", population: 2291000 },
      { name: "Kumasi", lat: 6.6885, lon: -1.6244, tz: "Africa/Accra", population: 3348000 },
      { name: "Tamale", lat: 9.4008, lon: -0.8393, tz: "Africa/Accra", population: 950000 },
      { name: "Cape Coast", lat: 5.1053, lon: -1.2466, tz: "Africa/Accra", population: 169894 },
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    cities: [
      { name: "London", lat: 51.5074, lon: -0.1278, tz: "Europe/London", population: 9540000 },
      { name: "Manchester", lat: 53.4808, lon: -2.2426, tz: "Europe/London", population: 2730000 },
      { name: "Birmingham", lat: 52.4862, lon: -1.8904, tz: "Europe/London", population: 2607000 },
      { name: "Leeds", lat: 53.8008, lon: -1.5491, tz: "Europe/London", population: 1890000 },
    ],
  },
  {
    name: "Japan",
    code: "JP",
    cities: [
      { name: "Tokyo", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo", population: 37400000 },
      { name: "Osaka", lat: 34.6937, lon: 135.5023, tz: "Asia/Tokyo", population: 19300000 },
      { name: "Nagoya", lat: 35.1815, lon: 136.9066, tz: "Asia/Tokyo", population: 10110000 },
      { name: "Fukuoka", lat: 33.5904, lon: 130.4017, tz: "Asia/Tokyo", population: 2560000 },
    ],
  },
  {
    name: "Germany",
    code: "DE",
    cities: [
      { name: "Berlin", lat: 52.52, lon: 13.405, tz: "Europe/Berlin", population: 3669000 },
      { name: "Munich", lat: 48.1351, lon: 11.582, tz: "Europe/Berlin", population: 1488000 },
      { name: "Hamburg", lat: 53.5511, lon: 9.9937, tz: "Europe/Berlin", population: 1900000 },
      { name: "Frankfurt", lat: 50.1109, lon: 8.6821, tz: "Europe/Berlin", population: 753000 },
    ],
  },
  {
    name: "France",
    code: "FR",
    cities: [
      { name: "Paris", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris", population: 11020000 },
      { name: "Lyon", lat: 45.764, lon: 4.8357, tz: "Europe/Paris", population: 2280000 },
      { name: "Marseille", lat: 43.2965, lon: 5.3698, tz: "Europe/Paris", population: 1760000 },
      { name: "Toulouse", lat: 43.6047, lon: 1.4442, tz: "Europe/Paris", population: 968000 },
    ],
  },
  {
    name: "Brazil",
    code: "BR",
    cities: [
      { name: "São Paulo", lat: -23.5505, lon: -46.6333, tz: "America/Sao_Paulo", population: 22430000 },
      { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, tz: "America/Sao_Paulo", population: 13460000 },
      { name: "Brasília", lat: -15.8267, lon: -47.9218, tz: "America/Sao_Paulo", population: 3055000 },
      { name: "Salvador", lat: -12.9714, lon: -38.5014, tz: "America/Bahia", population: 2900000 },
    ],
  },
  {
    name: "Australia",
    code: "AU",
    cities: [
      { name: "Sydney", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney", population: 5312000 },
      { name: "Melbourne", lat: -37.8136, lon: 144.9631, tz: "Australia/Melbourne", population: 5078000 },
      { name: "Brisbane", lat: -27.4698, lon: 153.0251, tz: "Australia/Brisbane", population: 2560000 },
      { name: "Perth", lat: -31.9505, lon: 115.8605, tz: "Australia/Perth", population: 2140000 },
    ],
  },
  {
    name: "Canada",
    code: "CA",
    cities: [
      { name: "Toronto", lat: 43.6532, lon: -79.3832, tz: "America/Toronto", population: 6200000 },
      { name: "Montreal", lat: 45.5017, lon: -73.5673, tz: "America/Montreal", population: 4220000 },
      { name: "Vancouver", lat: 49.2827, lon: -123.1207, tz: "America/Vancouver", population: 2630000 },
      { name: "Calgary", lat: 51.0447, lon: -114.0719, tz: "America/Edmonton", population: 1390000 },
    ],
  },
]

export function getAllCities(): Array<CityData & { country: string; countryCode: string }> {
  return COUNTRIES_DATA.flatMap((country) =>
    country.cities.map((city) => ({
      ...city,
      country: country.name,
      countryCode: country.code,
    })),
  )
}

export function getCitiesByCountry(countryCode: string): CityData[] {
  return COUNTRIES_DATA.find((country) => country.code === countryCode)?.cities || []
}
