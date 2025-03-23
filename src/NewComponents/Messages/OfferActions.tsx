// src/NewComponents/Messages/OfferActions.tsx
import React from 'react';
import { OfferDetails } from '../../types/messages';

interface OfferActionsProps {
  status: OfferDetails['status'];
  isLister: boolean;
  isRenter: boolean;
  isOwn: boolean;
  isCounterOffer?: boolean;
  onAccept: () => void;
  onReject: () => void;
  onCounterOffer: () => void;
  onInitiatePayment: () => void;
  disabled?: boolean;
}

const OfferActions: React.FC<OfferActionsProps> = ({
  status,
  isLister,
  isRenter,
  isOwn,
  isCounterOffer = false,
  onAccept,
  onReject,
  onCounterOffer,
  onInitiatePayment,
  disabled = false
}) => {
  // Case 1: Owner viewing a pending offer (initial or counter)
  if (isLister && status === 'pending' && !isOwn) {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors"
            disabled={disabled}
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors"
            disabled={disabled}
          >
            Accept
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCounterOffer}
            className="px-4 py-2 bg-milk text-graphite border border-lightstone rounded-lg hover:bg-lightstone/30 transition-colors"
            disabled={disabled}
          >
            Counter Offer
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Owner viewing an offer that needs finalization (renter accepted owner's counter)
  if (isLister && status === 'pending_acceptance' && !isOwn) {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors"
            disabled={disabled}
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors"
            disabled={disabled}
          >
            Finalize Acceptance
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Renter's own pending offer - only show withdraw button
  if (isRenter && isOwn && status === 'pending') {
    return (
      <div className="mt-4">
        <button
          onClick={onReject} // Using the reject handler as withdraw action
          className="w-full py-2 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors"
          disabled={disabled}
        >
          Withdraw Offer
        </button>
      </div>
    );
  }

  // Case 4: Renter viewing a counter-offer from owner
  if (isRenter && !isOwn && status === 'pending' && isCounterOffer) {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors"
            disabled={disabled}
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors"
            disabled={disabled}
          >
            Accept
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCounterOffer}
            className="px-4 py-2 bg-milk text-graphite border border-lightstone rounded-lg hover:bg-lightstone/30 transition-colors"
            disabled={disabled}
          >
            Counter Offer
          </button>
        </div>
      </div>
    );
  }

  // Case 5: Renter waiting for owner to finalize acceptance
  if (isRenter && status === 'pending_acceptance') {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">Waiting for owner to finalize acceptance</p>
      </div>
    );
  }

  // Case 6: Owner viewing a rejected offer - can make counter offer
  if (isLister && status === 'rejected') {
    return (
      <div className="mt-4">
        <button
          onClick={onCounterOffer}
          className="w-full py-2 bg-milk text-graphite border border-lightstone rounded-lg hover:bg-lightstone/30 transition-colors"
          disabled={disabled}
        >
          Counter Offer
        </button>
      </div>
    );
  }

  // Case 7: Renter viewing a rejected offer - can make counter offer
  if (isRenter && status === 'rejected') {
    return (
      <div className="space-y-2 mt-4">
        <button
          onClick={onCounterOffer}
          className="w-full py-2 bg-milk text-graphite border border-lightstone rounded-lg hover:bg-lightstone/30 transition-colors"
          disabled={disabled}
        >
          Revise Offer
        </button>
      </div>
    );
  }

  // Case 8: Renter viewing an accepted offer - show payment button
  if (isRenter && status === 'accepted') {
    return (
      <div className="mt-4">
        <button
          onClick={onInitiatePayment}
          className="w-full py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors"
          disabled={disabled}
        >
          Make Initial Payment
        </button>
      </div>
    );
  }

  // Case 9: Owner viewing an accepted offer - waiting for payment
  if (isLister && status === 'accepted') {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">Waiting for tenant's payment</p>
      </div>
    );
  }

  // Case 10: Owner's own counter-offer - show status only
  if (isLister && isOwn && status === 'pending' && isCounterOffer) {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">Waiting for tenant's response</p>
      </div>
    );
  }

  // Case 11: Renter's own counter-offer - show status only
  if (isRenter && isOwn && status === 'pending' && isCounterOffer) {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">Waiting for owner's response</p>
      </div>
    );
  }

  // For completed, expired, or withdrawn offers - no actions to show
  if (status === 'completed' || status === 'expired' || status === 'withdrawn') {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-graphite">{`This offer is ${status}`}</p>
      </div>
    );
  }

  // Default: no actions to show
  return null;
};

export default OfferActions;