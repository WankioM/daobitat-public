import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { StepProps } from '../propertyTypes';
import LocationPicker from './LocationPicker';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const LocationSearch: React.FC<StepProps> = ({ formData, setFormData }) => {
  const [locationSelected, setLocationSelected] = useState(false);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData({
      ...formData,
      location: location.address,
      streetAddress: location.address,
      coordinates: {
        lat: location.lat,
        lng: location.lng
      }
    });
    setLocationSelected(true);
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-helvetica-medium text-lg text-slategray mb-4">Search for Location</h3>
        <p className="text-gray-600 mb-4">
          Use the search box below to find the general location of your property. 
          You'll be able to fine-tune the exact position in the next step.
        </p>
        
        <LocationPicker 
          initialLocation={formData.location}
          initialCoordinates={
            formData.coordinates.lat !== 0 ? formData.coordinates : undefined
          }
          onLocationSelect={handleLocationSelect}
          height="300px"
          showMapControls={false} // Hide the map in this step
        />
      </div>
      
      {locationSelected && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">Location Selected!</p>
              <p className="text-green-700">{formData.location}</p>
              <p className="text-sm text-green-600 mt-1">
                Click "Next" to confirm the exact position on the map.
              </p>
            </div>
          </div>
        </div>
      )}

      {!locationSelected && formData.location && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-celadon mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-helvetica-regular text-slategray">Current Location:</p>
              <p className="font-helvetica-light text-sm text-gray-600 mt-1">{formData.location}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <FaSearch className="text-celadon text-xl" />
        <span className="font-helvetica-light text-slategray">Step 2 of 5</span>
      </div>
    </motion.div>
  );
};