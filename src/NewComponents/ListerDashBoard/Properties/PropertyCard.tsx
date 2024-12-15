// src/components/Properties/PropertyCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaRuler, FaTrash } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import DeleteConfirmation from './DeleteConfirmation';
import PropertyFocus from './PropertyFocus';
import ImageCarousel from './ImageCarousel';
import { Property } from './propertyTypes';

interface PropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
  onPropertyUpdated: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete, onPropertyUpdated }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);

  const handleDelete = () => {
    onDelete(property._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="cursor-pointer"
          onClick={() => setShowFocusModal(true)}
        >
          <div className="relative h-48">
            <img 
              src={property.images[0] || '/placeholder-property.jpg'} 
              alt={property.propertyName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-celadon text-slategray px-3 py-1 rounded-full text-sm">
              {property.status.listingState}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Delete property"
            >
              <FaTrash size={16} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">{property.propertyName}</h3>
              <span className="text-lg font-semibold text-slategray">
                ${property.price.toLocaleString()}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{property.location}</p>
            
            <div className="flex items-center gap-4 text-gray-600">
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <FaBed />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <FaBath />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <FaRuler />
                <span>{property.space} sqft</span>
              </div>
              
              <div className="flex items-center gap-1">
                <BiBuildingHouse />
                <span>{property.propertyType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          propertyName={property.propertyName}
        />
      )}

      {showFocusModal && (
        <PropertyFocus
          property={property}
          isOpen={showFocusModal}
          onClose={() => setShowFocusModal(false)}
          onPropertyUpdated={onPropertyUpdated}
        />
      )}
    </>
  );
};

export default PropertyCard;