import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnvironmentalData } from '../types/env';

interface MapProps {
  data: EnvironmentalData;
}

// Custom Leaflet DivIcon for clean modern marker rendering
const createCustomIcon = (aqi: number) => {
  let color = '#10b981'; // green
  if (aqi > 50) color = '#f59e0b'; // yellow
  if (aqi > 100) color = '#f97316'; // orange
  if (aqi > 200) color = '#e11d48'; // red

  return L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color: ${color}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">${Math.round(aqi)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const InteractiveMap: React.FC<MapProps> = ({ data }) => {
  const position: [number, number] = [data.location.lat, data.location.lon];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[400px] relative">
      <MapContainer
        key={`${data.location.lat}-${data.location.lon}`}
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={position}
          radius={5000}
          pathOptions={{
            color: data.airQuality.aqi > 100 ? '#f97316' : '#10b981',
            fillColor: data.airQuality.aqi > 100 ? '#f97316' : '#10b981',
            fillOpacity: 0.2
          }}
        />
        <Marker position={position} icon={createCustomIcon(data.airQuality.aqi)}>
          <Popup>
            <div className="p-3 font-sans min-w-[200px]">
              <h4 className="font-bold text-slate-800 text-base">{data.location.name}</h4>
              {data.location.country && (
                <p className="text-xs text-slate-500">{data.location.country}</p>
              )}
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">AQI:</span>
                  <strong className="text-sm text-slate-800">{data.airQuality.aqi}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Temperature:</span>
                  <strong className="text-sm text-slate-800">{data.weather.temp}°C</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Humidity:</span>
                  <strong className="text-sm text-slate-800">{data.weather.humidity}%</strong>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
