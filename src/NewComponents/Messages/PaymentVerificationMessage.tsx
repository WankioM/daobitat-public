// src/NewComponents/Messages/PaymentVerificationMessage.tsx
import React, { useState, useEffect } from 'react';
import { Message, PaymentProof } from '../../types/messages';
import { FaCoins, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import PaymentService from '../../services/paymentService';
import { offerService, PaymentUpdateDTO } from '../../services/offerService';

interface PaymentVerificationMessageProps {
  message: Message;
  isOwn: boolean;
  onVerified?: () => void;
}

const PaymentVerificationMessage: React.FC<PaymentVerificationMessageProps> = ({ 
  message, 
  isOwn,
  onVerified 
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get payment details from message
  const paymentProof = message.paymentProof as PaymentProof;
  
  // Initialize verification status while ensuring we show buttons when needed
  const [verificationStatus, setVerificationStatus] = useState<string>('pending');
  
  // Set verification status based on message data on mount and updates
  useEffect(() => {
    console.log('Payment proof verification status:', 
      message.type, 
      paymentProof?.verified, 
      typeof paymentProof?.verified
    );
    
    // For payment_request messages, always show buttons to the landlord
    if (message.type === 'payment_request') {
      setVerificationStatus('pending');
    }
    // For explicitly verified payments (true)
    else if (paymentProof?.verified === true) {
      setVerificationStatus('verified');
    }
    // For explicitly rejected payments (false)
    else if (paymentProof?.verified === false && message.type !== 'payment_request') {
      setVerificationStatus('rejected');
    }
    // Default to pending for any other state
    else {
      setVerificationStatus('pending');
    }
  }, [message, paymentProof]);

  // Format currency with proper symbol
  const getCurrencySymbol = (currency: string): string => {
    const symbolMap: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'KES': 'KSh'
    };
    return symbolMap[currency] || currency;
  };

  // Prepare message display data
  const paymentMethod = paymentProof?.method || 'Unknown method';
  const amount = paymentProof?.amount || 0;
  const currency = paymentProof?.currency || 'KES';
  const reference = paymentProof?.reference || 'No reference';
  const currencySymbol = getCurrencySymbol(currency);
  const notes = paymentProof?.notes || '';
  const date = paymentProof?.date ? new Date(paymentProof.date) : new Date(message.createdAt);
  const formattedDate = date.toLocaleDateString();

  // Handle payment verification
// Updated handleVerify method
const handleVerify = async () => {
  setIsVerifying(true);
  setError(null);
  
  try {
    // Check which ID to use - paymentId is preferred over offerId
    const paymentId = paymentProof.paymentId || '';
    const offerId = paymentProof.offerId || '';
    
    if (!paymentId && !offerId) {
      throw new Error('No payment ID or offer ID found for verification');
    }
    
    console.log('Verifying payment - Payment ID:', paymentId, 'Offer ID:', offerId);
    
    // Step 1: Call the payment service to verify the payment
    if (paymentId) {
      const response = await PaymentService.verifyOffPlatformPayment(
        paymentId.toString(), 
        { 
          verified: true, 
          verificationStatus: 'verified',
          notes: 'Payment verified by landlord' 
        }
      );
      
      console.log('Payment verification response:', response);
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to verify payment');
      }
    }
    
    // Step 2: If we have an offer ID, also update the offer's payment status
    if (offerId) {
      // Get the payment history to determine if this is the first payment (deposit) or subsequent (rent)
      const offerDetails = await offerService.getOfferById(offerId.toString());
      
      // Determine payment type based on payment history
      // If this is the first completed payment, it's a deposit
      const completedPayments = offerDetails.payment?.history?.filter(
        payment => payment.status === 'completed'
      );
      
      const paymentType = (!completedPayments || completedPayments.length === 0) 
        ? 'deposit' 
        : 'rent';
      
      console.log(`Updating offer payment status as ${paymentType}`);
      
      // Update the offer's payment status
      const paymentUpdateResponse = await offerService.updatePaymentStatus(
        offerId.toString(),
        {
          paymentStatus: 'completed',
          paymentType: paymentType,
          transactionHash: paymentProof.transactionHash || ''
        }
      );
      
      console.log('Offer payment status update response:', paymentUpdateResponse);
    }
    
    // Update local state
    setVerificationStatus('verified');
    if (onVerified) onVerified();
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    setError(error instanceof Error ? error.message : 'Failed to verify payment. Please try again.');
  } finally {
    setIsVerifying(false);
  }
};
  
  // Handle payment rejection
  const handleReject = async () => {
    setIsRejecting(true);
    setError(null);
    
    try {
      // Check which ID to use - paymentId is preferred over offerId
      const verificationId = paymentProof.paymentId || paymentProof.offerId;
      
      if (!verificationId) {
        throw new Error('No payment ID found for rejection');
      }
      
      console.log('Rejecting payment - ID used for rejection:', verificationId);
      
      // Get rejection reason
      const rejectionReason = prompt('Please provide a reason for rejection:');
      if (!rejectionReason) {
        setIsRejecting(false);
        return; // User cancelled the prompt
      }
      
      // Call the payment service with the correct format expected by the API
      const response = await PaymentService.rejectOffPlatformPayment(
        verificationId.toString(),
        { 
          verified: false, 
          verificationStatus: 'rejected',
          notes: 'Payment rejected by landlord',
          rejectionReason: rejectionReason
        }
      );
  
      console.log('Payment rejection response:', response);
      
      if (response.status === 'success') {
        setVerificationStatus('rejected');
        if (onVerified) onVerified();
      } else {
        setError(response.message || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to reject payment. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Determine if we should show the verification buttons
  // This is shown to the landlord (not the message sender) for payment requests
  const shouldShowButtons = !isOwn && message.type === 'payment_request' && verificationStatus === 'pending';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-md rounded-lg px-4 py-3 ${
          isOwn ? 'bg-rustyred/10 text-graphite' : 'bg-milk text-graphite'
        }`}
      >
        <div className="flex items-center mb-2">
          <FaCoins className="text-rustyred mr-2" />
          <span className="font-medium">Payment Confirmation</span>
        </div>
        
        <div className="text-sm space-y-1">
          <p><strong>Amount:</strong> {currencySymbol}{amount.toLocaleString()}</p>
          <p><strong>Method:</strong> {paymentMethod}</p>
          <p><strong>Reference:</strong> {reference}</p>
          <p><strong>Date:</strong> {formattedDate}</p>
          {notes && <p><strong>Notes:</strong> {notes}</p>}
          
          {paymentProof?.imageUrl && (
            <div className="mt-2">
              <a 
                href={paymentProof.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rustyred hover:underline"
              >
                View payment proof image
              </a>
            </div>
          )}
        </div>
        
        {/* Status and actions */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          {verificationStatus === 'verified' ? (
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Payment verified</span>
            </div>
          ) : verificationStatus === 'rejected' ? (
            <div className="flex items-center text-red-600">
              <FaTimes className="mr-1" />
              <span>Payment rejected</span>
            </div>
          ) : shouldShowButtons ? (
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || isRejecting}
                  className="flex-1 bg-seagreen text-white py-1 px-3 rounded-md text-sm flex items-center justify-center hover:bg-emerald-700"
                >
                  {isVerifying ? <FaSpinner className="animate-spin mr-1" /> : <FaCheck className="mr-1" />}
                  Verify
                </button>
                <button
                  onClick={handleReject}
                  disabled={isVerifying || isRejecting}
                  className="flex-1 bg-rustyred text-white py-1 px-3 rounded-md text-sm flex items-center justify-center hover:bg-red-700"
                >
                  {isRejecting ? <FaSpinner className="animate-spin mr-1" /> : <FaTimes className="mr-1" />}
                  Reject
                </button>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          ) : (
            <div className="text-amber-600">Awaiting verification</div>
          )}
        </div>
        
        <span className="text-xs opacity-75 block text-right mt-2">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default PaymentVerificationMessage;