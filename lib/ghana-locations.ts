export interface GhanaLocation {
  name: string
  type: "region" | "district" | "municipality" | "community"
  region: string
  lat: number
  lon: number
  population?: number
  tz: string
}

export const GHANA_LOCATIONS: GhanaLocation[] = [
  // Greater Accra Region
  {
    name: "Accra",
    type: "municipality",
    region: "Greater Accra",
    lat: 5.6037,
    lon: -0.187,
    population: 2291000,
    tz: "Africa/Accra",
  },
  {
    name: "Tema",
    type: "municipality",
    region: "Greater Accra",
    lat: 5.6698,
    lon: 0.0166,
    population: 402637,
    tz: "Africa/Accra",
  },
  {
    name: "Madina",
    type: "community",
    region: "Greater Accra",
    lat: 5.6847,
    lon: -0.1676,
    population: 137162,
    tz: "Africa/Accra",
  },
  {
    name: "Kasoa",
    type: "community",
    region: "Greater Accra",
    lat: 5.5333,
    lon: -0.4167,
    population: 69649,
    tz: "Africa/Accra",
  },
  {
    name: "Ashaiman",
    type: "municipality",
    region: "Greater Accra",
    lat: 5.6947,
    lon: 0.0333,
    population: 190972,
    tz: "Africa/Accra",
  },
  {
    name: "Teshie",
    type: "community",
    region: "Greater Accra",
    lat: 5.5833,
    lon: -0.1,
    population: 171875,
    tz: "Africa/Accra",
  },
  {
    name: "Nungua",
    type: "community",
    region: "Greater Accra",
    lat: 5.6,
    lon: -0.0833,
    population: 84119,
    tz: "Africa/Accra",
  },
  {
    name: "Dansoman",
    type: "community",
    region: "Greater Accra",
    lat: 5.5333,
    lon: -0.2667,
    population: 127539,
    tz: "Africa/Accra",
  },

  // Ashanti Region
  {
    name: "Kumasi",
    type: "municipality",
    region: "Ashanti",
    lat: 6.6885,
    lon: -1.6244,
    population: 3348000,
    tz: "Africa/Accra",
  },
  {
    name: "Obuasi",
    type: "municipality",
    region: "Ashanti",
    lat: 6.2028,
    lon: -1.6703,
    population: 175043,
    tz: "Africa/Accra",
  },
  {
    name: "Ejisu",
    type: "district",
    region: "Ashanti",
    lat: 6.7333,
    lon: -1.3667,
    population: 143762,
    tz: "Africa/Accra",
  },
  {
    name: "Mampong",
    type: "municipality",
    region: "Ashanti",
    lat: 7.0667,
    lon: -1.4,
    population: 88528,
    tz: "Africa/Accra",
  },
  {
    name: "Konongo",
    type: "community",
    region: "Ashanti",
    lat: 6.6167,
    lon: -1.2167,
    population: 41238,
    tz: "Africa/Accra",
  },
  {
    name: "Bekwai",
    type: "municipality",
    region: "Ashanti",
    lat: 6.4667,
    lon: -1.5833,
    population: 118024,
    tz: "Africa/Accra",
  },

  // Northern Region
  {
    name: "Tamale",
    type: "municipality",
    region: "Northern",
    lat: 9.4008,
    lon: -0.8393,
    population: 950000,
    tz: "Africa/Accra",
  },
  {
    name: "Yendi",
    type: "municipality",
    region: "Northern",
    lat: 9.4425,
    lon: -0.0108,
    population: 117781,
    tz: "Africa/Accra",
  },
  {
    name: "Savelugu",
    type: "municipality",
    region: "Northern",
    lat: 9.6333,
    lon: -0.8333,
    population: 129283,
    tz: "Africa/Accra",
  },
  {
    name: "Gushegu",
    type: "district",
    region: "Northern",
    lat: 10.0667,
    lon: -0.3667,
    population: 141360,
    tz: "Africa/Accra",
  },

  // Western Region
  {
    name: "Sekondi-Takoradi",
    type: "municipality",
    region: "Western",
    lat: 4.9333,
    lon: -1.7667,
    population: 445205,
    tz: "Africa/Accra",
  },
  {
    name: "Tarkwa",
    type: "municipality",
    region: "Western",
    lat: 5.3,
    lon: -1.9833,
    population: 56365,
    tz: "Africa/Accra",
  },
  {
    name: "Axim",
    type: "community",
    region: "Western",
    lat: 4.8667,
    lon: -2.2333,
    population: 27719,
    tz: "Africa/Accra",
  },
  {
    name: "Half Assini",
    type: "community",
    region: "Western",
    lat: 4.9833,
    lon: -2.6167,
    population: 28870,
    tz: "Africa/Accra",
  },

  // Central Region
  {
    name: "Cape Coast",
    type: "municipality",
    region: "Central",
    lat: 5.1053,
    lon: -1.2466,
    population: 169894,
    tz: "Africa/Accra",
  },
  {
    name: "Elmina",
    type: "community",
    region: "Central",
    lat: 5.0833,
    lon: -1.35,
    population: 33576,
    tz: "Africa/Accra",
  },
  {
    name: "Winneba",
    type: "municipality",
    region: "Central",
    lat: 5.35,
    lon: -0.6167,
    population: 62016,
    tz: "Africa/Accra",
  },
  {
    name: "Kasoa",
    type: "municipality",
    region: "Central",
    lat: 5.5333,
    lon: -0.4167,
    population: 69649,
    tz: "Africa/Accra",
  },

  // Eastern Region
  {
    name: "Koforidua",
    type: "municipality",
    region: "Eastern",
    lat: 6.0833,
    lon: -0.25,
    population: 183727,
    tz: "Africa/Accra",
  },
  {
    name: "Akosombo",
    type: "community",
    region: "Eastern",
    lat: 6.25,
    lon: 0.05,
    population: 26963,
    tz: "Africa/Accra",
  },
  {
    name: "Nkawkaw",
    type: "municipality",
    region: "Eastern",
    lat: 6.55,
    lon: -0.7667,
    population: 61785,
    tz: "Africa/Accra",
  },
  {
    name: "Akim Oda",
    type: "municipality",
    region: "Eastern",
    lat: 5.9333,
    lon: -0.9833,
    population: 61359,
    tz: "Africa/Accra",
  },

  // Volta Region
  { name: "Ho", type: "municipality", region: "Volta", lat: 6.6, lon: 0.4667, population: 180420, tz: "Africa/Accra" },
  {
    name: "Keta",
    type: "municipality",
    region: "Volta",
    lat: 5.9167,
    lon: 0.9833,
    population: 147618,
    tz: "Africa/Accra",
  },
  {
    name: "Hohoe",
    type: "municipality",
    region: "Volta",
    lat: 7.15,
    lon: 0.4667,
    population: 202423,
    tz: "Africa/Accra",
  },

  // Upper East Region
  {
    name: "Bolgatanga",
    type: "municipality",
    region: "Upper East",
    lat: 10.7856,
    lon: -0.8506,
    population: 131550,
    tz: "Africa/Accra",
  },
  {
    name: "Navrongo",
    type: "municipality",
    region: "Upper East",
    lat: 10.8958,
    lon: -1.0944,
    population: 27306,
    tz: "Africa/Accra",
  },
  {
    name: "Bawku",
    type: "municipality",
    region: "Upper East",
    lat: 11.0667,
    lon: -0.2333,
    population: 104212,
    tz: "Africa/Accra",
  },

  // Upper West Region
  {
    name: "Wa",
    type: "municipality",
    region: "Upper West",
    lat: 10.0606,
    lon: -2.5,
    population: 124414,
    tz: "Africa/Accra",
  },
  {
    name: "Lawra",
    type: "district",
    region: "Upper West",
    lat: 10.65,
    lon: -2.9,
    population: 100929,
    tz: "Africa/Accra",
  },

  // Brong-Ahafo Region
  {
    name: "Sunyani",
    type: "municipality",
    region: "Brong-Ahafo",
    lat: 7.3333,
    lon: -2.3333,
    population: 248496,
    tz: "Africa/Accra",
  },
  {
    name: "Techiman",
    type: "municipality",
    region: "Brong-Ahafo",
    lat: 7.5833,
    lon: -1.9333,
    population: 206856,
    tz: "Africa/Accra",
  },
  {
    name: "Berekum",
    type: "municipality",
    region: "Brong-Ahafo",
    lat: 7.45,
    lon: -2.5833,
    population: 129628,
    tz: "Africa/Accra",
  },
]

export function getGhanaRegions(): string[] {
  return Array.from(new Set(GHANA_LOCATIONS.map((location) => location.region)))
}

export function getLocationsByRegion(region: string): GhanaLocation[] {
  return GHANA_LOCATIONS.filter((location) => location.region === region)
}

export function getAllGhanaLocations(): string[] {
  return GHANA_LOCATIONS.map((location) => `${location.name}, ${location.region}`)
}
