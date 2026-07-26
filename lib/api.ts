import axios, { AxiosInstance } from 'axios';
import { EnvironmentalData, LocationData } from '../types/env';

/**
 * API Integration Module
 * Handles fetching environmental data from external APIs
 * Combines weather data, air quality data, and generates hourly trends
 */

const apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Mock data generator for development
 * Replace with real API calls when credentials are available
 */
const generateMockEnvironmentalData = (
  lat: number,
  lon: number,
  name: string,
  country: string
): EnvironmentalData => {
  const now = new Date();
  const hourlyTrends = {
    time: Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 3600000);
      return hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }),
    aqi: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200) + 20),
    temp: Array.from({ length: 24 }, () => Math.floor(Math.random() * 15) + 15),
    uv: Array.from({ length: 24 }, () => Math.floor(Math.random() * 12)),
    wind: Array.from({ length: 24 }, () => Math.floor(Math.random() * 25) + 5)
  };

  const aqi = Math.floor(Math.random() * 200) + 20;

  return {
    location: {
      name,
      country,
      lat,
      lon
    },
    weather: {
      temp: Math.floor(Math.random() * 30) + 10,
      humidity: Math.floor(Math.random() * 40) + 40,
      pressure: Math.floor(Math.random() * 50) + 1000,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windDirection: Math.floor(Math.random() * 360),
      uvIndex: Math.floor(Math.random() * 11)
    },
    airQuality: {
      aqi,
      pm2_5: Math.floor(Math.random() * 100) + 10,
      pm10: Math.floor(Math.random() * 150) + 20,
      co: Math.floor(Math.random() * 3) + 0.5,
      no2: Math.floor(Math.random() * 80) + 10,
      so2: Math.floor(Math.random() * 40) + 5,
      o3: Math.floor(Math.random() * 150) + 50
    },
    riskLevel:
      aqi < 50 ? 'Safe' : aqi < 100 ? 'Moderate' : aqi < 150 ? 'Poor' : 'Hazardous',
    hourlyTrends
  };
};

/**
 * Fetches environmental data for a given location
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param name - Location name
 * @param country - Country name
 * @returns Promise resolving to EnvironmentalData
 */
export const fetchEnvironmentalData = async (
  lat: number,
  lon: number,
  name: string,
  country: string
): Promise<EnvironmentalData> => {
  try {
    // TODO: Replace with real API calls
    // Example: OpenWeatherMap API, IQAir API, or other environmental data providers
    
    console.log(
      `Fetching environmental data for ${name}, ${country} (${lat}, ${lon})`
    );

    // For now, return mock data
    // In production, integrate with APIs like:
    // - OpenWeatherMap (weather data)
    // - IQAir or OpenAQ (air quality data)
    // - NOAA (weather trends)
    
    return generateMockEnvironmentalData(lat, lon, name, country);
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    // Return mock data as fallback
    return generateMockEnvironmentalData(lat, lon, name, country);
  }
};

/**
 * Reverse geocoding: Get location name from coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Promise resolving to location name and country
 */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<{ name: string; country: string }> => {
  try {
    // TODO: Integrate with geocoding API (e.g., Nominatim, Google Maps, etc.)
    console.log(`Reverse geocoding coordinates: ${lat}, ${lon}`);

    // Mock response
    return {
      name: 'Current Location',
      country: 'Unknown'
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      name: 'Current Location',
      country: 'Unknown'
    };
  }
};

/**
 * Search for locations by name
 * @param query - Search query
 * @returns Promise resolving to array of LocationData
 */
export const searchLocations = async (query: string): Promise<LocationData[]> => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    // TODO: Integrate with geocoding API (e.g., Nominatim, Google Maps, etc.)
    console.log(`Searching locations for: ${query}`);

    // Mock response - replace with real API call
    const mockLocations: LocationData[] = [
      {
        name: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278
      },
      {
        name: 'New York',
        country: 'United States',
        lat: 40.7128,
        lon: -74.006
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        lat: 35.6762,
        lon: 139.6503
      },
      {
        name: 'Delhi',
        country: 'India',
        lat: 28.7041,
        lon: 77.1025
      },
      {
        name: 'Sydney',
        country: 'Australia',
        lat: -33.8688,
        lon: 151.2093
      }
    ];

    return mockLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.country.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export default apiClient;
