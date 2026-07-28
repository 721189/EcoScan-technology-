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
    html: `<div style="background-color: ${color}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);">${aqi}</div>`,
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
            <div className="p-1 font-sans">
              <h4 className="font-bold text-slate-800">{data.location.name}</h4>
              <p className="text-xs text-slate-600 mt-1">AQI: <strong>{data.airQuality.aqi}</strong></p>
              <p className="text-xs text-slate-600">Temp: {data.weather.temp}°C</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
