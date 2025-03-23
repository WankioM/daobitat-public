import React from 'react';
import { OfferFormData } from './OfferForm';

interface ConfirmationDialogProps {
  offerData: OfferFormData;
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
    <div className="fixed inset-0 bg-graphite/70 z-50 flex items-center justify-center p-4">
      <div className="bg-milk rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold text-graphite mb-6">Confirm Your Offer</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between pb-2 border-b border-lightstone">
              <span className="text-graphite/70">
                {offerData.transactionType === 'rental' ? 'Monthly Rent:' : 'Purchase Price:'}
              </span>
              <span className="font-semibold text-graphite">
                {offerData.currencySymbol} {offerData.amount.toLocaleString()}
              </span>
            </div>
            
            {offerData.transactionType === 'rental' && (
              <div className="flex justify-between pb-2 border-b border-lightstone">
                <span className="text-graphite/70">Duration:</span>
                <span className="font-semibold text-graphite">{offerData.duration} {offerData.duration === 1 ? 'month' : 'months'}</span>
              </div>
            )}
            
            <div className="flex justify-between pb-2 border-b border-lightstone">
              <span className="text-graphite/70">
                {offerData.transactionType === 'rental' ? 'Security Deposit:' : 'Initial Deposit:'}
              </span>
              <span className="font-semibold text-graphite">
                {offerData.currencySymbol} {offerData.securityDeposit.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between pt-2 font-bold">
              <span className="text-graphite">Total Amount:</span>
              <span className="text-rustyred">
                {offerData.currencySymbol} {offerData.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          
          {offerData.moveInDate && (
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-graphite/70">
                {offerData.transactionType === 'rental' ? 'Move-in Date:' : 'Possession Date:'}
              </span>
              <span className="font-medium text-graphite">
                {new Date(offerData.moveInDate).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <div className="flex justify-between mb-6 text-sm">
            <span className="text-graphite/70">Transaction Type:</span>
            <span className="font-medium text-graphite capitalize">
              {offerData.transactionType}
            </span>
          </div>
          
          <div className="p-3 bg-lightstone/30 rounded-lg text-sm text-graphite/70 mb-6">
            <p>By confirming this offer, you agree to commit to these terms if the owner accepts. The owner has 48 hours to respond to your offer.</p>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-graphite hover:text-rustyred transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-desertclay text-white rounded-lg hover:bg-rustyred transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Confirm Offer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;