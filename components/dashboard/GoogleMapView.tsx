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
const StoreMarker = ({text, shopName, category, color, onClick, isSelected}: { text: string, shopName?: string, category?: string, color?: string, onClick?: (e: React.MouseEvent) => void, isSelected?: boolean, lat: number, lng: number }) => {
    const markerColor = color || getCategoryColor(category);
    
    return (
        <div 
            style={{position: 'relative', cursor: 'pointer'}} 
            title={`${shopName} (${category || 'Uncategorized'})`} 
            onClick={onClick}
        >
            <img
                src="/shop.svg"
                alt={shopName}
                style={{
                    width: '40px',
                    height: '48px',
                    filter: isSelected ? `drop-shadow(0 0 12px rgba(0,0,0,0.6))` : `drop-shadow(0 2px 8px rgba(0,0,0,0.3))`,
                    opacity: isSelected ? 1 : 0.7,
                    transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                    transition: 'transform 0.2s ease-in-out, filter 0.3s ease-in-out, opacity 0.3s ease-in-out',
                    cursor: 'pointer',
                    marginLeft: '-20px',
                    marginTop: '-24px'
                }}
                onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.2)';
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                }}
            />
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
    onLocationClick?: (lat: number, lng: number) => void;
    mapCenter?: { lat: number; lng: number };
    zoom?: number;
}

export default function GoogleMapView({ showStores = false, stores = [], onLocationClick, mapCenter: propMapCenter, zoom: propZoom }: GoogleMapViewProps) {
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [mapCenter, setMapCenter] = useState(
        propMapCenter || {
            lat: 6.5244,
            lng: 3.3792
        }
    );
    const [zoom, setZoom] = useState(propZoom || 15);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const mapRef = useRef<any>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Update map center and zoom when props change
    useEffect(() => {
        if (propMapCenter) {
            setMapCenter(propMapCenter);
        }
    }, [propMapCenter]);

    useEffect(() => {
        if (propZoom) {
            setZoom(propZoom);
        }
    }, [propZoom]);

    // Handle click outside the card to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                // Check if the click was on a marker (inside the map)
                const mapElement = document.querySelector('[role="region"]');
                if (mapElement && mapElement.contains(event.target as Node)) {
                    // Clicked on map/marker, close card
                    setSelectedVendor(null);
                }
            }
        };

        if (selectedVendor) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [selectedVendor]);

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
                <div className="absolute top-8 right-16 bg-white rounded-lg shadow-lg z-20 p-3 max-w-xs">
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
                        const isSelected = selectedVendor?._id === store._id;
                        
                        return (
                            <StoreMarker
                                key={store._id}
                                lat={shopAddress.latitude}
                                lng={shopAddress.longitude}
                                text={store.shopName}
                                shopName={store.shopName}
                                category={store.category}
                                color={markerColor}
                                isSelected={isSelected}
                                onClick={(e) => {
                                    setSelectedVendor(store);
                                }}
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

            {/* Vendor Info Card */}
            {selectedVendor && (
                <div 
                    ref={cardRef}
                    className="absolute bg-white rounded-lg shadow-xl z-30 w-80 p-4 max-h-96 overflow-y-auto"
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    <style>{`
                        @keyframes slideIn {
                            from {
                                opacity: 0;
                                transform: translate(-50%, -60%);
                            }
                            to {
                                opacity: 1;
                                transform: translate(-50%, -50%);
                            }
                        }
                    `}</style>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800">{selectedVendor.shopName}</h3>
                        <button
                            onClick={() => {
                                setSelectedVendor(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full capitalize">
                            {selectedVendor.category || 'Uncategorized'}
                        </span>
                    </div>

                    {/* Shop Details */}
                    <div className="space-y-2 text-sm">
                        {/* Email */}
                        {selectedVendor.shopEmail && (
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">Email:</span>
                                <a href={`mailto:${selectedVendor.shopEmail}`} className="text-indigo-600 hover:underline break-all">
                                    {selectedVendor.shopEmail}
                                </a>
                            </div>
                        )}

                        {/* Primary Phone */}
                        {selectedVendor.shopPrimaryPhoneNumber && (
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">Phone:</span>
                                <a href={`tel:${selectedVendor.shopPrimaryPhoneNumber}`} className="text-indigo-600 hover:underline">
                                    {selectedVendor.shopPrimaryPhoneNumber}
                                </a>
                            </div>
                        )}

                        {/* Secondary Phone */}
                        {selectedVendor.shopSecondaryPhoneNumber && (
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">Alt Phone:</span>
                                <a href={`tel:${selectedVendor.shopSecondaryPhoneNumber}`} className="text-indigo-600 hover:underline">
                                    {selectedVendor.shopSecondaryPhoneNumber}
                                </a>
                            </div>
                        )}

                        {/* Owner Name */}
                        {selectedVendor.ownerName && (
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">Owner:</span>
                                <span className="text-gray-700">{selectedVendor.ownerName}</span>
                            </div>
                        )}

                        {/* Sales Type */}
                        {selectedVendor.saleType && (
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">Sales:</span>
                                <span className="text-gray-700 capitalize">{selectedVendor.saleType}</span>
                            </div>
                        )}

                        {/* Address */}
                        {typeof selectedVendor.shopAddress === 'object' && selectedVendor.shopAddress && (
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">Address:</span>
                                <span className="text-gray-700 text-xs">
                                    {[
                                        (selectedVendor.shopAddress as any).street,
                                        (selectedVendor.shopAddress as any).city,
                                        (selectedVendor.shopAddress as any).state
                                    ].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-3"></div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {selectedVendor.shopEmail && (
                            <a
                                href={`mailto:${selectedVendor.shopEmail}`}
                                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100 transition text-center"
                            >
                                Email
                            </a>
                        )}
                        {selectedVendor.shopPrimaryPhoneNumber && (
                            <a
                                href={`tel:${selectedVendor.shopPrimaryPhoneNumber}`}
                                className="flex-1 px-3 py-2 bg-green-50 text-green-600 text-xs font-semibold rounded hover:bg-green-100 transition text-center"
                            >
                                Call
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
