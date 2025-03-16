import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEdit, FaCheck } from 'react-icons/fa';
import L from 'leaflet';
import { StepProps } from '../propertyTypes';
import { googleGeocodingService } from '../../../../services/geocodingService';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Custom marker icon for Leaflet
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const LocationConfirm: React.FC<StepProps> = ({ formData, setFormData }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [locationUpdated, setLocationUpdated] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Fix Leaflet icon issues in React
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Use the coordinates from the previous step
      const initialLat = formData.coordinates.lat || -1.286389;
      const initialLng = formData.coordinates.lng || 36.817223;
      
      // Create map
      const map = L.map(mapContainerRef.current, {
        zoomControl: true
      }).setView([initialLat, initialLng], 16); // Higher zoom level for precision
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add marker at the coordinates from previous step
      markerRef.current = L.marker([initialLat, initialLng], {
        icon: customIcon,
        draggable: true // Allow the marker to be dragged for precise positioning
      }).addTo(map);
      
      // Handle marker drag end
      markerRef.current.on('dragend', async function() {
        if (markerRef.current) {
          const position = markerRef.current.getLatLng();
          await fetchAddress(position.lat, position.lng);
          setLocationUpdated(true);
        }
      });

      // Handle map click for repositioning marker
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        
        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
        
        // Get address for the new coordinates
        await fetchAddress(lat, lng);
        setLocationUpdated(true);
      });
      
      mapRef.current = map;
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [formData.coordinates]);

  // Fetch address for coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      setIsSearching(true);
      
      const result = await googleGeocodingService.reverseGeocode(lat, lng);
      
      setFormData({
        ...formData,
        location: result.formatted_address,
        streetAddress: result.formatted_address,
        coordinates: {
          lat,
          lng
        }
      });
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
        <h3 className="font-helvetica-medium text-lg text-slategray mb-4">Confirm Exact Location</h3>
        <p className="text-gray-600 mb-4">
          Drag the marker or click on the map to refine the exact location of your property.
        </p>
        
        {/* Map container */}
        <div className="h-96 w-full rounded-lg overflow-hidden bg-gray-100 relative border border-gray-200 shadow-sm">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full"
          ></div>
          {isSearching && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-celadon border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Selected location info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-celadon mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-helvetica-regular text-slategray">Selected Location:</p>
            <p className="font-helvetica-light text-sm text-gray-600 mt-1">{formData.location}</p>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
            </p>
            {locationUpdated && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                Location has been updated! Click "Next" to continue.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <FaCheck className="text-celadon text-xl" />
        <span className="font-helvetica-light text-slategray">Step 3 of 5</span>
      </div>
    </motion.div>
  );
};