export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const API_KEY = '4b4fd59b29bcea765d85372cd46398b2';
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Search locations by query using OpenWeather Direct Geocoding API
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const url = `${BASE_URL}/direct?q=${encodeURIComponent(query.trim())}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

/**
 * Get location name by latitude and longitude using OpenWeather Reverse Geocoding API
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Reverse Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      // Format return string. If state is present, include it.
      const parts = [item.name];
      if (item.state) parts.push(item.state);
      parts.push(item.country);
      return parts.join(', ');
    }

    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
}
