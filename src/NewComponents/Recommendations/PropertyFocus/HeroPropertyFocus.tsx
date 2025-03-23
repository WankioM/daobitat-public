import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaTree, FaMoneyBillWave, FaArrowLeft, FaRulerCombined } from 'react-icons/fa';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ImageGallery from '../ImageGallery';
import MessageOwner from '../MessageOwner';
import MakeOfferModal from '../../PaymentFlow/Offer/MakeOfferModal';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';
import { propertyService } from '../../../services/propertyService';
import FocusMap from './FocusMap';
import PropertyReviews from './PropertyReviews';
import RecommendedFromSearch from './RecommendedFromSearch';
import { Header } from '../../Header/Header';
import Footer from '../../Footer/Footer';

const HeroPropertyFocus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await propertyService.getPropertyById(id);
        setProperty(response.data.data);
        
        // Increment property clicks
        try {
          await propertyService.incrementPropertyClicks(id);
        } catch (clickError) {
          console.error('Failed to increment property clicks:', clickError);
          // Continue anyway, this is not critical
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSendMessage = () => {
    navigate('/listerdashboard', { state: { activeTab: 'Messages' } });
  };

  const handleGoBack = () => {
    // Go back to previous page in history
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-milk">
        <div className="animate-spin h-12 w-12 border-4 border-rustyred border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-milk p-4">
        <h2 className="text-2xl font-bold text-graphite mb-4">Error</h2>
        <p className="text-graphite/70 text-center max-w-md">{error || 'Property not found'}</p>
        <button
          onClick={handleGoBack}
          className="mt-6 flex items-center gap-2 bg-rustyred text-white px-4 py-2 rounded-lg hover:bg-rustyred/90 transition-colors"
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk/90">
      <Header />
      
      {/* Content container with increased top padding to account for header */}
      <div className="pt-20 pb-16">
        {/* Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-graphite hover:text-rustyred transition-colors"
          >
            <FaArrowLeft /> Back to listings
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Property Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-graphite">{property.propertyName}</h1>
            <div className="flex items-center text-graphite/70">
              <FaMapMarkerAlt className="mr-2" />
              <p>{property.location}</p>
            </div>
            <div className="text-2xl font-semibold text-rustyred mt-2">
              ${property.price.toLocaleString()}
              {property.action === 'for rent' && <span className="text-sm text-graphite/70">/month</span>}
            </div>
          </div>

          {/* Top Section: Image Gallery and Map side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Image Gallery */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <ImageGallery
                images={property.images || []}
                selectedIndex={selectedImageIndex}
                onSelect={setSelectedImageIndex}
                onClose={() => {}} // No longer needed, but keep for component compatibility
                onOpenInTab={() => {}} // No longer needed
              />
            </div>

            {/* Right: Map and Basic Info */}
            <div className="space-y-6">
              {/* Map View */}
              {property.coordinates && property.coordinates.lat && property.coordinates.lng && (
                <div className="h-[250px]">
                  <FocusMap 
                    coordinates={property.coordinates}
                    propertyName={property.propertyName}
                  />
                </div>
              )}

              {/* Key Features */}
              <div className="flex flex-wrap gap-6 bg-white/50 rounded-lg p-6 shadow-sm">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <FaBed className="text-rustyred text-xl" />
                    <div>
                      <p className="font-semibold text-graphite">{property.bedrooms}</p>
                      <p className="text-sm text-graphite/70">Bedrooms</p>
                    </div>
                  </div>
                )}
                
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <FaBath className="text-rustyred text-xl" />
                    <div>
                      <p className="font-semibold text-graphite">{property.bathrooms}</p>
                      <p className="text-sm text-graphite/70">Bathrooms</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <FaRulerCombined className="text-rustyred text-xl" />
                  <div>
                    <p className="font-semibold text-graphite">{property.space}</p>
                    <p className="text-sm text-graphite/70">Sq ft</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-rustyred text-xl" />
                  <div>
                    <p className="font-semibold text-graphite">{property.propertyType}</p>
                    <p className="text-sm text-graphite/70">Type</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Property Details and Contact/Offer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Property Details */}
              <div className="bg-white/50 rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-graphite">Property Details</h2>
                <p className="text-graphite/70">{property.additionalComments || 'This beautiful property offers modern living in a prime location. Contact the owner for more details and to schedule a viewing.'}</p>
                
                {/* Features & Amenities */}
                {property.amenities && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-graphite mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {property.amenities.furnished && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">Furnished</span>
                        </div>
                      )}
                      {property.amenities.parking && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">Parking</span>
                        </div>
                      )}
                      {property.amenities.pool && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">Swimming Pool</span>
                        </div>
                      )}
                      {property.amenities.gym && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">Gym</span>
                        </div>
                      )}
                      {property.amenities.garden && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">Garden</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-graphite mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Property Reviews */}
              <PropertyReviews propertyId={property._id} />
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Contact and Offer Block */}
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <MessageOwner
                propertyId={property._id}
                propertyName={property.propertyName}
                ownerId={typeof property.owner === 'string' ? property.owner : property.owner?._id}
                ownerName={typeof property.owner === 'object' ? property.owner?.name || 'Property Owner' : 'Property Owner'}
              />
                              
                {/* Make Offer Button */}
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-white border-2 border-rustyred text-rustyred py-3 px-4 rounded-lg hover:bg-rustyred hover:text-white transition-all duration-300 font-medium"
                >
                  <FaMoneyBillWave className="text-lg" />
                  <span>Make an Offer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Similar Properties - Carousel Style */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-graphite mb-6">Similar Properties</h2>
            <RecommendedFromSearch 
              currentPropertyId={property._id}
              propertyType={property.specificType || property.propertyType}
              location={property.location}
            />
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      <MakeOfferModal
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          propertyName={property.propertyName}
          propertyId={property._id}
          ownerId={typeof property.owner === 'string' ? property.owner : property.owner?._id}
          listingPrice={property.price}
          currency={property.currency || 'USD'}
          propertyData={property as unknown as import('../../../services/offerService').Property} // Type assertion
        />
      <Footer />
    </div>
  );
};

export default HeroPropertyFocus;