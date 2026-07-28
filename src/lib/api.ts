import { EnvironmentalData, LocationData, RiskLevel } from '../types/env';

function calculateRiskLevel(aqi: number): RiskLevel {
  if (aqi <= 50) return 'Safe';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  return 'Hazardous';
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    id: `${r.latitude}-${r.longitude}`,
    name: r.name,
    country: r.country || '',
    lat: r.latitude,
    lon: r.longitude
  }));
}

export async function fetchEnvironmentalData(lat: number, lon: number, locationName = 'Selected Location', country = ''): Promise<EnvironmentalData> {
  const [weatherRes, aqRes] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,apparent_temperature&hourly=temperature_2m,wind_speed_10m,uv_index,apparent_temperature&forecast_days=1`),
    fetch(`https://air-quality-api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi&forecast_days=1`)
  ]);

  const weather = await weatherRes.json();
  const aq = await aqRes.json();

  const currentAq = aq.current || {};
  const currentW = weather.current || {};
  const aqiVal = Math.round(currentAq.us_aqi || 0);

  const times = (weather.hourly?.time || []).map((t: string) => t.split('T')[1]);

  return {
    location: { name: locationName, country, lat, lon },
    weather: {
      temp: Math.round(currentW.temperature_2m || 0),
      humidity: Math.round(currentW.relative_humidity_2m || 0),
      pressure: Math.round(currentW.surface_pressure || 0),
      windSpeed: Math.round(currentW.wind_speed_10m || 0),
      windDirection: Math.round(currentW.wind_direction_10m || 0),
      uvIndex: Math.round(currentW.uv_index || 0),
      heatIndex: Math.round(currentW.apparent_temperature || currentW.temperature_2m || 0),
    },
    airQuality: {
      aqi: aqiVal,
      pm2_5: Math.round(currentAq.pm2_5 || 0),
      pm10: Math.round(currentAq.pm10 || 0),
      co: Math.round(currentAq.carbon_monoxide || 0),
      no2: Math.round(currentAq.nitrogen_dioxide || 0),
      so2: Math.round(currentAq.sulphur_dioxide || 0),
      o3: Math.round(currentAq.ozone || 0),
    },
    riskLevel: calculateRiskLevel(aqiVal),
    hourlyTrends: {
      time: times,
      aqi: aq.hourly?.us_aqi || [],
      temp: weather.hourly?.temperature_2m || [],
      uv: weather.hourly?.uv_index || [],
      wind: weather.hourly?.wind_speed_10m || [],
      heatIndex: weather.hourly?.apparent_temperature || [],
    }
  };
}