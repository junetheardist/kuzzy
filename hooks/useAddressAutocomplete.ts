import { useState, useCallback, useEffect } from 'react';

export interface AddressSuggestion {
  id: string;
  text: string;
  place_name: string;
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
  isRecent?: boolean;
}

export interface UseAddressAutocompleteResult {
  suggestions: AddressSuggestion[];
  recentSearches: AddressSuggestion[];
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (query: string) => void;
  clearSuggestions: () => void;
  getSuggestions: (input: string) => Promise<void>;
  addToRecentSearches: (suggestion: AddressSuggestion) => void;
  clearRecentSearches: () => void;
}

const RECENT_SEARCHES_KEY = 'kuzzy_recent_addresses';
const MAX_RECENT_SEARCHES = 5;

/**
 * Custom hook for address autocomplete using Mapbox Geocoding API
 * Provides real-time address suggestions and recent search history
 *
 * @returns {UseAddressAutocompleteResult} - Suggestions, recent searches, loading state, error, and utility functions
 *
 * @example
 * const { suggestions, recentSearches, loading, query, setQuery, getSuggestions, addToRecentSearches } = useAddressAutocomplete();
 *
 * const handleInputChange = async (value: string) => {
 *   setQuery(value);
 *   if (value.length > 2) {
 *     await getSuggestions(value);
 *   }
 * };
 *
 * const handleSelectAddress = (suggestion) => {
 *   addToRecentSearches(suggestion);
 * };
 */
export const useAddressAutocomplete = (): UseAddressAutocompleteResult => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const recentWithFlag = parsed.map((item: AddressSuggestion) => ({
          ...item,
          isRecent: true,
        }));
        setRecentSearches(recentWithFlag);
      } catch (err) {
        console.error('Failed to parse recent searches:', err);
      }
    }
  }, []);

  const addToRecentSearches = useCallback((suggestion: AddressSuggestion) => {
    setRecentSearches((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== suggestion.id);

      // Add to the beginning
      const updated = [{ ...suggestion, isRecent: true }, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Save to localStorage
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const getSuggestions = useCallback(
    async (input: string): Promise<void> => {
      if (!input || input.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (!mapboxToken) {
          throw new Error('Mapbox token not configured');
        }

        // Use Mapbox Geocoding API for forward geocoding (address search)
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?` +
          `access_token=${mapboxToken}&` +
          `limit=5&` +
          `country=NG&` + // Filter to Nigeria (can be made configurable)
          `types=place,address,region`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch address suggestions');
        }

        const data = await response.json();

        if (data.features) {
          setSuggestions(data.features);
        } else {
          setSuggestions([]);
        }

        setLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get suggestions';
        setError(errorMsg);
        setLoading(false);
        console.error('Address autocomplete error:', errorMsg);
      }
    },
    []
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    suggestions,
    recentSearches,
    loading,
    error,
    query,
    setQuery,
    clearSuggestions,
    getSuggestions,
    addToRecentSearches,
    clearRecentSearches,
  };
};
