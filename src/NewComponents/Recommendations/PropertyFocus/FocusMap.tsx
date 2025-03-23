import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PropertyCoordinates } from '../../../utils/mapUtils';

interface FocusMapProps {
  coordinates: PropertyCoordinates;
  propertyName: string;
}

const FocusMap: React.FC<FocusMapProps> = ({ coordinates, propertyName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Make sure coordinates are valid
    if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      console.error('Invalid coordinates:', coordinates);
      return;
    }

    // Initialize map if ref is available and map not already initialized
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map instance with zIndex control
      mapInstanceRef.current = L.map(mapRef.current, {
        // Set lower z-index for map panes
        zoomControl: false, // We'll add zoom control with custom options
        renderer: L.canvas({ padding: 0.5 })
      }).setView(
        [coordinates.lat, coordinates.lng],
        15 // Default zoom level
      );

      // Add zoom control with specific position and z-index
      L.control.zoom({
        position: 'topright'
      }).addTo(mapInstanceRef.current);

      // Add OpenStreetMap tile layer with controlled z-index
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Create a custom icon for the marker
      const propertyIcon = L.icon({
        iconUrl: '/images/map-marker.png', // Replace with your marker icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Add a marker at the property location
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon: propertyIcon,
        title: propertyName,
      }).addTo(mapInstanceRef.current);

      // Add a popup with property name
      marker.bindPopup(`<b>${propertyName}</b>`).openPopup();
      
      // Manually control z-index of Leaflet's panes
      if (mapInstanceRef.current.getPane('mapPane')) {
        mapInstanceRef.current.getPane('mapPane')!.style.zIndex = "200";
      }
      if (mapInstanceRef.current.getPane('tilePane')) {
        mapInstanceRef.current.getPane('tilePane')!.style.zIndex = "201";
      }
      if (mapInstanceRef.current.getPane('overlayPane')) {
        mapInstanceRef.current.getPane('overlayPane')!.style.zIndex = "202";
      }
      if (mapInstanceRef.current.getPane('shadowPane')) {
        mapInstanceRef.current.getPane('shadowPane')!.style.zIndex = "203";
      }
      if (mapInstanceRef.current.getPane('markerPane')) {
        mapInstanceRef.current.getPane('markerPane')!.style.zIndex = "204";
      }
      if (mapInstanceRef.current.getPane('tooltipPane')) {
        mapInstanceRef.current.getPane('tooltipPane')!.style.zIndex = "205";
      }
      if (mapInstanceRef.current.getPane('popupPane')) {
        mapInstanceRef.current.getPane('popupPane')!.style.zIndex = "206";
      }
      
      // Add custom CSS to control Leaflet's control z-index
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        .leaflet-control { z-index: 207 !important; }
        .leaflet-control-container { z-index: 207 !important; }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }

    // Cleanup function to destroy map when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, propertyName]);

  // Force map to update its size when it becomes visible
  useEffect(() => {
    const resizeMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    // Add resize listener
    window.addEventListener('resize', resizeMap);

    // Call once after a short delay to ensure container is fully rendered
    const timer = setTimeout(resizeMap, 500);

    return () => {
      window.removeEventListener('resize', resizeMap);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      <div 
        ref={mapRef} 
        className="h-64 w-full"
        role="application"
        aria-label={`Map showing location of ${propertyName}`}
        style={{ zIndex: 1 }} // Low z-index for the map container
      />
    </div>
  );
};

export default FocusMap;