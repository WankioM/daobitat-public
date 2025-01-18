import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';
import { propertyService } from '../../../services/propertyService';
import ImageGallery from '../ImageGallery';
import MessageOwner from '../MessageOwner';
import MakeOfferModal from '../../PaymentFlow/Offer/MakeOfferModal';
import { FaMapMarkerAlt, FaBed, FaParking, FaTree, FaHandshake } from 'react-icons/fa';

const PropertyTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await propertyService.getPropertyById(id);
        setProperty(response.data);
      } catch (err) {
        setError('Failed to load property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-celadon"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Property not found'}
          </h2>
          <a href="/" className="text-celadon hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery Section */}
      <div className="h-[70vh] relative">
        <ImageGallery
          images={property.images || []}
          selectedIndex={selectedImageIndex}
          onSelect={setSelectedImageIndex}
        />
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Details - Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">{property.propertyName}</h1>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <p>{property.location}</p>
              </div>
              <div className="text-3xl font-semibold text-celadon">
                {property.currency} {property.price.toLocaleString()}
                <span className="text-sm text-gray-600">/month</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              {/* ... existing property details ... */}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              {/* ... existing amenities ... */}
            </div>

            {/* Additional Information */}
            {property.additionalComments && (
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                {/* ... existing additional info ... */}
              </div>
            )}
          </div>

          {/* Actions - Right Column */}
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <MessageOwner
                  propertyId={property._id}
                  propertyName={property.propertyName}
                  ownerId={property.owner._id}
                  ownerName={property.owner.name}
                />
                
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-celadon text-celadon py-3 px-4 rounded-lg hover:bg-celadon hover:text-white transition-all duration-300 font-medium"
                >
                  <FaHandshake className="text-lg" />
                  <span>Submit Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <MakeOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyName={property.propertyName}
        propertyId={property._id}
        ownerId={property.owner._id}
        listingPrice={property.price}
        currency={property.currency || 'USD'}
      />
    </div>
  );
};

export default PropertyTab;