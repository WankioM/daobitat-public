import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaArrowLeft, FaRulerCombined } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../NewContexts/UserContext';
import { getMongoId } from '../../../utils/mongoUtils';
import ImageGallery from '../../Recommendations/ImageGallery';
import { propertyService } from '../../../services/propertyService';
import { offerService, Offer } from '../../../services/offerService';
import FocusMap from '../../Recommendations/PropertyFocus/FocusMap';
import { Header } from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StatefulOfferCard from '../../Messages/StatefulOfferCard';
import { OfferDetails } from '../../../types/offers';
import { Property } from '../../../types/common';
import { OfferAction } from '../../../store/offerStore';
import * as offerStoreModule from '../../../store/offerStore';

interface ExtendedProperty extends Property {
  amenities?: {
    furnished?: boolean;
    pool?: boolean;
    gym?: boolean;
    garden?: boolean;
    parking?: boolean;
  };
  features?: string[];
  bedrooms?: number;
  bathrooms?: number;
  coordinates?: { lat: number; lng: number };
  additionalComments?: string;
}

// Helper function to convert Offer to OfferDetails
const convertToOfferDetails = (offer: Offer): Offer => {
  return {
    _id: offer._id,
    amount: offer.amount,
    currency: offer.currency || 'USD',
    currencySymbol: offer.currencySymbol || '$',
    duration: offer.duration,
    status: offer.status,
    securityDeposit: offer.securityDeposit,
    moveInDate: offer.moveInDate,
    tenant: offer.tenant,
    owner: offer.owner,
    isCounterOffer: offer.isCounterOffer || false,
    // Add required properties that are missing:
    property: offer.property,
    totalAmount: offer.totalAmount || (offer.amount + offer.securityDeposit),
    transactionType: offer.transactionType || 'rental',
    expiry: offer.expiry || new Date(),
    createdAt: offer.createdAt || new Date(),
    updatedAt: offer.updatedAt || new Date(),
    payment: offer.payment || {
      status: 'pending',
      depositPaid: false,
      rentPaid: false,
      history: []
    },
    escrow: offer.escrow || {
      status: 'pending',
      depositHeld: 0,
      rentHeld: 0,
      lastUpdated: new Date()
    },
    contract: offer.contract || {
      tenantSigned: false,
      ownerSigned: false
    },
  };
};

const OfferPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [property, setProperty] = useState<ExtendedProperty | null>(null);
  const [offer, setOffer] = useState<OfferDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Get the offer store methods
  const offerStore = offerStoreModule.default || offerStoreModule;
  const { 
    storeHandleOfferAction,
    processing: offerProcessing = false
  } = offerStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      console.log('OfferPage: Attempting to fetch offer with ID:', id);
      try {
        setLoading(true);
        
        // First, fetch the offer details
        const offerResponse = await offerService.getOfferById(id);
        console.log('OfferPage: Successfully fetched offer with ID:', id, 'Response:', offerResponse);
        
        // Convert Offer to OfferDetails
        const offerDetails = convertToOfferDetails(offerResponse);
// Ensure the property field is properly structured
if (offerDetails.property && typeof offerDetails.property === 'object') {
  // Make sure images is never undefined
  (offerDetails.property as any).images = (offerDetails.property as any).images || [];
}
setOffer(offerDetails as any);
        
        // Then fetch the associated property using property field from offer
        if (offerResponse && offerResponse.property) {
          const propertyId = typeof offerResponse.property === 'string' 
            ? offerResponse.property 
            : getMongoId(offerResponse.property);
            
          if (propertyId) {
            const propertyRes = await propertyService.getPropertyById(propertyId);
            setProperty(propertyRes.data.data as ExtendedProperty);
          }
        }
      } catch (err) {
        console.error(`OfferPage: Error fetching offer with ID ${id}:`, err);
        setError('Failed to load offer details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGoBack = () => {
    navigate('/listerdashboard', { 
      state: { activeTab: 'Messages' } 
    });
  };

  // Handler for offer actions (accept, reject, etc.)
const handleOfferAction = async (action: OfferAction, offerId: string, data?: any) => {
  try {
    // Handle the action via the store
    await storeHandleOfferAction(offerId, action, data);
    
    // Refresh offer data
    const updatedOfferResponse = await offerService.getOfferById(id || '');
    const updatedOfferDetails = convertToOfferDetails(updatedOfferResponse);
    // Ensure the property field is properly structured
    if (updatedOfferDetails.property && typeof updatedOfferDetails.property === 'object') {
      // Make sure images is never undefined
      (updatedOfferDetails.property as any).images = (updatedOfferDetails.property as any).images || [];
    }
    setOffer(updatedOfferDetails as any);
  } catch (error) {
    console.error(`Error handling offer action ${action}:`, error);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-milk">
        <div className="animate-spin h-12 w-12 border-4 border-rustyred border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !property || !offer || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-milk p-4">
        <h2 className="text-2xl font-bold text-graphite mb-4">Error</h2>
        <p className="text-graphite/70 text-center max-w-md">{error || 'Offer or property not found'}</p>
        <button
          onClick={handleGoBack}
          className="mt-6 flex items-center gap-2 bg-rustyred text-white px-4 py-2 rounded-lg hover:bg-rustyred/90 transition-colors"
        >
          <FaArrowLeft /> Go Back to Messages
        </button>
      </div>
    );
  }

  // Determine which role the current user has
  const tenantId = typeof offer.tenant === 'string' 
    ? offer.tenant 
    : getMongoId(offer.tenant) || '';
    
  const ownerId = typeof offer.owner === 'string' 
    ? offer.owner 
    : getMongoId(offer.owner) || '';
    
  const userId = typeof user._id === 'string' 
    ? user._id 
    : getMongoId(user._id) || '';
  
  // Determine user role
  const isUserTenant = tenantId === userId;
  const isUserOwner = ownerId === userId;
  const userRole = isUserOwner ? 'owner' : 'tenant';
  const isOwn = (userRole === 'tenant' && isUserTenant) || (userRole === 'owner' && isUserOwner);

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
            <FaArrowLeft /> Back to Messages
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
              ${typeof offer.amount === 'number' ? offer.amount.toLocaleString() : property.price?.toLocaleString()}
              <span className="text-sm text-graphite/70">/month</span>
            </div>
          </div>

          {/* Top Section: Image Gallery and Offer Card */}
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

            {/* Right: Offer Card */}
            <div className="space-y-6">
              {/* Offer Card */}
              <div className="bg-white/50 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-graphite mb-4">Offer Details</h2>
                <StatefulOfferCard
                  offer={offer}
                  property={property}
                  userRole={userRole}
                  isOwn={isOwn}
                  onAction={(action, data) => handleOfferAction(action as OfferAction, getMongoId(offer._id) || '', data)}
                />
              </div>
            </div>
          </div>

          {/* Main Content Grid - Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Property Details */}
              <div className="bg-white/50 rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-graphite">Property Details</h2>
                <p className="text-graphite/70">{property.additionalComments || 'This beautiful property offers modern living in a prime location.'}</p>
                
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
                      {property.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rustyred rounded-full"></div>
                          <span className="text-graphite/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Key Features Card */}
              <div className="bg-white/50 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-graphite mb-4">Key Features</h3>
                <div className="space-y-4">
                {property.bedrooms !== undefined && property.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <FaBed className="text-rustyred text-xl" />
                    <div>
                      <span className="font-medium text-graphite">{property.bedrooms}</span>
                      <span className="text-graphite/70 ml-1">Bedrooms</span>
                    </div>
                  </div>
                )}
                                  
                 {property.bathrooms !== undefined && property.bathrooms > 0 && (
                    <div className="flex items-center gap-3">
                      <FaBath className="text-rustyred text-xl" />
                      <div>
                        <span className="font-medium text-graphite">{property.bathrooms}</span>
                        <span className="text-graphite/70 ml-1">Bathrooms</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <FaRulerCombined className="text-rustyred text-xl" />
                    <div>
                      <span className="font-medium text-graphite">{property.space || 'N/A'}</span>
                      <span className="text-graphite/70 ml-1">Sq ft</span>
                    </div>
                  </div>
                  
                  {property.amenities?.parking && (
                    <div className="flex items-center gap-3">
                      <FaParking className="text-rustyred text-xl" />
                      <div>
                        <span className="text-graphite/70">Parking Available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Map Card */}
              {property.coordinates && property.coordinates.lat && property.coordinates.lng && (
                <div className="bg-white/50 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-graphite mb-4">Location</h3>
                  <div className="h-[250px]">
                    <FocusMap 
                      coordinates={property.coordinates}
                      propertyName={property.propertyName}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OfferPage;