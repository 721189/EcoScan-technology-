# EcoScan Technology - Environmental Telemetry & Health Safety Advisory

[![GitHub](https://img.shields.io/badge/GitHub-721189/EcoScan-blue?logo=github)](https://github.com/721189/EcoScan-technology-)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌍 Overview

EcoScan is a sophisticated React/TypeScript application that delivers **instant live environmental telemetry and personalized health safety advice**. Users can search any location or use GPS to view real-time weather, AQI, UV, and wind metrics on an interactive map, with AI-powered safety recommendations and 24-hour trend analysis.

## ✨ Key Features

### 📊 Real-Time Environmental Monitoring
- **Air Quality Index (AQI)** - US EPA Standard with detailed pollutant breakdown
- **Weather Metrics** - Temperature, humidity, pressure, wind speed & direction
- **UV Index** - Solar radiation levels with sun protection guidance
- **Pollutant Details** - PM2.5, PM10, CO, NO₂, SO₂, O₃ concentrations

### 🗺️ Interactive Map Visualization
- Color-coded markers based on air quality levels
- OpenStreetMap integration with Leaflet
- Real-time location updates
- 5km radius pollution zone visualization

### 🛡️ AI-Powered Safety Recommendations
Comprehensive rules engine that generates personalized recommendations:
- **Mask Usage** - Based on AQI and specific pollutant levels
- **Outdoor Activity Advisories** - Temperature and air quality dependent
- **Sun Protection** - UV index-based recommendations
- **Cold/Heat Alerts** - Temperature extreme precautions
- **Wind Warnings** - High wind condition alerts

### 📈 24-Hour Trend Analysis
- Historical trend charts for AQI, temperature, UV, and wind
- Interactive line charts powered by Recharts
- Metric selection with real-time chart updates

### 🚨 Critical Alert System
- Real-time danger and warning alerts
- Hazardous air quality notifications
- Extreme weather warnings
- UV index extreme alerts
- User-friendly alert banner with icons

### 👤 User Authentication & Preferences
- Sign in / Register with Supabase
- Save favorite locations
- Recent search history
- Personalized user experience

## 🏗️ Project Structure

```
EcoScan-technology-/
├── App.tsx                          # Main application component
├── components/
│   ├── AlertBanner.tsx             # Critical alert display
│   ├── AlertModal.tsx              # Auth modal with error handling
│   ├── EnvironmentalDashboard.tsx  # Metrics display
│   ├── ErrorBoundary.tsx           # React error boundary
│   ├── HistoricalTrends.tsx        # 24-hour trend charts
│   ├── InteractiveMap.tsx          # Leaflet map integration
│   ├── SafetyRecommendations.tsx   # Health & safety advice
│   └── SearchBar.tsx               # Location search with autocomplete
├── lib/
│   ├── api.ts                      # API integration (with mock data)
│   ├── rulesEngine.ts              # Safety recommendations engine
│   └── supabase.ts                 # Supabase client & config validation
├── types/
│   └── env.ts                      # TypeScript interfaces & types
├── package.json                     # Dependencies
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Git
- Supabase account (optional for auth features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/721189/EcoScan-technology-.git
cd EcoScan-technology-
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your configuration:

```env
# Supabase Configuration (Required for Auth)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Weather/AQI API Keys
# VITE_WEATHER_API_KEY=your-key
# VITE_AQI_API_KEY=your-key
```

4. **Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Configuration

### Supabase Setup (Optional for Auth)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings > API**
4. Copy your **Project URL** and **Anon Key**
5. Add them to `.env.local`

### API Integration (For Real Data)

The app currently uses mock data. To integrate real environmental data:

1. **Weather Data**: OpenWeatherMap, Weather API, or similar
2. **Air Quality**: IQAir, OpenAQ, or EPA API
3. **Geocoding**: Nominatim (free), Google Maps, or Mapbox

Update `lib/api.ts` with your API calls:

```typescript
// Example: OpenWeatherMap integration
const fetchWeatherData = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: { lat, lon, appid: process.env.VITE_WEATHER_API_KEY }
    }
  );
  return response.data;
};
```

## 🎯 Rules Engine Logic

The safety recommendations are powered by a comprehensive rules engine (`lib/rulesEngine.ts`):

### Air Quality Rules
- **AQI ≤ 50**: Safe - No mask needed
- **AQI 51-100**: Moderate - Masks for sensitive groups
- **AQI 101-150**: Poor - Masks recommended, limit outdoor time
- **AQI > 150**: Hazardous - Avoid outdoors, N95 required

### UV Index Rules
- **0-2**: Low - Minimal protection
- **3-5**: Moderate - SPF 30+, light clothing
- **6-7**: High - SPF 50+, avoid 10 AM-4 PM
- **8-10**: Very High - Long sleeves, hat required
- **11+**: Extreme - Stay indoors or maximum protection

### Temperature Rules
- **< 0°C**: Freezing - Risk of frostbite
- **0-10°C**: Cold - Warm layers needed
- **> 30°C**: Hot - Stay hydrated, seek shade
- **> 35°C**: Extreme - Heat exhaustion risk

## 📦 Technology Stack

- **Frontend**: React 18, TypeScript 5
- **Styling**: Tailwind CSS 3, Tailwind UI components
- **Maps**: Leaflet, React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **HTTP Client**: Axios

## 🧪 Testing

The app includes error boundaries to catch and display component errors gracefully:

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 📝 Development Guide

### Adding a New Recommendation Rule

Edit `lib/rulesEngine.ts`:

```typescript
const evaluateMyRule = (data: EnvironmentalData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  if (/* condition */) {
    recommendations.push({
      id: 'my-rule-1',
      category: 'mask' | 'outdoor' | 'sun' | 'wind' | 'heat',
      text: 'Your recommendation text',
      severity: 'low' | 'medium' | 'high'
    });
  }
  
  return recommendations;
};
```

Then add to `evaluateRules()`:
```typescript
export const evaluateRules = (data: EnvironmentalData): RulesEngineOutput => {
  const recommendations: Recommendation[] = [
    ...evaluateMyRule(data),
    // ... other rules
  ];
  // ...
};
```

### Creating a New Component

1. Create file: `components/MyComponent.tsx`
2. Use React FC pattern with TypeScript
3. Import and wrap with ErrorBoundary if it's a major section
4. Add documentation comments

## 🐛 Error Handling

- **Auth errors** are caught and displayed in AuthModal
- **API errors** fall back to mock data
- **Component errors** are caught by ErrorBoundary
- **Geolocation errors** show user-friendly messages

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open an [issue](https://github.com/721189/EcoScan-technology-/issues)
- Check existing issues for similar problems
- Provide detailed error messages and steps to reproduce

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Leaflet for map library
- Recharts for charting
- Supabase for authentication
- Tailwind CSS for styling

---

**Made with ❤️ for environmental awareness and personal health**
