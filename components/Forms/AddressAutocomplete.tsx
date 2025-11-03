import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';

export interface AddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion: (suggestion: any) => void;
  onGenerateLocation?: () => Promise<void>;
  isGenerating?: boolean;
  required?: boolean;
  disabled?: boolean;
}

/**
 * AddressAutocomplete Component
 * Provides real-time address suggestions with recent search history and location generation
 */
export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  placeholder = 'Start typing address...',
  value,
  onChange,
  onSelectSuggestion,
  onGenerateLocation,
  isGenerating = false,
  required = false,
  disabled = false,
}) => {
  const {
    suggestions,
    recentSearches,
    loading,
    query,
    setQuery,
    getSuggestions,
    clearSuggestions,
    addToRecentSearches,
  } = useAddressAutocomplete();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    onChange(inputValue);

    if (inputValue.length > 2) {
      setShowSuggestions(true);
      await getSuggestions(inputValue);
    } else if (inputValue.length === 0) {
      setShowSuggestions(true);
      clearSuggestions();
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const placeName = suggestion.place_name || suggestion.text;
    setQuery(placeName);
    onChange(placeName);
    onSelectSuggestion(suggestion);
    addToRecentSearches(suggestion);
    setShowSuggestions(false);
  };

  const handleRecentClick = (suggestion: any) => {
    const placeName = suggestion.place_name || suggestion.text;
    setQuery(placeName);
    onChange(placeName);
    onSelectSuggestion(suggestion);
    setShowSuggestions(false);
  };

  const handleGenerateClick = async () => {
    if (onGenerateLocation) {
      await onGenerateLocation();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displaySuggestions = query.length > 2 ? suggestions : [];
  const displayRecent = query.length === 0 ? recentSearches : [];

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Search Input with Generate Button */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query || value}
          onChange={handleInputChange}
          disabled={disabled}
          required={required}
          autoComplete="off"
          className="block w-full px-3 py-2 pr-10  border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {/* Generate Location Button */}
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={disabled || isGenerating}
          title="Use current location"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <span className="inline-block animate-spin">🔄</span>
          ) : (
            <span>📍</span>
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length > 2 || query.length === 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* Recent Searches Section */}
          {displayRecent.length > 0 && query.length === 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 sticky top-0 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase">Recent Searches</p>
              </div>
              {displayRecent.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleRecentClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                >
                  <span className="text-gray-400">🕐</span>
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {suggestion.place_name}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Search Results Section */}
          {displaySuggestions.length > 0 && (
            <>
              {displayRecent.length > 0 && query.length === 0 && (
                <div className="px-4 py-2 bg-gray-50 sticky top-12 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Suggestions</p>
                </div>
              )}
              {displaySuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                >
                  <span className="text-gray-400">📍</span>
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {suggestion.place_name}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Loading State */}
          {loading && query.length > 2 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Loading suggestions...
            </div>
          )}

          {/* No Results */}
          {!loading && query.length > 2 && displaySuggestions.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No addresses found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
