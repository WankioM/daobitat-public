// src/NewComponents/Messages/StatefulOfferCard.tsx
import React, { useState, useEffect } from 'react';
import { Property } from '../../types/common';
import { Offer } from '../../types/offers';
import { format } from 'date-fns';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaCoins, FaClock } from 'react-icons/fa';
import OfferActions from './OfferActions';
import OfferTimeline from './OfferTimeline';
import ClickablePropertyCard from './ClickablePropertyCard';
import { useUser } from '../../NewContexts/UserContext';
import { getMongoId } from '../../utils/mongoUtils';
import useOfferStore from '../../store/offerStore';
import { idToString } from '../../types/common';

// Define TimelineEvent to match the one expected by OfferTimeline
interface TimelineEvent {
  type: string;
  date: Date | string;
  actor: string; // String only, not MongoDBId
  status: 'completed' | 'pending' | 'failed';
  offerId: string; // String only, not MongoDBId
  data?: any;
}

interface StatefulOfferCardProps {
  offer: Offer;
  property: Property;
  userRole: 'tenant' | 'owner';
  isOwn: boolean;
  onAction: (action: string, data?: any) => void;
}

const StatefulOfferCard: React.FC<StatefulOfferCardProps> = ({
  offer: initialOffer, 
  property,
  userRole,
  isOwn,
  onAction
}) => {
  const [isExpanded, setIsExpanded] = useState(true); 
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { user } = useUser();

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  
  // Get the offer store for fetching latest data
  const { loadOffer, getOfferById } = useOfferStore();
  
  // Get the latest offerId
  const offerId = typeof initialOffer._id === 'string' 
    ? initialOffer._id 
    : getMongoId(initialOffer._id) || '';
  
  // Load offer data from store when component mounts
  useEffect(() => {
    const fetchLatestOfferData = async () => {
      if (!offerId) return;
      
      try {
        // Load the latest offer data from the server via the store
        await loadOffer(offerId);
      } catch (error) {
        console.error('Error refreshing offer data:', error);
      }
    };
    
    fetchLatestOfferData();
  }, [offerId, refreshAttempts, loadOffer]);
  
  // Get the latest offer from the store
  const storeOffer = getOfferById(offerId) || initialOffer;
  const currentOffer = storeOffer;
  
  // Determine user role based on IDs for reliability
  const determinedUserRole = (() => {
    if (!user) return userRole;
    
    const userId = getMongoId(user._id);
    const tenantId = getMongoId(currentOffer.tenant);
    const ownerId = getMongoId(currentOffer.owner);
    
    console.log('Role Determination Debug', {
      userId,
      tenantId,
      ownerId
    });
    
    if (userId === ownerId) return 'owner';
    if (userId === tenantId) return 'tenant';
    
    return userRole;
  })();
  // Set role flags based on determined role
  const isLister = determinedUserRole === 'owner';
  const isRenter = determinedUserRole === 'tenant';


  const recalculatedIsOwn = user ? (
    // Explicitly check if the current user is the owner of this specific offer
    getMongoId(user._id) === getMongoId(currentOffer.tenant) ||
    getMongoId(user._id) === getMongoId(currentOffer.owner)
  ) : false;
  
  // Generate timeline events based on offer state
  useEffect(() => {
    if (!currentOffer || !user) return;
    
    const events: TimelineEvent[] = [];
    const tenantId = idToString(currentOffer.tenant);
    const ownerId = idToString(currentOffer.owner);
    
    // Add initial offer creation event
    events.push({
      type: 'created',
      date: new Date(currentOffer.createdAt || new Date()), 
      actor: tenantId,
      status: 'completed',
      offerId: offerId,
      data: { amount: currentOffer.amount }
    });
    
    // Add status-based events
    if (currentOffer.status === 'accepted') {
      events.push({
        type: 'owner-accepted',
        date: new Date(currentOffer.updatedAt || new Date()),
        actor: ownerId,
        status: 'completed',
        offerId: offerId
      });
      
      events.push({
        type: 'payment-pending',
        date: new Date(),
        actor: tenantId,
        status: 'pending',
        offerId: offerId
      });
    }
    
    // Add withdrawn event if applicable
    if (currentOffer.status === 'withdrawn') {
      events.push({
        type: 'withdrawn',
        date: new Date(currentOffer.updatedAt || new Date()),
        actor: tenantId,
        status: 'completed',
        offerId: offerId
      });
    }

    // Add rejected event if applicable
    if (currentOffer.status === 'rejected') {
      events.push({
        type: 'rejected',
        date: new Date(currentOffer.updatedAt || new Date()),
        actor: ownerId,
        status: 'completed',
        offerId: offerId
      });
    }
    
    setTimelineEvents(events);
  }, [currentOffer, user, offerId]);

  // Format currency with appropriate symbol
  const formatCurrency = (amount: number, currency = 'USD') => {
    const symbolMap: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KSh',
    };
    
    const symbol = symbolMap[currency] || '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Format date in a reader-friendly format
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), 'PPP');
  };

  // Get status badge styling based on offer status
  const getStatusBadge = () => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (currentOffer.status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'accepted':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'withdrawn':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'completed':
        return `${baseClasses} bg-emerald-100 text-emerald-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  
  // Wrap onAction to handle errors and trigger refreshes
  const handleAction = async (action: string, data?: any) => {
    try {
      await onAction(action, data);
      // Force a refresh of offer data after action
      setRefreshAttempts(prev => prev + 1);
    } catch (error) {
      console.error(`Error handling action ${action}:`, error);
      // Force a refresh of offer data on error
      setRefreshAttempts(prev => prev + 1);
    }
  };
  
  // Action handlers
  const handleAccept = () => handleAction('accept');
  const handleReject = () => handleAction('reject');
  const handleWithdraw = () => handleAction('withdraw');
  const handleInitiatePayment = () => handleAction('payment-complete', { transactionHash: `mockTx${Date.now()}` });

  // Force isLister and isRenter to be boolean values
  const safeIsLister = Boolean(isLister); 
  const safeIsRenter = Boolean(isRenter);

  console.log('Detailed Offer Debug', {
    userId: getMongoId(user?._id),
    tenantId: getMongoId(currentOffer.tenant),
    ownerId: getMongoId(currentOffer.owner),
    currentUserRole: determinedUserRole,
    isLister,
    isRenter,
    recalculatedIsOwn,
    userRole,
    status: currentOffer.status
  });

  return (
    <div className="mb-4 bg-white border border-lightstone rounded-lg shadow-sm overflow-hidden">
      {/* Offer Header */}
      <div 
        className="p-4 bg-milk border-b border-lightstone flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-medium text-graphite">
            Offer for {property.propertyName}
          </h3>
          <p className="text-sm text-graphite/70">
            {formatCurrency(currentOffer.amount, currentOffer.currency)} / month
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={getStatusBadge()}>
            {currentOffer.status.charAt(0).toUpperCase() + currentOffer.status.slice(1)}
          </span>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {/* Expanded Offer Details */}
      {isExpanded && (
        <div className="p-4 bg-white">
          {/* Debug toggle - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="float-right">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDiagnostics(!showDiagnostics);
                }}
                className="text-xs text-gray-400 hover:text-rustyred"
              >
                {showDiagnostics ? 'Hide Debug' : 'Show Debug'}
              </button>
            </div>
          )}

          {/* Debug info */}
          {showDiagnostics && (
            <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
              <p>User ID: {getMongoId(user?._id)}</p>
              <p>Tenant ID: {getMongoId(currentOffer.tenant)}</p>
              <p>Owner ID: {getMongoId(currentOffer.owner)}</p>
              <p>Status: {currentOffer.status}</p>
              <p>Role: {determinedUserRole}</p>
              <p>Is Own: {String(recalculatedIsOwn)}</p>
            </div>
          )}

          {/* Property thumbnail */}
          <div className="mb-4">
          <ClickablePropertyCard 
  property={property} 
  offerId={typeof initialOffer._id === 'string' 
    ? initialOffer._id 
    : getMongoId(initialOffer._id) || ''
  }  
/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Left Column - Offer Financial Details */}
            <div className="space-y-2">
              <div className="flex items-center">
                <FaCoins className="text-rustyred mr-2 text-sm" />
                <div>
                  <p className="text-xs text-graphite/70">Monthly Rent</p>
                  <p className="font-medium text-sm text-graphite">
                    {formatCurrency(currentOffer.amount, currentOffer.currency)}
                  </p>
                </div>
              </div>
                          
              <div className="flex items-center">
                <FaCoins className="text-rustyred mr-2" />
                <div>
                  <p className="text-sm text-graphite/70">Security Deposit</p>
                  <p className="font-medium text-graphite">
                    {formatCurrency(currentOffer.securityDeposit, currentOffer.currency)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCoins className="text-rustyred mr-2" />
                <div>
                  <p className="text-sm text-graphite/70">Initial Payment</p>
                  <p className="font-medium text-graphite">
                    {formatCurrency(currentOffer.amount + currentOffer.securityDeposit, currentOffer.currency)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Offer Timeline Details */}
            <div className="space-y-3">
              <div className="flex items-center">
                <FaClock className="text-rustyred mr-2" />
                <div>
                  <p className="text-sm text-graphite/70">Lease Duration</p>
                  <p className="font-medium text-graphite">
                    {currentOffer.duration} {currentOffer.duration === 1 ? 'month' : 'months'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="text-rustyred mr-2" />
                <div>
                  <p className="text-sm text-graphite/70">Move-in Date</p>
                  <p className="font-medium text-graphite">
                    {formatDate(currentOffer.moveInDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="text-rustyred mr-2" />
                <div>
                  <p className="text-sm text-graphite/70">Created</p>
                  <p className="font-medium text-graphite">
                    {formatDate(currentOffer.createdAt || new Date())}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline Section */}
          {timelineEvents.length > 0 && user && (
            <div className="mt-4 border-t border-lightstone pt-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(prev => prev)}
              >
                <h4 className="text-sm font-medium text-graphite">Activity Timeline</h4>
              </div>
              
              {user && (
                <OfferTimeline 
                  history={timelineEvents}
                  userId={idToString(user._id)}
                  isExpanded={isExpanded}
                />
              )}
            </div>
          )}
          
          {/* Action Buttons - Using correct role detection */}
          {(safeIsLister || safeIsRenter) && (
            <OfferActions
            status={currentOffer.status}
            isLister={safeIsLister}
            isRenter={safeIsRenter}
            isOwn={recalculatedIsOwn}
            onAccept={handleAccept}
            onReject={handleReject}
            onWithdraw={handleWithdraw}
            onInitiatePayment={handleInitiatePayment}
            disabled={false}
            onRefresh={() => setRefreshAttempts(prev => prev + 1)}
          />
          )}

          {/* Fallback if neither role is true - for debugging */}
          {!safeIsLister && !safeIsRenter && showDiagnostics && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-700">Error: Unable to determine user role.</p>
              <p className="text-xs text-red-600">
                userRole: {userRole}, isLister: {String(safeIsLister)}, isRenter: {String(safeIsRenter)}
              </p></div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatefulOfferCard;