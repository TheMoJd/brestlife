import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Place } from '../gen/openapi';

// Constants
const CONTAINER_STYLE = {
    width: '100%',
    height: '400px',
};

const DEFAULT_CENTER = {
    lat: 48.390,
    lng: -4.486,
};

const DEFAULT_ZOOM = 12;
const MAX_ZOOM = 15;
const MAP_LOAD_DELAY = 100;

const LIBRARIES = ['marker'] as const;

// Custom styles for the map
const MAP_STYLES = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "color": "#a3c1e0" // Pastel sky blue color
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off" // Hide road names
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

interface GoogleMapProps {
    places: Place[];
    filterKey?: string; // Made optional since it's not used in the component
}

const MyGoogleMap: React.FC<GoogleMapProps> = ({ places }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const [mapReady, setMapReady] = useState(false);

    // Get valid places with coordinates
    const validPlaces = places.filter(place =>
        place.latitude !== undefined &&
        place.longitude !== undefined
    );

    // Clear existing markers
    const clearMarkers = useCallback(() => {
        if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        }
    }, []);

    // Create markers
    const createMarkers = useCallback(() => {
        if (!mapRef.current || !validPlaces.length) return;

        clearMarkers();

        markersRef.current = validPlaces.map(place => {
            return new google.maps.Marker({
                position: {
                    lat: Number(place.latitude),
                    lng: Number(place.longitude)
                },
                map: mapRef.current,
                title: place.name
            });
        });
    }, [validPlaces, clearMarkers]);

    // Adjust map bounds to show all markers
    const adjustMapBounds = useCallback(() => {
        if (!mapRef.current || !validPlaces.length) return;

        try {
            const bounds = new google.maps.LatLngBounds();

            validPlaces.forEach(place => {
                bounds.extend({
                    lat: Number(place.latitude),
                    lng: Number(place.longitude)
                });
            });

            mapRef.current.fitBounds(bounds);

            // Limit maximum zoom level
            const listener = google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
                if (mapRef.current && mapRef.current.getZoom()! > MAX_ZOOM) {
                    mapRef.current.setZoom(MAX_ZOOM);
                }
            });

            return () => {
                google.maps.event.removeListener(listener);
            };
        } catch (error) {
            console.error("Error adjusting map bounds:", error);

            // Fallback to default center
            if (mapRef.current) {
                mapRef.current.setCenter(DEFAULT_CENTER);
                mapRef.current.setZoom(DEFAULT_ZOOM);
            }
        }
    }, [validPlaces]);

    // Handle map initialization
    const handleMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        setTimeout(() => setMapReady(true), MAP_LOAD_DELAY);
    }, []);

    // Update map when places change or map becomes ready
    useEffect(() => {
        if (isLoaded && mapReady) {
            createMarkers();
            adjustMapBounds();
        }

        // Clean up markers when component unmounts
        return () => {
            clearMarkers();
        };
    }, [isLoaded, mapReady, createMarkers, adjustMapBounds, clearMarkers]);

    if (!isLoaded) {
        return <div>Chargement de la carte...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={CONTAINER_STYLE}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            onLoad={handleMapLoad}
            options={{ styles: MAP_STYLES }} // Apply custom styles
        />
    );
};

export default MyGoogleMap;