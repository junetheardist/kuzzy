"use client";

import {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react';

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

export default function GoogleMapView() {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState({
        lat: 6.5244,
        lng: 3.3792
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log(location);
                    setCurrentLocation(location);
                    setMapCenter(location);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLoading(false);
                    // Fall back to default location (Lagos)
                }
            );
        } else {
            console.error('Geolocation is not supported');
            setLoading(false);
        }
    }, []);

    const markerData = [
        {lng: 3.3792, lat: 6.5244, title: "Lagos Center"},
        {lng: 3.5, lat: 6.6, title: "Marker 2"},
        {lng: 3.3, lat: 6.45, title: "Marker 3"}
    ];

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0">
            {loading && (
                <div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-10">
                    <p className="text-sm text-gray-600">Loading your location...</p>
                </div>
            )}
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}}
                center={mapCenter}
                defaultZoom={15}
                options={{
                    fullscreenControl: true,
                    zoomControl: true,
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

                {/* Other markers */}
                {markerData.map((marker, index) => (
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
