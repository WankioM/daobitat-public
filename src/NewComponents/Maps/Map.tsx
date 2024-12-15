import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';
import { propertyService } from '../../services/propertyService';
import { LatLngExpression } from 'leaflet';
import { useNavigate } from 'react-router-dom';

interface MapProps {
  position?: LatLngExpression;
}

const Map: React.FC<MapProps> = ({ position }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertyService.getLatestProperties();
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const defaultPosition: LatLngExpression = [-1.2921, 36.8219]; // Default to Kenya (Nairobi)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        center={position || defaultPosition}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {properties.map((property) => {
          // Here we would need to geocode the address to get lat/lng
          // For now, we'll use a dummy position
          const position: LatLngExpression = [51.505, -0.09];
          
          return (
            <Marker 
              key={property._id} 
              position={position}
              eventHandlers={{
                click: () => navigate(`/property/${property._id}`)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{property.propertyName}</h3>
                  <p className="text-sm">{property.streetAddress}</p>
                  <p className="text-sm font-semibold">${property.price.toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;