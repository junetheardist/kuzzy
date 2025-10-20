"use client";

import {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

export default function UserMap() {
    const mapContainer = useRef(null);
    const map = useRef<mapboxgl.Map | undefined>(undefined);

    useEffect(() => {
        if (map.current) return; // Initialize map only once
        if (!mapContainer.current) return; // Ensure container exists

        // Set your Mapbox access token
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'your-mapbox-access-token-here';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12', // You can change this to other styles
            center: [3.3792, 6.5244], // [lng, lat] - Lagos coordinates
            zoom: 12
        });

        // Create custom image element for the marker
        const el = document.createElement("img");
        el.src = "/cover.png"; // place your marker image in public/ folder
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.cursor = "pointer";


        // Add a marker at the center (Lagos)
        new mapboxgl.Marker({element: el})
            .setLngLat([3.3792, 6.5244])
            .addTo(map.current);

        const markerData = [
            {lng: 3.3792, lat: 6.5244, title: "Lagos Center"},
            {lng: 3.5, lat: 6.6, title: "Marker 2"},
            {lng: 3.3, lat: 6.45, title: "Marker 3"}
        ];


        // Loop through and add markers
        markerData.forEach((marker) => {
            new mapboxgl.Marker({element: el})
                .setLngLat([marker.lng, marker.lat])
                .setPopup(new mapboxgl.Popup().setText(marker.title)) // optional popup
                .addTo(map.current!);
        });

        // Add navigation controls (zoom buttons)
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Cleanup function
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = undefined;
            }
        };
    }, []);
    return (
        <div className={' absolute top-0 left-0 right-0 bottom-0'}>
            <div
                ref={mapContainer}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        </div>
    )
}

