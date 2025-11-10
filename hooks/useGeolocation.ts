import { useState, useCallback } from 'react';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodedAddress {
  latitude: number;
  longitude: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface UseGeolocationResult {
  coordinates: GeolocationCoordinates | null;
  address: ReverseGeocodedAddress | null;
  loading: boolean;
  error: string | null;
  getLocation: () => Promise<ReverseGeocodedAddress | null>;
}

/**
 * Custom hook to get user's current geolocation with reverse geocoding
 * Uses browser's Geolocation API and Mapbox Geocoding for address data
 * 
 * @returns {UseGeolocationResult} - Object containing coordinates, full address, loading state, error, and getLocation function
 * 
 * @example
 * const { address, loading, error, getLocation } = useGeolocation();
 * 
 * const handleGetLocation = async () => {
 *   const addressData = await getLocation();
 *   if (addressData) {
 *     console.log(`${addressData.street}, ${addressData.city}, ${addressData.state}`);
 *   }
 * };
 */
export const useGeolocation = (): UseGeolocationResult => {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null);
  const [address, setAddress] = useState<ReverseGeocodedAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Reverse geocode coordinates to get address using Mapbox API
   */
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<ReverseGeocodedAddress | null> => {
      try {
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        
        if (!mapboxToken) {
          throw new Error('Mapbox token not configured');
        }

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
        );

        if (!response.ok) {
          throw new Error('Failed to reverse geocode coordinates');
        }

        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          throw new Error('No address found for these coordinates');
        }

        // Parse the Mapbox response
        const features = data.features;
        let street = '';
        let city = '';
        let state = '';
        let country = '';
        let postalCode = '';

        // Extract address components from Mapbox features
        features.forEach((feature: any) => {
          const context = feature.context || [];
          
          if (feature.id.includes('address')) {
            street = feature.text || '';
          } else if (feature.id.includes('place')) {
            city = feature.text || '';
          } else if (feature.id.includes('region')) {
            state = feature.text || '';
          } else if (feature.id.includes('country')) {
            country = feature.text || '';
          } else if (feature.id.includes('postcode')) {
            postalCode = feature.text || '';
          }

          // Alternative: use context array
          context.forEach((ctx: any) => {
            if (ctx.id.includes('place') && !city) {
              city = ctx.text;
            } else if (ctx.id.includes('region') && !state) {
              state = ctx.text;
            } else if (ctx.id.includes('country') && !country) {
              country = ctx.text;
            } else if (ctx.id.includes('postcode') && !postalCode) {
              postalCode = ctx.text;
            }
          });
        });

        // Use the primary feature if no specific components found
        if (!street && !city && !state) {
          const primaryFeature = features[0];
          const text = primaryFeature.text || '';
          const placeName = primaryFeature.place_name || '';
          
          // Parse place_name which is usually "Street, City, State Country PostalCode"
          const parts = placeName.split(',').map((p: string) => p.trim());
          
          if (parts.length > 0) street = parts[0];
          if (parts.length > 1) city = parts[1];
          if (parts.length > 2) state = parts[2];
          if (parts.length > 3) country = parts[3];
        }

        const addressData: ReverseGeocodedAddress = {
          latitude: lat,
          longitude: lng,
          street: street || 'Unknown Street',
          city: city || 'Unknown City',
          state: state || 'Unknown State',
          country: country || 'Unknown Country',
          postalCode: postalCode || '',
        };

        return addressData;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Geocoding failed';
        console.error('Reverse geocoding error:', errorMsg);
        setError(errorMsg);
        return null;
      }
    },
    []
  );

  const getLocation = useCallback(
    async (): Promise<ReverseGeocodedAddress | null> => {
      // Check if browser supports geolocation
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser';
        setError(errorMsg);
        console.error(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const coords = { latitude, longitude };
            setCoordinates(coords);

            // Reverse geocode to get address
            const addressData = await reverseGeocode(latitude, longitude);
            
            if (addressData) {
              setAddress(addressData);
              setLoading(false);
              setError(null);
              resolve(addressData);
            } else {
              setLoading(false);
              resolve(null);
            }
          },
          (err) => {
            let errorMsg = 'Failed to get your location';

            // Handle specific error codes
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMsg = 'Location permission denied. Please enable location access in your browser settings.';
                break;
              case err.POSITION_UNAVAILABLE:
                errorMsg = 'Location information is unavailable.';
                break;
              case err.TIMEOUT:
                errorMsg = 'The request to get user location timed out.';
                break;
            }

            setError(errorMsg);
            setLoading(false);
            console.error(errorMsg, err);
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    },
    [reverseGeocode]
  );

  return { coordinates, address, loading, error, getLocation };
};
