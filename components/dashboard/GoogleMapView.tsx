"use client";

import {useEffect, useState, useRef} from 'react';
import GoogleMapReact from 'google-map-react';
import { Vendor } from '@/redux/vendorSlice';
import { Store, MapPin, RotateCcw, Plus, Minus, Navigation } from 'lucide-react';

// Category to color mapping
const CATEGORY_COLORS: Record<string, string> = {
    'electronics': '#EF4444',      // Red
    'clothing': '#F97316',         // Orange
    'food': '#22C55E',             // Green
    'groceries': '#84CC16',        // Lime
    'pharmacy': '#06B6D4',         // Cyan
    'home': '#8B5CF6',             // Purple
    'beauty': '#EC4899',           // Pink
    'books': '#6366F1',            // Indigo
    'sports': '#14B8A6',           // Teal
    'furniture': '#A16207',        // Brown
};

// Get color by category, with fallback
const getCategoryColor = (category?: string): string => {
    if (!category) return '#4F46E5'; // Default indigo
    const lowerCategory = category.toLowerCase();
    return CATEGORY_COLORS[lowerCategory] || '#4F46E5';
};

// Custom marker component
const Marker = ({text}: { text: string, lat: number, lng: number }) => (
    <div style={{position: 'relative'}}>
        <img
            src="/cap.png"
            alt={text}
            style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)'
            }}
        />
    </div>
);

// Store marker component with color based on category
const StoreMarker = ({text, shopName, category, color}: { text: string, shopName?: string, category?: string, color?: string, lat: number, lng: number }) => {
    const markerColor = color || getCategoryColor(category);
    
    return (
        <div style={{position: 'relative', cursor: 'pointer'}} title={`${shopName} (${category || 'Uncategorized'})`}>
            <div style={{
                width: '32px',
                height: '40px',
                backgroundColor: markerColor,
                borderRadius: '50% 50% 50% 0%',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '-16px',
                marginTop: '-20px',
                transition: 'transform 0.2s ease-in-out'
            }} 
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(-45deg) scale(1.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(-45deg)';
            }}>
                <Store 
                    size={16} 
                    color="white" 
                    style={{
                        transform: 'rotate(45deg)',
                    }}
                />
            </div>
        </div>
    );
};

// Current location marker (different style)
const CurrentLocationMarker = ({text}: { text: string, lat: number, lng: number }) => (
    <div style={{position: 'relative'}}>
        <div
            style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#4285F4',
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)'
            }}
        />
    </div>
);

interface GoogleMapViewProps {
    showStores?: boolean;
    stores?: Vendor[];
}

export default function GoogleMapView({ showStores = false, stores = [] }: GoogleMapViewProps) {
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [mapCenter, setMapCenter] = useState({
        lat: 6.5244,
        lng: 3.3792
    });
    const [zoom, setZoom] = useState(15);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<any>(null);

    // Debug: Log stores data whenever it changes
    useEffect(() => {
        if (showStores) {
            console.log('🗺️ GoogleMapView - Stores data:', stores);
            console.log('📊 Total stores:', stores.length);
            
            const storesWithCoords = stores.filter(store => {
                const shopAddr = typeof store.shopAddress === 'object' ? store.shopAddress : null;
                return shopAddr && shopAddr.latitude && shopAddr.longitude;
            });
            
            console.log('📍 Stores with valid coordinates:', storesWithCoords.length);
            
            storesWithCoords.forEach((store, idx) => {
                const addr = store.shopAddress as any;
                console.log(`   ${idx + 1}. ${store.shopName} (${store.category}) - Lat: ${addr.latitude}, Lng: ${addr.longitude}`);
            });

            const storesWithoutCoords = stores.filter(store => {
                const shopAddr = typeof store.shopAddress === 'object' ? store.shopAddress : null;
                return !shopAddr || !shopAddr.latitude || !shopAddr.longitude;
            });

            if (storesWithoutCoords.length > 0) {
                console.warn('⚠️ Stores WITHOUT coordinates:', storesWithoutCoords.length);
                storesWithoutCoords.forEach((store, idx) => {
                    console.warn(`   ${idx + 1}. ${store.shopName} - shopAddress:`, store.shopAddress);
                });
            }
        }
    }, [showStores, stores]);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            console.log('🔍 Requesting geolocation...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('✅ Geolocation Success:', location);
                    setCurrentLocation(location);
                    setMapCenter(location);
                    setLoading(false);
                },
                (error) => {
                    console.error('❌ Geolocation Error:', error);
                    console.error('   Error Code:', error.code);
                    console.error('   Error Message:', error.message);
                    // Error codes: 1=Permission Denied, 2=Position Unavailable, 3=Timeout
                    setLoading(false);
                    // Fall back to default location (Lagos)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,  // 10 seconds timeout
                    maximumAge: 0    // Don't use cached position
                }
            );
        } else {
            console.warn('⚠️ Geolocation is not supported');
            setLoading(false);
        }
    }, []);

    const markerData = [
        {lng: 3.3792, lat: 6.5244, title: "Lagos Center"},
        {lng: 3.5, lat: 6.6, title: "Marker 2"},
        {lng: 3.3, lat: 6.45, title: "Marker 3"}
    ];

    // Log when geolocation completes
    useEffect(() => {
        if (!loading && currentLocation) {
            console.log('✅ Location loaded, map centered at:', currentLocation);
        }
    }, [loading, currentLocation]);

    // Handler: Center map on current location
    const handleCenterOnLocation = () => {
        console.log('🧭 Center button clicked');
        console.log('   currentLocation:', currentLocation);
        if (currentLocation) {
            console.log('   Setting map center to:', currentLocation);
            setMapCenter(currentLocation);
            setZoom(15);
        } else {
            console.warn('   ⚠️ No current location available');
        }
    };

    // Handler: Zoom in
    const handleZoomIn = () => {
        console.log('➕ Zoom In clicked');
        console.log('   Current zoom:', zoom);
        const newZoom = Math.min(zoom + 1, 21);
        console.log('   Setting zoom to:', newZoom);
        setZoom(newZoom);
    };

    // Handler: Zoom out
    const handleZoomOut = () => {
        console.log('➖ Zoom Out clicked');
        console.log('   Current zoom:', zoom);
        const newZoom = Math.max(zoom - 1, 1);
        console.log('   Setting zoom to:', newZoom);
        setZoom(newZoom);
    };

    // Handler: Reset to default location
    const handleResetLocation = () => {
        console.log('🔄 Reset button clicked');
        console.log('   Resetting to Lagos center');
        setMapCenter({
            lat: 6.5244,
            lng: 3.3792
        });
        setZoom(15);
        console.log('   Reset complete');
    };

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0">
            {loading && (
                <div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-10 pointer-events-none">
                    <p className="text-sm text-gray-600">Loading your location...</p>
                </div>
            )}

            {/* Map Controls Panel */}
            <div className="absolute bottom-22  right-6 z-20 flex flex-col   gap-2">
                {/* Center on Location Button */}
                <button
                    onClick={handleCenterOnLocation}
                    disabled={!currentLocation}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center"
                    title="Center map on your location"
                >
                    <Navigation size={20} />
                </button>

                {/* Zoom In Button */}
                <button
                    onClick={handleZoomIn}
                    className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center border border-gray-200"
                    title="Zoom in"
                >
                    <Plus size={20} />
                </button>

                {/* Zoom Out Button */}
                <button
                    onClick={handleZoomOut}
                    className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center border border-gray-200"
                    title="Zoom out"
                >
                    <Minus size={20} />
                </button>

                {/* Reset Location Button */}
                <button
                    onClick={handleResetLocation}
                    className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center border border-gray-200"
                    title="Reset to default location"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Zoom Level Display */}
            <div className="absolute bottom-6 left-6 bg-white px-3 py-2 rounded-lg shadow-lg z-20">
                <p className="text-xs text-gray-600">Zoom: {zoom}</p>
            </div>

            {/* Category Legend */}
            {showStores && (
                <div className="absolute top-24 left-6 bg-white rounded-lg shadow-lg z-20 p-3 max-w-xs">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Shop Categories</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                            <div key={category} className="flex items-center gap-2">
                                <div 
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: color,
                                        borderRadius: '2px',
                                        border: '1px solid #ddd'
                                    }} 
                                />
                                <span className="text-gray-700 capitalize">{category}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <div 
                            style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#4F46E5',
                                borderRadius: '2px',
                                border: '1px solid #ddd'
                            }} 
                        />
                        <span className="text-gray-700">Other</span>
                    </div>
                </div>
            )}

            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}}
                center={mapCenter}
                zoom={zoom}
                options={{
                    fullscreenControl: true,
                    zoomControl: false,
                    streetViewControl: true,
                    mapTypeControl: true
                }}
            >
                {/* Current location marker */}
                {currentLocation && (
                    <CurrentLocationMarker
                        lat={currentLocation.lat}
                        lng={currentLocation.lng}
                        text="You are here"
                    />
                )}

                {/* Store markers - show when showStores is true */}
                {showStores && stores.map((store) => {
                    const shopAddress = typeof store.shopAddress === 'object' ? store.shopAddress : null;
                    if (shopAddress && shopAddress.latitude && shopAddress.longitude) {
                        const markerColor = getCategoryColor(store.category);
                        return (
                            <StoreMarker
                                key={store._id}
                                lat={shopAddress.latitude}
                                lng={shopAddress.longitude}
                                text={store.shopName}
                                shopName={store.shopName}
                                category={store.category}
                                color={markerColor}
                            />
                        );
                    }
                    return null;
                })}

                {/* Other markers - hide when showing stores */}
                {!showStores && markerData.map((marker, index) => (
                    <Marker
                        key={index}
                        lat={marker.lat}
                        lng={marker.lng}
                        text={marker.title}
                    />
                ))}
            </GoogleMapReact>
        </div>
    );
}
