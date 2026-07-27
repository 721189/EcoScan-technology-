export type RiskLevel = 'Safe' | 'Moderate' | 'Poor' | 'Hazardous';

export interface LocationData {
  id?: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface EnvironmentalData {
  location: LocationData;
  weather: {
    temp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    uvIndex: number;
    heatIndex: number; // Added Heat Index
  };
  airQuality: {
    aqi: number;
    pm2_5: number;
    pm10: number;
    co: number;
    no2: number;
    so2: number;
    o3: number;
  };
  riskLevel: RiskLevel;
  hourlyTrends: {
    time: string[];
    aqi: number[];
    temp: number[];
    uv: number[];
    wind: number[];
    heatIndex: number[]; // Added Heat Index trend
  };
}

export interface Recommendation {
  id: string;
  category: 'mask' | 'outdoor' | 'sun' | 'wind' | 'heat';
  text: string;
  severity: 'low' | 'medium' | 'high';
}

export interface InAppAlert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger';
}