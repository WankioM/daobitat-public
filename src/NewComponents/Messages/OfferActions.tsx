// src/NewComponents/Messages/OfferActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Offer } from '../../types/offers';
import { getMongoId } from '../../utils/mongoUtils';

interface OfferActionsProps {
  status: Offer['status'];
  isLister: boolean;
  isRenter: boolean;
  isOwn: boolean;
  offerId: string;
  onAccept: () => void;
  onReject: () => void;
  onWithdraw: () => void;
  onInitiatePayment: () => void;
  disabled?: boolean;
  onRefresh?: () => void;
  // Add new props for payment status
  depositPaid?: boolean;
  rentPaid?: boolean;
}

const OfferActions: React.FC<OfferActionsProps> = ({
  status,
  isLister,
  isRenter,
  isOwn,
  offerId,
  onAccept,
  onReject,
  onWithdraw,
  onInitiatePayment,
  onRefresh,
  disabled = false,
  // Default values for payment status
  depositPaid = false,
  rentPaid = false
}) => {
  const navigate = useNavigate();

  const logAndValidateOfferId = () => {
    console.log('OfferActions - Original offerId:', offerId);
    console.log('OfferActions - offerId type:', typeof offerId);
    
    // Check for undefined or "undefined" string
    if (!offerId || offerId === "undefined") {
      console.error('OfferActions - Invalid offerId detected:', offerId);
      return false;
    }
    
    // Attempt to get a valid MongoDB ID
    const validId = getMongoId(offerId);
    console.log('OfferActions - Processed offerId:', validId);
    
    if (!validId) {
      console.error('OfferActions - Failed to extract valid MongoDB ID from:', offerId);
      return false;
    }
    
    return validId;
  };

  // Create handler with automatic refresh on error
  const createActionHandler = (handler: () => void) => {
    return () => {
      try {
        handler();
      } catch (e) {
        console.error('Error in action handler:', e);
        if (onRefresh) onRefresh();
      }
    };
  };
  
  // Case 1: Owner viewing a pending offer from tenant
  if (isLister && status === 'pending') {
    return (
      <div className="mt-4">
        <div className="flex justify-end space-x-2">
          <button
            onClick={createActionHandler(onReject)}
            className="px-3 py-1.5 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors text-sm"
            disabled={disabled}
          >
            Reject
          </button>
          <button
            onClick={createActionHandler(onAccept)}
            className="px-3 py-1.5 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors text-sm"
            disabled={disabled}
          >
            Accept
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Renter's own pending offer - only show withdraw button
  if (isRenter && isOwn && status === 'pending') {
    return (
      <div className="mt-4">
        <button
          onClick={createActionHandler(onWithdraw)}
          className="w-full py-1.5 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors text-sm"
          disabled={disabled}
        >
          Withdraw Offer
        </button>
      </div>
    );
  }

  // Case 3: Renter viewing an accepted offer - show payment button
  // Only show payment button if payment hasn't been made yet
  if (isRenter && status === 'accepted' && !rentPaid && !depositPaid) {
    return (
      <button
        onClick={() => {
          const validId = logAndValidateOfferId();
          if (validId) {
            navigate(`/payment/${validId}`, { 
              state: { 
                from: window.location.pathname
              }
            });
          } else {
            alert('Error: Invalid offer ID. Please refresh the page and try again.');
          }
        }}
        className="w-full py-1.5 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors text-sm"
        disabled={disabled}
      >
        Make Initial Payment
      </button>
    );
  }

  // Case 3.1: Renter viewing an accepted offer but payment is already made
  if (isRenter && status === 'accepted' && (rentPaid || depositPaid)) {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-green-600 font-medium">
          Payment completed
        </p>
      </div>
    );
  }

  // Case 4: Owner viewing an accepted offer - check payment status
  if (isLister && status === 'accepted') {
    return (
      <div className="mt-4 text-center">
        {rentPaid || depositPaid ? (
          <p className="text-sm text-green-600 font-medium">
            Payment received
          </p>
        ) : (
          <p className="text-sm text-graphite">
            Waiting for tenant's payment
          </p>
        )}
      </div>
    );
  }

  // For completed, expired, withdrawn, or rejected offers - just show status
  if (status === 'completed' || status === 'expired' || status === 'withdrawn' || status === 'rejected') {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">
          {status === 'rejected' 
            ? 'This offer was rejected. You can submit a new offer from the property page.'
            : `This offer is ${status}`
          }
        </p>
      </div>
    );
  }

  // Default: no actions to show
  return null;
};

export default OfferActions;