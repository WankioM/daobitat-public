import React from 'react';
import { OfferData } from './MakeOfferModal';

interface ConfirmationDialogProps {
  offerData: OfferData;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  offerData,
  onClose,
  onConfirm,
  isSubmitting
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Confirm Your Offer</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Rent:</span>
            <span className="font-semibold">
              {offerData.currencySymbol} {offerData.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{offerData.duration} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Security Deposit:</span>
            <span className="font-semibold">
              {offerData.currencySymbol} {offerData.securityDeposit.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total Amount:</span>
            <span>
              {offerData.currencySymbol} {offerData.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Offer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;