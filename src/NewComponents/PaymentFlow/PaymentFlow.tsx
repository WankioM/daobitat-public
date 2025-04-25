// PaymentFlow.tsx with fixes for offer ID handling
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaWallet, FaCreditCard, FaMobile, FaArrowLeft, FaSpinner, FaMoneyBillWave } from 'react-icons/fa';
import WalletPayment from './PaymentMethods/WalletPayment';
import CardPayment from './PaymentMethods/CardPayment';
import MPesaPayment from './PaymentMethods/MPesaPayment';
import OffPlatformPayment from './PaymentMethods/OffPlatformPayment';
import PaymentSuccess from './PaymentSuccess';
import { useNavigationStore } from '../../store/navigationStore';
import { useOfferStore } from '../../store/offerStore';
import { offerService } from '../../services/offerService';
import { idToString } from '../../types/common';
import { getMongoId } from '../../utils/mongoUtils';
import { Offer as OfferType } from '../../types/offers';
import { Offer as ServiceOffer, Property as ServiceProperty, User as ServiceUser } from '../../services/offerService';
import { Property as CommonProperty, ID } from '../../types/common';

type PaymentMethod = 'wallet' | 'card' | 'mpesa' | 'off-platform' | null;

// Conversion function to map service offer to common offer type
const convertServiceOfferToOfferType = (serviceOffer: ServiceOffer): OfferType => {
  if (!serviceOffer) return {} as OfferType; // Guard against null/undefined
  
  // Helper function to convert owner to ID
  const convertOwner = (owner: string | ServiceUser): ID => {
    if (typeof owner === 'string') return owner;
    return owner._id;
  };

  // Convert property
  const convertProperty = (prop: ServiceProperty): CommonProperty => ({
    _id: prop._id,
    propertyName: prop.propertyName,
    location: prop.location || '',
    streetAddress: prop.streetAddress || '',
    propertyType: prop.propertyType || '',
    specificType: prop.specificType || '',
    action: prop.action || 'rent',
    price: prop.price || 0,
    space: prop.space || 0,
    images: prop.images || [], // Ensure images is always an array
    owner: convertOwner(prop.owner),
    status: prop.status || {
      sold: false,
      occupied: false,
      listingState: ''
    }
  });

  return {
    ...serviceOffer,
    // Convert property if it's an object
    property: typeof serviceOffer.property === 'object' 
      ? convertProperty(serviceOffer.property as ServiceProperty)
      : serviceOffer.property,
    
    // Convert tenant and owner to ID
    tenant: convertOwner(serviceOffer.tenant),
    owner: convertOwner(serviceOffer.owner),
    
    // Add any additional field mappings or default values as needed
    payment: serviceOffer.payment || {
      status: '',
      depositPaid: false,
      rentPaid: false,
      history: [],
      transactionHash: ''
    },
    escrow: serviceOffer.escrow || {
      status: '',
      depositHeld: 0,
      rentHeld: 0,
      lastUpdated: new Date()
    },
    contract: serviceOffer.contract || {
      tenantSigned: false,
      ownerSigned: false
    },
    offPlatformPayment: serviceOffer.offPlatformPayment || {
      allowed: false,
      proofRequired: false
    }
  };
};

const PaymentFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { offerId: routeOfferId } = useParams<{ offerId: string }>();
  const { setActiveTab } = useNavigationStore();
  const offerStore = useOfferStore();
  
  // State for payment details
  const [offer, setOffer] = useState<OfferType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Improved ID processing with better error handling
  const processedOfferId = useMemo(() => {
    // Log the original ID from route params for debugging
    console.log('Original route offerId:', routeOfferId);
    
    if (!routeOfferId) {
      console.error('No offerId provided in route params');
      return null;
    }

    // Handle case where ID might be "undefined" as a string
    if (routeOfferId === "undefined") {
      console.error('Received "undefined" as string in route params');
      return null;
    }
    
    // First try direct string conversion
    const stringId = idToString(routeOfferId);
    if (stringId) {
      console.log('Successfully converted to string ID:', stringId);
      return stringId;
    }
    
    // If that fails, try getMongoId
    const mongoId = getMongoId(routeOfferId);
    if (mongoId) {
      console.log('Successfully extracted MongoDB ID:', mongoId);
      return mongoId;
    }
    
    // If we reach here, log the failure
    console.error('Failed to process offerId:', routeOfferId);
    return null;
  }, [routeOfferId]);

  // Fetch offer details on component mount
  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (!processedOfferId) {
        setError('Invalid or missing offer ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        console.log('Attempting to fetch offer with processed ID:', processedOfferId);

        // First try to get from store
        let offerData = offerStore.getOfferById(processedOfferId);
        
        // If not in store, fetch from service and convert
        if (!offerData) {
          console.log('Offer not found in store, fetching from API...');
          const serviceOfferData = await offerService.getOfferById(processedOfferId);
          
          if (!serviceOfferData) {
            throw new Error('No data returned from API');
          }
          
          offerData = convertServiceOfferToOfferType(serviceOfferData);
        }

        console.log('Fetched offer data:', offerData);
        
        setOffer(offerData);
        setError(null);
      } catch (fetchError: any) {
        console.error('Comprehensive fetch error:', fetchError);
        setError(fetchError.message || 'Unable to load offer details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferDetails();
  }, [processedOfferId, offerStore]);

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
  };

  const handleBack = () => {
    // Determine the previous tab based on navigation history
    const previousPath = location.state?.from || '/listerdashboard';
    const previousTab = previousPath.includes('messages') ? 'Messages' : 
                        previousPath.includes('offer') ? 'Offers' : 
                        'Properties';
    
    // Set the active tab and navigate back
    setActiveTab(previousTab);
    navigate(previousPath);
  };

  const getPaymentComponent = () => {
    if (!offer) return null;

    const props = { 
      amount: offer.amount, 
      offerId: processedOfferId || '', 
      onSuccess: handlePaymentSuccess 
    };
    
    switch (paymentMethod) {
      case 'wallet':
        return <WalletPayment {...props} />;
      case 'card':
        return <CardPayment {...props} />;
      case 'mpesa':
        return <MPesaPayment {...props} />;
      case 'off-platform':
        return <OffPlatformPayment {...props} />;
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-rustyred" />
      </div>
    );
  }

  // Error state with more detailed error message
  if (error || !offer) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md">
          <p className="text-lg text-graphite mb-2">Unable to load offer details</p>
          <p className="text-sm text-gray-600 mb-4">
            {error || 'The requested offer could not be found. It may have been removed or the link is invalid.'}
          </p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk flex flex-col">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={handleBack} 
            className="text-graphite hover:text-rustyred transition-colors"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <h2 className="text-xl font-bold ml-4">Complete Payment</h2>
        </div>
      </div>

      <div className="flex-grow max-w-md mx-auto w-full px-4 py-6">
        {/* Payment Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Property</span>
            <span className="font-medium">
              {offer.property && typeof offer.property === 'object' 
                ? (offer.property as CommonProperty).propertyName || 'Property Details'
                : 'Property Details'}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>
              {offer.currencySymbol || '$'}
              {offer.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { 
              type: 'wallet', 
              label: 'Crypto Wallet', 
              icon: <FaWallet className="text-xl" /> 
            },
            { 
              type: 'card', 
              label: 'Card Payment', 
              icon: <FaCreditCard className="text-xl" /> 
            },
            { 
              type: 'mpesa', 
              label: 'M-PESA', 
              icon: <FaMobile className="text-xl" /> 
            },
            { 
              type: 'off-platform', 
              label: 'Other Methods', 
              icon: <FaMoneyBillWave className="text-xl" /> 
            }
          ].map((method) => (
            <button
              key={method.type}
              onClick={() => setPaymentMethod(method.type as PaymentMethod)}
              className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2
                ${paymentMethod === method.type ? 'border-celadon bg-celadon/10' : 'border-gray-300'}`}
            >
              {method.icon}
              <span className="text-xs">{method.label}</span>
            </button>
          ))}
        </div>

        {/* Selected Payment Method Component */}
        {getPaymentComponent()}

        {/* Success Modal */}
        {showSuccess && (
          <PaymentSuccess
            onComplete={() => {
              // Navigate back to previous page or dashboard
              handleBack();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentFlowPage;