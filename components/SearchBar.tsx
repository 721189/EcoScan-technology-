import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { LocationData } from '../types/env';
import { searchLocations } from '../lib/api';

interface SearchBarProps {
  onSelectLocation: (location: LocationData) => void;
  onGeolocate: () => void;
  recentSearches: LocationData[];
  favoriteLocations: LocationData[];
}

/**
 * SearchBar Component
 * Provides location search functionality with:
 * - Real-time search suggestions
 * - Recent searches
 * - Favorite locations
 * - Geolocation support
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  onGeolocate,
  recentSearches,
  favoriteLocations
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search input
  const handleSearch = async (value: string) => {
    setQuery(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchLocations(value);
      setSuggestions(results);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection
  const handleSelectLocation = (location: LocationData) => {
    onSelectLocation(location);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search for a city or location..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={onGeolocate}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            title="Use current location"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* Search Results */}
            {suggestions.length > 0 && (
              <>
                <div className="px-3 py-2 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Search Results
                  </p>
                </div>
                {suggestions.map((loc) => (
                  <button
                    key={`${loc.name}-${loc.lat}-${loc.lon}`}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 transition flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{loc.name}</p>
                      <p className="text-xs text-slate-500">{loc.country}</p>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Favorites */}
            {favoriteLocations.length > 0 && suggestions.length === 0 && (
              <>
                <div className="px-3 py-2 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" /> Saved Locations
                  </p>
                </div>
                {favoriteLocations.map((loc) => (
                  <button
                    key={`fav-${loc.name}`}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 transition flex items-center gap-3"
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{loc.name}</p>
                      <p className="text-xs text-slate-500">{loc.country}</p>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && suggestions.length === 0 && (
              <>
                <div className="px-3 py-2 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Recent Searches
                  </p>
                </div>
                {recentSearches.map((loc) => (
                  <button
                    key={`recent-${loc.name}`}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 transition flex items-center gap-3"
                  >
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{loc.name}</p>
                      <p className="text-xs text-slate-500">{loc.country}</p>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Empty State */}
            {suggestions.length === 0 &&
              recentSearches.length === 0 &&
              favoriteLocations.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-slate-500">
                    {loading
                      ? 'Searching locations...'
                      : 'Type at least 2 characters to search'}
                  </p>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {favoriteLocations.slice(0, 3).map((loc) => (
          <button
            key={`quick-${loc.name}`}
            onClick={() => handleSelectLocation(loc)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium whitespace-nowrap transition"
          >
            <Star className="w-3 h-3 inline mr-1 text-amber-500" />
            {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
};