import React from 'react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { NewPropertyFormData, StepProps } from '../propertyTypes';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';
import { PROPERTY_TYPES, SPECIFIC_TYPES } from './propertyConstants';

interface CustomSuggestion extends Suggestion {
  active?: boolean;
}

export const BasicInfo: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleLocationSelect = async (address: string) => {
    try {
      // Create a new geocoder instance
      const geocoder = new window.google.maps.Geocoder();
      
      // Perform geocoding
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed with status: ${status}`));
          }
        });
      });

      const location = results[0].geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      console.log('Geocoded coordinates:', { lat, lng });

      setFormData(prev => ({
        ...prev,
        location: address,
        streetAddress: results[0].formatted_address,
        googleMapsURL: `https://www.google.com/maps?q=${lat},${lng}`,
        coordinates: {
          lat,
          lng
        }
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value,
      streetAddress: '',
      googleMapsURL: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    }));
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Property Name*</label>
        <input
          type="text"
          value={formData.propertyName}
          onChange={(e) => setFormData(prev => ({...prev, propertyName: e.target.value}))}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          placeholder="Enter property name"
          required
        />
      </div>

      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Property Type*</label>
        <select
          value={formData.propertyType}
          onChange={(e) => {
            const propertyType = e.target.value as NewPropertyFormData['propertyType'];
            setFormData(prev => ({
              ...prev,
              propertyType,
              specificType: SPECIFIC_TYPES[propertyType]?.[0] || '' // Set first specific type as default
            }));
          }}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          required
        >
          <option value="">Select type</option>
          {PROPERTY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {formData.propertyType && (
        <div>
          <label className="font-helvetica-regular text-slategray block mb-2">Specific Type*</label>
          <select
            value={formData.specificType}
            onChange={(e) => setFormData(prev => ({...prev, specificType: e.target.value}))}
            className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
            required
          >
            <option value="">Select specific type</option>
            {SPECIFIC_TYPES[formData.propertyType].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Street Address*</label>
        <input
          type="text"
          value={formData.streetAddress}
          onChange={(e) => setFormData(prev => ({...prev, streetAddress: e.target.value}))}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          placeholder="Enter street address"
          required
        />
      </div>

      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Location</label>
        <PlacesAutocomplete
          value={formData.location}
          onChange={handleLocationChange}
          onSelect={handleLocationSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Enter location',
                  className: 'w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none'
                })}
              />
              <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-auto">
                {loading && <div className="p-2">Loading...</div>}
                {suggestions.map((suggestion) => {
                  const customSuggestion = suggestion as CustomSuggestion;
                  const className = customSuggestion.active
                    ? 'p-2 hover:bg-gray-100 cursor-pointer bg-gray-100'
                    : 'p-2 hover:bg-gray-100 cursor-pointer';
                  return (
                    <div
                      key={customSuggestion.placeId}
                      {...getSuggestionItemProps(customSuggestion, {
                        className,
                      })}
                    >
                      <span>{customSuggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>

      <div className="flex items-center space-x-4">
        <FaHome className="text-celadon text-xl" />
        <span className="font-helvetica-light text-slategray">Step 1 of 4</span>
      </div>
    </motion.div>
  );
};