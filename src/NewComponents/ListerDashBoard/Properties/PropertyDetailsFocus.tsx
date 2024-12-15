
import React from 'react';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';
import { Property } from './propertyTypes';

interface PropertyDetailsSectionProps {
  property: Property;
  editedProperty: Property;
  isEditing: boolean;
  setEditedProperty: (fn: (prev: Property) => Property) => void;
}

export const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({
  property,
  editedProperty,
  isEditing,
  setEditedProperty,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="font-semibold text-gray-700 block mb-1">Location</label>
        {isEditing ? (
          <input
            type="text"
            value={editedProperty.streetAddress}
            onChange={(e) => setEditedProperty(prev => ({...prev, streetAddress: e.target.value}))}
            className="w-full p-2 border rounded focus:border-celadon outline-none"
          />
        ) : (
          <p className="text-gray-800">{property.streetAddress}</p>
        )}
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">Price</label>
        {isEditing ? (
          <input
            type="number"
            value={editedProperty.price}
            onChange={(e) => setEditedProperty(prev => ({...prev, price: Number(e.target.value)}))}
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
              onChange={(e) => setEditedProperty(prev => ({...prev, bedrooms: Number(e.target.value)}))}
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
              onChange={(e) => setEditedProperty(prev => ({...prev, bathrooms: Number(e.target.value)}))}
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
            onChange={(e) => setEditedProperty(prev => ({...prev, space: Number(e.target.value)}))}
            className="w-full p-2 border rounded focus:border-celadon outline-none"
          />
        ) : (
          <div className="flex items-center gap-2">
            <FaRuler />
            <span>{property.space} sqft</span>
          </div>
        )}
      </div>
    </div>
  );
};

// PropertyAmenities.tsx
interface PropertyAmenitiesProps {
  property: Property;
  editedProperty: Property;
  isEditing: boolean;
  setEditedProperty: (fn: (prev: Property) => Property) => void;
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({
  property,
  editedProperty,
  isEditing,
  setEditedProperty,
}) => {
  return (
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
                  onChange={(e) => setEditedProperty(prev => ({
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
  );
};