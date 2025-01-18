import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBed, FaParking, FaTree, FaMoneyBillWave } from 'react-icons/fa';
import ImageGallery from './ImageGallery';
import MessageOwner from './MessageOwner';
import MakeOfferModal from '../PaymentFlow/Offer/MakeOfferModal';
import { useNavigate } from 'react-router-dom';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';

interface HeroPropertyFocusProps {
  property: Property;
  onClose: () => void;
}

const HeroPropertyFocus: React.FC<HeroPropertyFocusProps> = ({ property, onClose }) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleSendMessage = () => {
    navigate('/listerdashboard', { state: { activeTab: 'Messages' } });
  };

  const handleOpenInTab = () => {
    const newWindow = window.open(`/property/${property._id}`, '_blank');
    if (newWindow) newWindow.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Image Gallery */}
        <div className="relative h-[500px]">
          <ImageGallery
            images={property.images || []}
            selectedIndex={selectedImageIndex}
            onSelect={setSelectedImageIndex}
            onClose={onClose}
            onOpenInTab={handleOpenInTab}
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

          {/* Message Owner & Make Offer - Right Column */}
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-4">
              <MessageOwner
                propertyId={property._id}
                propertyName={property.propertyName}
                ownerId={property.owner._id}
                ownerName={property.owner.name}
              />
              
              {/* Make Offer Button */}
              <button
                onClick={() => setShowOfferModal(true)}
                className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-celadon text-celadon py-3 px-4 rounded-lg hover:bg-celadon hover:text-white transition-all duration-300 font-medium"
              >
                <FaMoneyBillWave className="text-lg" />
                <span>Make an Offer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyName={property.propertyName}
        propertyId={property._id}
        ownerId={property.owner._id}
        listingPrice={property.price}
        currency={property.currency || 'KES'}
      />
    </div>
  );
};

export default HeroPropertyFocus;