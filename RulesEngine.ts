import { EnvironmentalData, Recommendation, InAppAlert } from '../types/env';

export function evaluateRules(data: EnvironmentalData): {
  recommendations: Recommendation[];
  alerts: InAppAlert[];
} {
  const recs: Recommendation[] = [];
  const alerts: InAppAlert[] = [];

  const { aqi } = data.airQuality;
  const { uvIndex, windSpeed, temp, heatIndex } = data.weather;

  // Air Quality Rules
  if (aqi > 200) {
    recs.push({ id: '1', category: 'mask', text: 'Wear an N95 mask outdoors', severity: 'high' });
    recs.push({ id: '2', category: 'outdoor', text: 'Avoid outdoor exertion & keep windows shut', severity: 'high' });
    alerts.push({ id: 'a1', title: 'Hazardous Air Quality', message: `AQI reached ${aqi}. Limit all outdoor exposure.`, type: 'danger' });
  } else if (aqi > 100) {
    recs.push({ id: '3', category: 'outdoor', text: 'Sensitive groups should reduce outdoor exercise', severity: 'medium' });
  } else {
    recs.push({ id: '4', category: 'outdoor', text: 'Air quality is acceptable for outdoor activity', severity: 'low' });
  }

  // Heat Index Safety Engine (NWS Tiers)
  if (heatIndex >= 41) { // 105°F+
    recs.push({ id: 'h1', category: 'heat', text: `Extreme Heat Danger (Feels like ${heatIndex}°C): Heatstroke highly likely with continued outdoor exposure`, severity: 'high' });
    alerts.push({ id: 'a-heat', title: 'Extreme Heat Warning', message: `Apparent temperature feels like ${heatIndex}°C. Seek shaded/air-conditioned shelter immediately.`, type: 'danger' });
  } else if (heatIndex >= 32) { // 90°F-105°F
    recs.push({ id: 'h2', category: 'heat', text: `Heat Advisory (Feels like ${heatIndex}°C): Heat cramps and heat exhaustion possible with prolonged activity`, severity: 'high' });
    alerts.push({ id: 'a-heat2', title: 'Heat Caution Advisory', message: `Heat Index is ${heatIndex}°C. Stay hydrated and limit direct sun.`, type: 'warning' });
  } else if (heatIndex >= 27) { // 80°F-90°F
    recs.push({ id: 'h3', category: 'heat', text: `Warm Weather Caution (Feels like ${heatIndex}°C): Fatigue possible if exposed for long periods`, severity: 'medium' });
  }

  // UV Rules
  if (uvIndex >= 8) {
    recs.push({ id: '5', category: 'sun', text: 'Very High UV: Wear SPF 50+, hat, and sunglasses', severity: 'high' });
    alerts.push({ id: 'a2', title: 'High UV Radiation', message: `UV Index is ${uvIndex}. Direct exposure risks skin damage.`, type: 'warning' });
  } else if (uvIndex >= 5) {
    recs.push({ id: '6', category: 'sun', text: 'Moderate UV: Apply sunscreen before going out', severity: 'medium' });
  }

  // Wind Rules
  if (windSpeed > 30) {
    recs.push({ id: '7', category: 'wind', text: 'High winds: Watch for dust and blowing debris', severity: 'medium' });
  }

  return { recommendations: recs, alerts };
}
