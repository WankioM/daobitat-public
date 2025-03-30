import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBed, FaBath, FaRuler, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import { propertyService } from '../../../services/propertyService';
import { PROPERTY_TYPES, SPECIFIC_TYPES } from './Forms/propertyConstants';
import { Property } from './propertyTypes';
import ImageCarousel from './ImageCarousel';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';

interface PropertyFocusProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onPropertyUpdated: () => void;
}
interface CustomSuggestion extends Suggestion {
  active?: boolean;
}

const PropertyFocus: React.FC<PropertyFocusProps> = ({
  property,
  isOpen,
  onClose,
  onPropertyUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await propertyService.updateProperty(property._id, editedProperty);
      setIsEditing(false);
      onPropertyUpdated();
      setError(null);
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property. Please try again.');
    }
  };

  const handleLocationSelect = async (address: string) => {
    console.log('Location selected:', address); // Add this log
    try {
      // Create a new geocoder instance
      const geocoder = new window.google.maps.Geocoder();
      
      // Perform geocoding
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          console.log('Geocoding status:', status); // Add this log
          console.log('Geocoding results:', results); // Add this log
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
      
      console.log('Setting edited property with:', { // Add this log
        address,
        formattedAddress: results[0].formatted_address,
        coordinates: { lat, lng }
      });
  
      setEditedProperty(prev => ({
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
      console.error('Error geocoding location:', error);
      setError('Failed to get location coordinates. Please try again.');
    }
  };

  const handleLocationChange = (address: string) => {
    setEditedProperty(prev => ({
      ...prev,
      location: address
    }));
  };

  if (!isOpen) return null;

  // Add this function in PropertyFocus.tsx after handleLocationChange
const handleImagesChange = async (updatedImages: string[]) => {
  // Filter out new images (those with blob: urls)
  const newImages = updatedImages.filter(img => img.startsWith('blob:'));
  const existingImages = updatedImages.filter(img => !img.startsWith('blob:'));
  
  if (newImages.length > 0) {
    try {
      // Process new images through the propertyService
      const uploadedImages = await propertyService.processBatchPropertyImages(newImages);
      
      // Update edited property with all images
      setEditedProperty(prev => ({
        ...prev,
        images: [...existingImages, ...uploadedImages.filter(url => url !== null)]
      }));
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Failed to upload one or more images. Please try again.');
    }
  } else {
    // Just update with the existing images
    setEditedProperty(prev => ({
      ...prev,
      images: updatedImages
    }));
  }
};

  return (
    <motion.div
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slategray">Property Details</h2>
          <div className="flex gap-2 ">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-celadon hover:text-opacity-80 transition-colors"
                title="Edit property"
              >
                <FaEdit size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
                <div className="relative h-96">
                  <ImageCarousel 
                    images={editedProperty.images} 
                    className="h-full"
                    editable={isEditing}
                    onImagesChange={(newImages) => {
                      setEditedProperty(prev => ({
                        ...prev,
                        images: newImages
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4 ">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Property Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProperty.propertyName}
                      onChange={(e) => setEditedProperty((prev: Property) => ({...prev, propertyName: e.target.value}))}
                      className="w-full p-2 border rounded focus:border-celadon outline-none"
                    />
                  ) : (
                    <p className="text-gray-800">{property.propertyName}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Property Type</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <select
                        value={editedProperty.propertyType}
                        onChange={(e) => {
                          const propertyType = e.target.value as typeof PROPERTY_TYPES[number];
                          setEditedProperty((prev: Property) => ({
                            ...prev,
                            propertyType,
                            specificType: SPECIFIC_TYPES[propertyType]?.[0] || ''
                          }));
                        }}
                        className="w-full p-2 border rounded focus:border-celadon outline-none"
                      >
                        {PROPERTY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <select
                        value={editedProperty.specificType}
                        onChange={(e) => setEditedProperty((prev: Property) => ({...prev, specificType: e.target.value}))}
                        className="w-full p-2 border rounded focus:border-celadon outline-none"
                      >
                        {SPECIFIC_TYPES[editedProperty.propertyType]?.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-gray-800">{property.propertyType} - {property.specificType}</p>
                  )}
                </div>


                <div>
                <label className="font-semibold text-gray-700 block mb-1">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(property.amenities).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      {isEditing ? (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editedProperty.amenities[key as keyof typeof property.amenities]}
                            onChange={(e) => setEditedProperty((prev: Property) => ({
                              ...prev,
                              amenities: {
                                ...prev.amenities,
                                [key]: e.target.checked
                              }
                            }))}
                            className="form-checkbox text-celadon"
                          />
                          <span className="capitalize">{key}</span>
                        </label>
                      ) : (
                        <>
                          <span className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="capitalize">{key}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>

            <div >
              <label className="font-semibold text-gray-700 block mb-1">Additional Comments</label>
              {isEditing ? (
                <textarea
                  value={editedProperty.additionalComments}
                  onChange={(e) => setEditedProperty((prev: Property) => ({
                    ...prev, 
                    additionalComments: e.target.value
                  }))}
                  className="w-full p-2 border rounded focus:border-celadon outline-none min-h-[150px] resize-y"
                  placeholder="Add any additional details about your property..."
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">
                  {property.additionalComments || 'No additional comments'}
                </p>
              )}
            
            
            <div className="space-y-6 ">
              <div>
              <div className="relative"> {/* First relative wrapper */}
                <label className="font-semibold text-gray-700 block mb-1">Location</label>
                {isEditing ? (
                  <div className="relative"> {/* Keep this as relative */}
                    <PlacesAutocomplete
                      value={editedProperty.location}
                      onChange={handleLocationChange}
                      onSelect={handleLocationSelect}
                    >
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="relative">
                          <input
                            {...getInputProps({
                              placeholder: 'Enter location',
                              className: 'w-full p-2 border rounded focus:outline-none focus:border-celadon'
                            })}
                          />
                          <div 
                            className="absolute left-0 right-0 z-[9999] bg-white shadow-lg rounded-lg mt-1"
                            style={{
                              maxHeight: '200px',
                              overflow: 'auto'
                            }}
                          >
                            {loading && <div className="p-2 text-gray-500">Loading...</div>}
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
                                    onClick: () => handleLocationSelect(suggestion.description) // Add explicit onClick handler
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
                ) : (
                  <span>{editedProperty.location}</span>
                )}
              </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Price</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProperty.price}
                    onChange={(e) => setEditedProperty((prev: Property) => ({...prev, price: Number(e.target.value)}))}
                    className="w-full p-2 border rounded focus:border-celadon outline-none"
                  />
                ) : (
                  <p className="text-gray-800">${property.price.toLocaleString()}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Bedrooms</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProperty.bedrooms}
                      onChange={(e) => setEditedProperty((prev: Property) => ({...prev, bedrooms: Number(e.target.value)}))}
                      className="w-full p-2 border rounded focus:border-celadon outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaBed />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Bathrooms</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProperty.bathrooms}
                      onChange={(e) => setEditedProperty((prev: Property) => ({...prev, bathrooms: Number(e.target.value)}))}
                      className="w-full p-2 border rounded focus:border-celadon outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaBath />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Space (sqft)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProperty.space}
                    onChange={(e) => setEditedProperty((prev: Property) => ({...prev, space: Number(e.target.value)}))}
                    className="w-full p-2 border rounded focus:border-celadon outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FaRuler />
                    <span>{property.space} sqft</span>
                  </div>
                )}
              </div>

             

              {property.googleMapsURL && (
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Google Maps</label>
                  <a
                    href={property.googleMapsURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-celadon hover:text-opacity-80"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
            
            </div>

            
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedProperty(property);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-celadon text-white rounded hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyFocus;