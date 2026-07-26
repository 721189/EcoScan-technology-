import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { EnvironmentalDashboard } from './components/EnvironmentalDashboard';
import { SafetyRecommendations } from './components/SafetyRecommendations';
import { InteractiveMap } from './components/InteractiveMap';
import { HistoricalTrends } from './components/HistoricalTrends';
import { AlertsBanner } from './components/AlertsBanner';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { fetchEnvironmentalData } from './lib/api';
import { evaluateRules } from './lib/rulesEngine';
import { EnvironmentalData, LocationData } from './types/env';
import { User, Star, Loader2 } from 'lucide-react';

/**
 * Main App Component
 * EcoScan: Environmental Telemetry & Health Safety Advisory System
 * 
 * Features:
 * - Real-time environmental data display
 * - Interactive map visualization
 * - 24-hour trend analysis
 * - AI-powered safety recommendations
 * - Critical alert system
 * - User authentication and favorites
 */
export default function App() {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [favorites, setFavorites] = useState<LocationData[]>([]);

  /**
   * Load environmental data for a specific location
   */
  const loadLocation = async (lat: number, lon: number, name = 'Current Location', country = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEnvironmentalData(lat, lon, name, country);
      setData(res);

      // Add to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.name !== name);
        return [{ name, country, lat, lon }, ...filtered].slice(0, 3);
      });
    } catch (err) {
      console.error('Failed to load environmental data', err);
      setError('Failed to load environmental data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize app with default location (London)
   */
  useEffect(() => {
    loadLocation(51.5074, -0.1278, 'London', 'United Kingdom');
  }, []);

  /**
   * Handle geolocation request
   */
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadLocation(pos.coords.latitude, pos.coords.longitude, 'My Location');
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Could not access your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  /**
   * Toggle location as favorite
   */
  const toggleFavorite = () => {
    if (!data) return;
    const currentLoc = data.location;
    if (favorites.some((f) => f.name === currentLoc.name)) {
      setFavorites(favorites.filter((f) => f.name !== currentLoc.name));
    } else {
      setFavorites([
        ...favorites,
        { id: Date.now().toString(), ...currentLoc }
      ]);
    }
  };

  // Evaluate rules to get recommendations and alerts
  const { recommendations, alerts } = data
    ? evaluateRules(data)
    : { recommendations: [], alerts: [] };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        {/* Navbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white font-black text-sm">
                E
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight">
                  EnvHealth<span className="text-blue-600">Map</span>
                </span>
                <p className="text-xs text-slate-400">Environmental Telemetry & Safety</p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
            >
              <User className="w-4 h-4" />
              {user ? user.split('@')[0] : 'Sign In'}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-6 flex-1 space-y-6 w-full">
          {/* Search Header */}
          <ErrorBoundary>
            <SearchBar
              onSelectLocation={(loc) =>
                loadLocation(loc.lat, loc.lon, loc.name, loc.country)
              }
              onGeolocate={handleGeolocate}
              recentSearches={recentSearches}
              favoriteLocations={favorites}
            />
          </ErrorBoundary>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Fetching live environmental telemetry...
              </p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Active Threshold Alerts */}
              <ErrorBoundary>
                <AlertsBanner alerts={alerts} />
              </ErrorBoundary>

              {/* Top Row: Dashboard + Interactive Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Conditions
                    </span>
                    <button
                      onClick={toggleFavorite}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-500 font-semibold transition"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.some((f) => f.name === data.location.name)
                            ? 'fill-amber-500 text-amber-500'
                            : ''
                        }`}
                      />
                      {favorites.some((f) => f.name === data.location.name)
                        ? 'Saved'
                        : 'Save Location'}
                    </button>
                  </div>
                  <ErrorBoundary>
                    <EnvironmentalDashboard data={data} />
                  </ErrorBoundary>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Interactive Map
                  </span>
                  <ErrorBoundary>
                    <InteractiveMap data={data} />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Bottom Row: Rules Engine & 24h Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <ErrorBoundary>
                    <SafetyRecommendations recommendations={recommendations} />
                  </ErrorBoundary>
                </div>
                <div className="lg:col-span-7">
                  <ErrorBoundary>
                    <HistoricalTrends trends={data.hourlyTrends} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          ) : null}
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(u) => setUser(u)}
        />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-slate-500 text-center">
            <p>
              Environmental data is provided for informational purposes. Always consult official
              health and safety guidelines. © 2024 EcoScan Technology.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
