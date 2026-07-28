import React from 'react';
import { EnvironmentalData, RiskLevel } from '../types/env';
import { Thermometer, Wind, Sun, ShieldAlert, HeartPulse } from 'lucide-react';

interface DashboardProps {
  data: EnvironmentalData;
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'Safe':
      return 'bg-emerald-500 text-white';
    case 'Moderate':
      return 'bg-amber-500 text-white';
    case 'Poor':
      return 'bg-orange-500 text-white';
    case 'Hazardous':
      return 'bg-rose-600 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
};

export const EnvironmentalDashboard: React.FC<DashboardProps> = ({ data }) => {
  const locationCountry = data.location.country || 'Current Environmental Metrics';

  const pollutantItems = [
    { label: 'PM2.5', val: data.airQuality.pm2_5 ?? 0 },
    { label: 'PM10', val: data.airQuality.pm10 ?? 0 },
    { label: 'CO', val: data.airQuality.co ?? 0 },
    { label: 'NO₂', val: data.airQuality.no2 ?? 0 },
    { label: 'SO₂', val: data.airQuality.so2 ?? 0 },
    { label: 'O₃', val: data.airQuality.o3 ?? 0 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{data.location.name}</h2>
          <p className="text-sm text-slate-400">{locationCountry}</p>
        </div>
        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-sm ${getRiskColor(data.riskLevel)}`}>
          <ShieldAlert className="w-5 h-5" />
          <span>{data.riskLevel} Risk</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            US AQI
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{data.airQuality.aqi ?? 0}</div>
          <p className="text-xs text-slate-400 mt-1">Air Quality Index</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Thermometer className="w-4 h-4 text-orange-500" />
            Temperature
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{data.weather.temp ?? 0}°C</div>
          <p className="text-xs text-slate-400 mt-1">Humidity: {data.weather.humidity ?? 0}%</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Sun className="w-4 h-4 text-amber-500" />
            UV Index
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{data.weather.uvIndex ?? 0}</div>
          <p className="text-xs text-slate-400 mt-1">Solar Radiation</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Wind className="w-4 h-4 text-blue-500" />
            Wind
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{data.weather.windSpeed ?? 0} <span className="text-xs font-normal">km/h</span></div>
          <p className="text-xs text-slate-400 mt-1">Dir: {data.weather.windDirection ?? 0}°</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Air Pollutant Detail (µg/m³)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {pollutantItems.map((item) => (
            <div key={item.label} className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-semibold text-slate-400">{item.label}</span>
              <span className="text-sm font-bold text-slate-700">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
