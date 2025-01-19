// src/NewComponents/Messages/OfferActions.tsx
import React from 'react';
import { OfferDetails } from '../../types/messages';

interface OfferActionsProps {
  status: OfferDetails['status'];
  isLister: boolean;
  isRenter: boolean;
  onAccept: () => void;
  onReject: () => void;
  onInitiatePayment: () => void;
}

const OfferActions: React.FC<OfferActionsProps> = ({
  status,
  isLister,
  isRenter,
  onAccept,
  onReject,
  onInitiatePayment
}) => {
  // Show action buttons for lister only when offer is pending
  if (isLister && status === 'pending') {
    return (
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onReject}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Reject
        </button>
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
        >
          Accept
        </button>
      </div>
    );
  }

  // Show payment button for renter when offer is accepted
  if (isRenter && status === 'accepted') {
    return (
      <div className="mt-4">
        <button
          onClick={onInitiatePayment}
          className="w-full py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90"
        >
          Make Initial Payment
        </button>
      </div>
    );
  }

  // Show counter offer button for renter when offer is rejected
  if (isRenter && status === 'rejected') {
    return (
      <div className="space-y-2 mt-4">
        <button
          onClick={() => alert('Counter offer feature coming soon!')}
          className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          Revise Offer
        </button>
        <button
          onClick={() => alert('Closing chat...')}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Close Chat
        </button>
      </div>
    );
  }

  // Default: no actions to show
  return null;
};

export default OfferActions;