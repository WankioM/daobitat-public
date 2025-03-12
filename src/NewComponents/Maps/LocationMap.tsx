import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaDirections } from 'react-icons/fa';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address: string;
  height?: string;
  width?: string;
  zoom?: number;
  interactive?: boolean;
  showDirections?: boolean;
}

// Fix Leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  address,
  height = '300px',
  width = '100%',
  zoom = 15,
  interactive = true,
  showDirections = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current && latitude && longitude) {
      // Create map with options
      const map = L.map(mapContainerRef.current, {
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive
      }).setView([latitude, longitude], zoom);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      
      // Add marker
      const marker = L.marker([latitude, longitude], {
        icon: customIcon,
        draggable: false
      }).addTo(map);
      
      // Add popup with address if provided
      if (address) {
        marker.bindPopup(
          `<div class="text-sm p-1">${address}</div>`
        ).openPopup();
      }
      
      mapRef.current = map;
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, address, zoom, interactive]);

  // Generate directions URL for various map services
  const getDirectionsUrl = () => {
    // Google Maps is most widely used
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  return (
    <div className="location-map">
      <div 
        ref={mapContainerRef} 
        style={{ height, width }} 
        className="rounded-lg overflow-hidden border border-gray-200"
      />
      
      {showDirections && (
        <div className="mt-2 flex justify-end">
          <a 
            href={getDirectionsUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-celadon hover:underline text-sm"
          >
            <FaDirections className="mr-1" /> Get Directions
          </a>
        </div>
      )}
    </div>
  );
};

export default LocationMap;