import { EnvironmentalData, Recommendation, InAppAlert, RiskLevel } from '../types/env';

/**
 * Rules Engine for Safety Recommendations
 * Analyzes environmental data and generates personalized health recommendations
 * and critical alerts based on pollution levels and weather conditions
 */

interface RulesEngineOutput {
  recommendations: Recommendation[];
  alerts: InAppAlert[];
}

/**
 * Evaluate AQI and generate mask/indoor recommendations
 */
const evaluateAirQualityRules = (aqi: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (aqi <= 50) {
    recommendations.push({
      id: 'aqi-safe-1',
      category: 'outdoor',
      text: 'Air quality is good. Safe for outdoor activities. No mask needed.',
      severity: 'low'
    });
  } else if (aqi <= 100) {
    recommendations.push({
      id: 'aqi-moderate-1',
      category: 'mask',
      text: 'Moderate air pollution. Sensitive groups should consider wearing a mask for outdoor activities.',
      severity: 'medium'
    });
  } else if (aqi <= 150) {
    recommendations.push({
      id: 'aqi-poor-1',
      category: 'mask',
      text: 'Poor air quality. Masks recommended for anyone spending extended time outdoors.',
      severity: 'high'
    });
    recommendations.push({
      id: 'aqi-poor-2',
      category: 'outdoor',
      text: 'Limit outdoor activities. Vulnerable groups should stay indoors.',
      severity: 'high'
    });
  } else {
    recommendations.push({
      id: 'aqi-hazardous-1',
      category: 'mask',
      text: 'Hazardous air quality. N95 masks required if outdoors. Everyone should limit outdoor exposure.',
      severity: 'high'
    });
    recommendations.push({
      id: 'aqi-hazardous-2',
      category: 'outdoor',
      text: 'Critical air pollution levels. Avoid outdoor activities. Use indoor air filtration.',
      severity: 'high'
    });
  }

  return recommendations;
};

/**
 * Evaluate UV Index and generate sun protection recommendations
 */
const evaluateUVRules = (uvIndex: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (uvIndex <= 2) {
    recommendations.push({
      id: 'uv-low-1',
      category: 'sun',
      text: 'Low UV index. Minimal sun protection needed.',
      severity: 'low'
    });
  } else if (uvIndex <= 5) {
    recommendations.push({
      id: 'uv-moderate-1',
      category: 'sun',
      text: 'Moderate UV index. Apply SPF 30+ sunscreen and wear light protective clothing.',
      severity: 'medium'
    });
  } else if (uvIndex <= 7) {
    recommendations.push({
      id: 'uv-high-1',
      category: 'sun',
      text: 'High UV index. Apply SPF 50+ sunscreen, wear hat and sunglasses. Limit midday exposure.',
      severity: 'high'
    });
  } else if (uvIndex <= 10) {
    recommendations.push({
      id: 'uv-vhigh-1',
      category: 'sun',
      text: 'Very high UV index. Seek shade during 10 AM - 4 PM. Wear protective clothing and SPF 50+.',
      severity: 'high'
    });
  } else {
    recommendations.push({
      id: 'uv-extreme-1',
      category: 'sun',
      text: 'Extreme UV index. Avoid sun exposure between 10 AM - 4 PM. Wear long sleeves, hat, and SPF 50+.',
      severity: 'high'
    });
  }

  return recommendations;
};

/**
 * Evaluate temperature and generate heat/cold precautions
 */
const evaluateTemperatureRules = (temp: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (temp < 0) {
    recommendations.push({
      id: 'temp-freeze-1',
      category: 'heat',
      text: 'Freezing temperature. Wear heavy insulation, cover exposed skin to prevent frostbite.',
      severity: 'high'
    });
  } else if (temp < 10) {
    recommendations.push({
      id: 'temp-cold-1',
      category: 'heat',
      text: 'Cold temperature. Wear warm layers and protect extremities.',
      severity: 'medium'
    });
  } else if (temp > 30) {
    recommendations.push({
      id: 'temp-hot-1',
      category: 'heat',
      text: 'High temperature. Stay hydrated and avoid prolonged sun exposure. Take regular breaks.',
      severity: 'high'
    });
    recommendations.push({
      id: 'temp-hot-2',
      category: 'outdoor',
      text: 'Heat alert: Limit strenuous outdoor activities. Vulnerable groups should stay in cool environments.',
      severity: 'high'
    });
  } else if (temp > 35) {
    recommendations.push({
      id: 'temp-extreme-1',
      category: 'heat',
      text: 'Extreme heat. Minimize outdoor exposure. Drink plenty of water. Watch for heat exhaustion symptoms.',
      severity: 'high'
    });
  }

  return recommendations;
};

/**
 * Evaluate wind conditions and generate wind-related precautions
 */
const evaluateWindRules = (windSpeed: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (windSpeed > 40) {
    recommendations.push({
      id: 'wind-severe-1',
      category: 'wind',
      text: 'Severe wind conditions. Avoid outdoor activities. Secure loose objects.',
      severity: 'high'
    });
  } else if (windSpeed > 25) {
    recommendations.push({
      id: 'wind-strong-1',
      category: 'wind',
      text: 'Strong wind. Caution for outdoor activities. Secure loose items.',
      severity: 'medium'
    });
  }

  return recommendations;
};

/**
 * Evaluate pollutants and generate specific health warnings
 */
const evaluatePollutantRules = (data: EnvironmentalData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const { pm2_5, pm10, no2, co } = data.airQuality;

  // PM2.5 evaluation (fine particulates)
  if (pm2_5 > 35) {
    recommendations.push({
      id: 'pollutant-pm25-1',
      category: 'mask',
      text: `High PM2.5 levels (${Math.round(pm2_5)} µg/m³). Fine particulates can penetrate deep into lungs. N95 masks recommended.`,
      severity: 'high'
    });
  }

  // NO₂ evaluation (nitrogen dioxide)
  if (no2 > 100) {
    recommendations.push({
      id: 'pollutant-no2-1',
      category: 'outdoor',
      text: `Elevated NO₂ levels (${Math.round(no2)} ppb). Avoid strenuous outdoor activities. This may worsen asthma.`,
      severity: 'high'
    });
  }

  // CO evaluation (carbon monoxide)
  if (co > 2) {
    recommendations.push({
      id: 'pollutant-co-1',
      category: 'outdoor',
      text: `High CO levels detected (${co.toFixed(1)} mg/m³). Stay in well-ventilated areas. Those with heart conditions should be cautious.`,
      severity: 'high'
    });
  }

  return recommendations;
};

/**
 * Generate critical alerts based on environmental extremes
 */
const generateAlerts = (data: EnvironmentalData): InAppAlert[] => {
  const alerts: InAppAlert[] = [];
  const { aqi, uvIndex, temp } = data.airQuality;

  // Hazardous air quality alert
  if (aqi > 150) {
    alerts.push({
      id: `alert-aqi-${Date.now()}`,
      title: '🚨 Hazardous Air Quality',
      message: `AQI is ${aqi}. Avoid all outdoor activities.`,
      type: 'danger'
    });
  }

  // Extreme UV alert
  if (uvIndex > 10) {
    alerts.push({
      id: `alert-uv-${Date.now()}`,
      title: '☀️ Extreme UV Index',
      message: `UV index is ${uvIndex}. Stay indoors or use maximum sun protection.`,
      type: 'danger'
    });
  }

  // Heat alert
  if (temp > 35) {
    alerts.push({
      id: `alert-heat-${Date.now()}`,
      title: '🌡️ Extreme Heat Alert',
      message: `Temperature is ${temp}°C. Heat-related illnesses are possible.`,
      type: 'danger'
    });
  }

  // Cold alert
  if (temp < -5) {
    alerts.push({
      id: `alert-cold-${Date.now()}`,
      title: '❄️ Extreme Cold Alert',
      message: `Temperature is ${temp}°C. Risk of frostbite on exposed skin.`,
      type: 'danger'
    });
  }

  // Poor air quality warning
  if (aqi > 100 && aqi <= 150) {
    alerts.push({
      id: `alert-aqi-warning-${Date.now()}`,
      title: '⚠️ Poor Air Quality',
      message: `AQI is ${aqi}. Vulnerable groups should limit outdoor activities.`,
      type: 'warning'
    });
  }

  return alerts;
};

/**
 * Main rules engine function
 * Evaluates all environmental factors and generates recommendations and alerts
 */
export const evaluateRules = (data: EnvironmentalData): RulesEngineOutput => {
  const recommendations: Recommendation[] = [
    ...evaluateAirQualityRules(data.airQuality.aqi),
    ...evaluateUVRules(data.weather.uvIndex),
    ...evaluateTemperatureRules(data.weather.temp),
    ...evaluateWindRules(data.weather.windSpeed),
    ...evaluatePollutantRules(data)
  ];

  const alerts = generateAlerts(data);

  // Remove duplicate recommendations (by category and severity)
  const uniqueRecommendations = Array.from(
    new Map(
      recommendations.map((rec) => [
        `${rec.category}-${rec.severity}`,
        rec
      ])
    ).values()
  );

  return {
    recommendations: uniqueRecommendations,
    alerts
  };
};

export default evaluateRules;
