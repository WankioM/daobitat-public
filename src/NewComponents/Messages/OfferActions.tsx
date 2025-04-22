// src/NewComponents/Messages/OfferActions.tsx
import React from 'react';
import { Offer } from '../../types/offers';
import { useNavigate } from 'react-router-dom';

interface OfferActionsProps {
  status: Offer['status'];
  isLister: boolean;
  isRenter: boolean;
  isOwn: boolean;
  onAccept: () => void;
  onReject: () => void;
  onWithdraw: () => void;
  onInitiatePayment: () => void;
  disabled?: boolean;
  onRefresh?: () => void; 
}

const OfferActions: React.FC<OfferActionsProps> = ({
  status,
  isLister,
  isRenter,
  isOwn,
  onAccept,
  onReject,
  onWithdraw,
  onInitiatePayment,
  onRefresh,
  disabled = false
}) => {

  const navigate = useNavigate();

  console.log('OfferActions component Called', {
    status,
    isLister,
    isRenter,
    isOwn,
    disabled
  });

  

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
if (isLister && status === 'pending' && !isOwn) {
  console.log('SHOW ACCEPT/REJECT BUTTONS', {
    isLister,
    status,
    isOwn
  });
  
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
  if (isRenter && status === 'accepted') {
    return (
      <div className="mt-4">
        <button
          onClick={() => navigate('/payment-development')}
          className="w-full py-1.5 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors text-sm"
          disabled={disabled}
        >
          Make Initial Payment
        </button>
      </div>
    );
  }

  // Case 4: Owner viewing an accepted offer - waiting for payment
  if (isLister && status === 'accepted') {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">Waiting for tenant's payment</p>
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