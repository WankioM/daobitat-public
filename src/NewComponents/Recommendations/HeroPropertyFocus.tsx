import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBed, FaParking, FaTree } from 'react-icons/fa';
import ImageGallery from './ImageGallery';
import MessageOwner from './MessageOwner';
import { useNavigate } from 'react-router-dom';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';

interface HeroPropertyFocusProps {
  property: Property;
  onClose: () => void;
}

const HeroPropertyFocus: React.FC<HeroPropertyFocusProps> = ({ property, onClose }) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleSendMessage = () => {
    navigate('/listerdashboard', { state: { activeTab: 'Messages' } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Image Gallery */}
        <div className="relative h-[500px]">
          <ImageGallery
            images={property.images || []}
            selectedIndex={selectedImageIndex}
            onSelect={setSelectedImageIndex}
          />
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 p-6">
          {/* Main Details - Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{property.propertyName}</h1>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <p>{property.location}</p>
              </div>
              <div className="text-2xl font-semibold text-celadon">
                {property.currency} {property.price.toLocaleString()}
                <span className="text-sm text-gray-600">/night</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-gray-600">{property.propertyType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Space:</span>
                  <span className="text-gray-600">{property.space} sq ft</span>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center space-x-2">
                    <FaBed className="text-gray-500" />
                    <span className="text-gray-600">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities?.parking && (
                  <div className="flex items-center space-x-2">
                    <FaParking className="text-gray-500" />
                    <span className="text-gray-600">Parking</span>
                  </div>
                )}
                {property.amenities?.garden && (
                  <div className="flex items-center space-x-2">
                    <FaTree className="text-gray-500" />
                    <span className="text-gray-600">Garden</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {property.additionalComments && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
                <p className="text-gray-600 leading-relaxed">{property.additionalComments}</p>
              </div>
            )}
          </div>

          {/* Message Owner - Right Column */}
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <MessageOwner
                propertyId={property._id}
                propertyName={property.propertyName}
                ownerId={property.owner._id}
                ownerName={property.owner.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPropertyFocus;