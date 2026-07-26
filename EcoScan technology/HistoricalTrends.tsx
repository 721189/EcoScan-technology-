import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { EnvironmentalData } from '../types/env';

interface TrendsProps {
  trends: EnvironmentalData['hourlyTrends'];
}

export const HistoricalTrends: React.FC<TrendsProps> = ({ trends }) => {
  const [metric, setMetric] = useState<'aqi' | 'temp' | 'uv' | 'wind'>('aqi');

  const chartData = trends.time.map((timeStr, idx) => ({
    time: timeStr,
    aqi: trends.aqi[idx] || 0,
    temp: trends.temp[idx] || 0,
    uv: trends.uv[idx] || 0,
    wind: trends.wind[idx] || 0
  }));

  const getMetricColor = (): string => {
    switch (metric) {
      case 'aqi':
        return '#f97316';
      case 'temp':
        return '#ef4444';
      case 'uv':
        return '#f59e0b';
      case 'wind':
        return '#3b82f6';
    }
    return '#3b82f6';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-800">24-Hour Trend Analysis</h3>
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['aqi', 'temp', 'uv', 'wind'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                metric === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            />
            <Line type="monotone" dataKey={metric} stroke={getMetricColor()} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
