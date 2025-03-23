// src/NewComponents/Messages/OfferMessage.tsx
import React, { useState, useEffect } from 'react';
import { offerService, CreateOfferDTO } from '../../services/offerService';
import { messageService } from '../../services/messageService';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { getMongoId } from '../../utils/mongoUtils';
import OfferActions from './OfferActions';
import PaymentFlow from '../PaymentFlow/PaymentFlow';
import CounterOfferModal, { CounterOfferData } from './CounterOfferModal';
import api from '../../services/api';
import { Message, OfferStatus } from '../../types/messages';

interface OfferMessageProps {
  message: Message;
  isOwn: boolean;
  onOfferUpdate?: () => void; // Optional callback to refresh messages
}

const OfferMessage: React.FC<OfferMessageProps> = ({ message, isOwn, onOfferUpdate }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { offerDetails } = message;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [localOfferStatus, setLocalOfferStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('No action taken yet');

  useEffect(() => {
    // Initialize local state with the message's offer status
    if (offerDetails) {
      setLocalOfferStatus(offerDetails.status);
    }
  }, [offerDetails]);
  
  if (!offerDetails) return null;

  // Use local status if available, otherwise fall back to the original status
  const currentStatus = localOfferStatus || offerDetails.status;
  
  // Determine user roles
  const userId = getMongoId(user?._id);
  const isLister = userId === getMongoId(message.receiver._id);
  const isRenter = userId === getMongoId(message.sender._id);
  
  // Handle function to open counter offer modal
  const handleCounterOffer = () => {
    setShowCounterOfferModal(true);
  };
 
  // This improved handleAccept function addresses the counter offer detection issue

const handleAccept = async () => {
  // Enhanced logging for Accept button click
  console.log('===== ACCEPT BUTTON CLICKED =====');
  console.log('Timestamp:', new Date().toISOString());
  console.log('User ID:', userId);
  console.log('Offer ID:', getMongoId(offerDetails._id));
  console.log('Property:', message.property.propertyName);
  console.log('isCounterOffer flag:', offerDetails.isCounterOffer);
  console.log('Message Content:', message.content);
  console.log('Current Status:', currentStatus);
  console.log('User is Lister:', isLister);
  console.log('User is Renter:', isRenter);
  console.log('User roles from backend:', message.sender.role, message.receiver.role);
  console.log('================================');

  if (!offerDetails) {
    console.error('No offer details found');
    setDebugInfo('No offer details found');
    return;
  }

  // Always show what we're working with 
  console.log("===== DETAILED OFFER DEBUG =====");
  console.log("Current Status:", currentStatus);
  console.log("Is Counter Offer flag:", offerDetails.isCounterOffer);
  console.log("Message content:", message.content);
  console.log("Offer Details:", JSON.stringify(offerDetails, null, 2));
  console.log("=============================");
  
  setDebugInfo(`Accept clicked - isCounterOffer: ${!!offerDetails.isCounterOffer}, isRenter: ${isRenter}, currentStatus: ${currentStatus}`);
    
  // Check if the offer is in a pending state
  if (currentStatus !== 'pending' && !(isLister && currentStatus === 'pending_acceptance')) {
    alert(`Only pending offers can be accepted.`);
    return;
  }

  const offerId = getMongoId(offerDetails._id);
  if (!offerId) {
    console.error('No valid offer ID found in offer details:', offerDetails);
    return;
  }

  setIsProcessing(true);

  try {
    let updatedOffer;
    
    // Check if this is a counter offer based on multiple signals
    // This is more reliable than just using the isCounterOffer flag
    const detectIfCounterOffer = () => {
      // 1. Check explicit flag
      const flagIndicatesCounter = !!offerDetails.isCounterOffer;
      
      // 2. Check message content
      const messageIndicatesCounter = 
        message.content?.toLowerCase().includes('counter') || 
        message.type === 'offer_response';
      
      // 3. Check if "Counter Offer" is displayed in the UI
      const uiIndicatesCounter = document.body.textContent?.includes('Counter Offer') || false;
      
      console.log("Counter offer detection signals:", {
        flagIndicatesCounter,
        messageIndicatesCounter,
        uiIndicatesCounter
      });
      
      // Return true if any of the signals indicate this is a counter offer
      return flagIndicatesCounter || messageIndicatesCounter || uiIndicatesCounter;
    };
    
    const isCounterOffer = detectIfCounterOffer();
    setDebugInfo(`Detected as counter offer: ${isCounterOffer}`);
    
    // UPDATED LOGIC: If you're not the owner of the offer (i.e., you received it)
    // and it's a counter offer, use the accept-counter endpoint
    if (!isOwn && currentStatus === 'pending' && isCounterOffer) {
      console.log("👉 CONDITION TRIGGERED: Accepting a counter offer");
      
      try {
        console.log("Calling acceptCounterOffer endpoint");
        updatedOffer = await offerService.acceptCounterOffer(offerId);
        console.log("Counter offer accepted successfully:", updatedOffer);
        setDebugInfo(`Successfully accepted counter offer`);
        
        // Update local status based on your application's flow
        setLocalOfferStatus('pending_acceptance');
        
        // Send notification as needed
        const recipientId = isRenter 
          ? getMongoId(message.receiver._id) // Send to owner
          : getMongoId(message.sender._id);  // Send to renter
          
        const propertyId = getMongoId(message.property._id);
        
        if (recipientId && propertyId) {
          // Create appropriate notification
          const notificationContent = {
            type: 'offer_response' as const,
            content: `Offer accepted for ${message.property.propertyName}`,
            offerDetails: {
              ...offerDetails,
              status: 'pending_acceptance',
              responseType: 'acceptance' as const
            }
          };
          
          await messageService.sendMessage(
            recipientId,
            propertyId,
            JSON.stringify(notificationContent)
          );
        }
      } catch (error) {
        console.error('Error accepting counter offer:', error);
        setDebugInfo(`Error accepting counter offer: ${JSON.stringify(error)}`);
        throw error;
      }
    } 
    // If you're the owner receiving a regular offer
    else if (isLister && !isOwn && currentStatus === 'pending' && !isCounterOffer) {
      console.log("👉 CONDITION TRIGGERED: Owner accepting initial offer");
      try {
        updatedOffer = await offerService.acceptOffer(offerId);
        setLocalOfferStatus('accepted');
        setDebugInfo(`Owner accepted initial offer successfully`);
      } catch (error) {
        console.error('Error accepting offer:', error);
        throw error;
      }
    }
    // If you're the renter making a regular offer
    else if (isRenter && !isLister && currentStatus === 'pending' && !isCounterOffer) {
      console.log("👉 CONDITION TRIGGERED: Renter accepting regular offer");
      try {
        updatedOffer = await offerService.requestOwnerConfirmation(offerId);
        setLocalOfferStatus('pending_acceptance');
        setDebugInfo(`Used standard requestOwnerConfirmation flow`);
      } catch (error) {
        console.error('Error accepting regular offer:', error);
        throw error;
      }
    }
    // Owner finalizing acceptance after renter accepted counter offer
    else if (isLister && currentStatus === 'pending_acceptance') {
      console.log("👉 CONDITION TRIGGERED: Owner finalizing acceptance");
      try {
        updatedOffer = await offerService.acceptOffer(offerId);
        setLocalOfferStatus('accepted');
        setDebugInfo(`Owner finalized acceptance successfully`);
      } catch (error) {
        console.error('Error finalizing acceptance:', error);
        throw error;
      }
    }
    else {
      console.log("❌ NO CONDITION MATCHED - This is unexpected");
      console.log("Current conditions:", { 
        isRenter, 
        isLister, 
        isOwn, 
        currentStatus, 
        isCounterOffer 
      });
      setDebugInfo(`No condition matched - check console for details`);
    }
    
    // Call update callback if provided
    if (onOfferUpdate) {
      onOfferUpdate();
    }
  } catch (error: any) {
    console.error(`Error accepting offer:`, error);
    // Check for specific error and show appropriate message
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert(`Error accepting offer. Please try again.`);
    }
    // Reset the local status if there was an error
    setLocalOfferStatus(offerDetails.status);
    setDebugInfo(`Error in accept flow: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};
  
   
  const handleReject = async () => {
    if (!offerDetails) {
      console.error('No offer details found');
      return;
    }
  
    // Check if the offer is in a pending state
    if (!(currentStatus === 'pending' || currentStatus === 'pending_acceptance')) {
      alert(`Only pending offers can be rejected.`);
      return;
    }
  
    const offerId = getMongoId(offerDetails._id);
    if (!offerId) {
      console.error('No valid offer ID found in offer details:', offerDetails);
      return;
    }
  
    setIsProcessing(true);
  
    try {
      // Determine if this is a withdrawal or a rejection
      const isWithdrawal = isRenter && isOwn;
      const actionType = isWithdrawal ? 'withdraw' : 'reject';
      
      // Use the appropriate API endpoint
      const updatedOffer = isWithdrawal
        ? await offerService.withdrawOffer(offerId)
        : await offerService.rejectOffer(offerId);
      
      // Update local status
      setLocalOfferStatus(updatedOffer.status);
      
      // Create appropriate notification content
      const actionText = isWithdrawal ? 'withdrawn' : 'rejected';
      const notificationContent = {
        type: 'offer' as const,
        content: `Offer ${actionText} for ${message.property.propertyName}`,
        offerDetails: {
          ...updatedOffer,
          propertyImage: message.property.images?.[0]
        }
      };
      
      // Determine the recipient of the notification
      // If withdrawing (renter withdraws their own), notify the property owner
      // If rejecting (owner rejects), notify the tenant
      const recipientId = isWithdrawal
        ? getMongoId(message.receiver._id) // Owner
        : getMongoId(message.sender._id);  // Tenant
        
      const propertyId = getMongoId(message.property._id);
      
      if (recipientId && propertyId) {
        await messageService.sendMessage(
          recipientId,
          propertyId,
          JSON.stringify(notificationContent)
        );
      }
      
      console.log(`Offer ${actionText}:`, updatedOffer);
      
      // Call update callback if provided
      if (onOfferUpdate) {
        onOfferUpdate();
      }
    } catch (error: any) {
      console.error(`Error handling offer rejection/withdrawal:`, error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert(`Error processing your request. Please try again.`);
      }
      // Reset the local status if there was an error
      setLocalOfferStatus(offerDetails.status);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitCounterOffer = async (data: CounterOfferData) => {
    setIsProcessing(true);
    try {
      const propertyId = getMongoId(message.property._id);
      if (!propertyId) {
        throw new Error('Invalid property ID');
      }
      
      // Create expiry date (48 hours from now)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 48);
      
      // Format the move-in date
      const moveInDate = new Date(data.moveInDate);
      
      // Calculate total amount
      const totalAmount = (data.amount * data.duration) + data.securityDeposit;
      
      // Prepare counter-offer data
      const counterOfferData = {
        amount: data.amount,
        securityDeposit: data.securityDeposit,
        duration: data.duration,
        moveInDate: moveInDate,
        message: data.message ? `Counter offer: ${data.message}` : `Counter offer to previous offer`,
        transactionType: offerDetails.transactionType || 'rental'
      };
      
      // Get the ID of the offer we're countering
      const offerId = getMongoId(offerDetails._id);
      if (!offerId) {
        throw new Error('Invalid offer ID');
      }
      
      // Create the counter offer
      const newOffer = await offerService.createCounterOffer(offerId, counterOfferData);
      
      // Determine recipient based on who's creating the counter-offer
      const recipientId = isLister 
        ? getMongoId(message.sender._id) // If lister (owner) is countering, send to renter
        : getMongoId(message.receiver._id); // If renter is countering, send to owner
      
      if (!recipientId) {
        throw new Error('Invalid recipient ID');
      }
      
      // Create notification about the counter offer
      const notificationContent = {
        type: 'offer' as const,
        content: `New counter offer for ${message.property.propertyName}`,
        offerDetails: {
          _id: newOffer._id,
          amount: newOffer.amount,
          currency: newOffer.currency,
          currencySymbol: newOffer.currencySymbol,
          duration: newOffer.duration,
          securityDeposit: newOffer.securityDeposit,
          moveInDate: newOffer.moveInDate,
          status: newOffer.status,
          totalAmount: newOffer.totalAmount,
          propertyImage: message.property.images?.[0],
          transactionType: newOffer.transactionType,
          isCounterOffer: true
        }
      };
      
      // Send the notification
      await messageService.sendMessage(
        recipientId,
        propertyId,
        JSON.stringify(notificationContent)
      );
      
      // Close modal and show success message
      setShowCounterOfferModal(false);
      alert('Counter offer submitted successfully!');
      
      // Trigger callback to refresh messages
      if (onOfferUpdate) {
        onOfferUpdate();
      }
    } catch (error: any) {
      console.error('Error submitting counter offer:', error);
      
      if (error.response?.data?.message) {
        // Check for specific error messages
        if (error.response.data.message.includes('active offer already exists')) {
          alert('You already have an active offer for this property. Please withdraw it before making a new one.');
        } else {
          alert(error.response.data.message);
        }
      } else {
        alert('Failed to submit counter offer. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitiatePayment = () => {
    const offerId = getMongoId(offerDetails._id);
    setShowPaymentModal(true);
    console.log('Initiating payment for offer:', offerId);
  };

  const handlePaymentComplete = async () => {
    try {
      const offerId = getMongoId(offerDetails._id);
      if (!offerId) {
        console.error('Invalid offer ID');
        return;
      }

      // Fetch updated offer details
      const updatedOffer = await offerService.getOfferById(offerId);
      
      // Update local state
      setLocalOfferStatus(updatedOffer.status);
      
      // Create notification for payment completion
      const notificationContent = {
        type: 'offer' as const,
        content: `Payment completed for ${message.property.propertyName}`,
        offerDetails: {
          ...updatedOffer,
          propertyImage: message.property.images?.[0]
        }
      };

      // Notify the property owner about the payment
      const ownerId = getMongoId(message.receiver._id);
      const propertyId = getMongoId(message.property._id);

      if (ownerId && propertyId) {
        await messageService.sendMessage(
          ownerId,
          propertyId,
          JSON.stringify(notificationContent)
        );
      }

      console.log('Payment completed and status updated:', updatedOffer);
      
      // Close payment modal
      setShowPaymentModal(false);
      
      // Call update callback if provided
      if (onOfferUpdate) {
        onOfferUpdate();
      }
    } catch (error) {
      console.error('Error updating offer status after payment:', error);
      alert('Error updating offer status. Please contact support if payment was completed.');
    }
  };

  const handlePropertyClick = () => {
    const propertyId = getMongoId(message.property._id);
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  const getStatusMessage = () => {
    // Cast currentStatus to the imported OfferStatus type
    const status = currentStatus as OfferStatus;
    
    switch (status) {
      case 'accepted':
        return isRenter 
          ? 'Your offer has been accepted! Please proceed with the initial payment.' 
          : 'Waiting for tenant to complete initial payment';
      case 'rejected':
        return isRenter 
          ? 'Your offer was not accepted. You can revise your offer.'
          : 'You have rejected this offer. Consider making a counter offer.';
      case 'pending':
        return isOwn 
          ? 'Your offer is awaiting response' 
          : 'This offer is awaiting your response';
      case 'pending_acceptance':
        return isRenter
          ? 'Waiting for owner to finalize acceptance'
          : 'Tenant has accepted your counter-offer. Please finalize the acceptance.';
      case 'completed':
        return 'This offer has been completed';
      case 'expired':
        return 'This offer has expired';
      case 'withdrawn':
        return 'This offer has been withdrawn';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_acceptance: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-lightstone text-graphite',
      expired: 'bg-lightstone text-graphite',
      withdrawn: 'bg-lightstone text-graphite',
      completed: 'bg-milk text-graphite'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const renderOfferType = () => {
    if (offerDetails.transactionType === 'sale') {
      return 'Purchase Offer';
    }
    return offerDetails.isCounterOffer ? 'Counter Offer' : 'Rental Offer';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-sm rounded-lg overflow-hidden shadow-lg 
                      ${isOwn ? 'bg-milk' : 'bg-white'}`}>
        <div 
          onClick={handlePropertyClick}
          className="cursor-pointer relative group"
        >
          <img 
            src={message.property.images?.[0] || offerDetails.propertyImage || '/placeholder-property.jpg'} 
            alt={message.property.propertyName}
            className="w-full h-32 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
            <div className="absolute bottom-2 left-2 text-white">
              <h4 className="font-semibold text-sm">{message.property.propertyName}</h4>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3">
          <div className="font-bold text-lg mb-2 text-graphite">{renderOfferType()}</div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                          ${getStatusColor(currentStatus)} mb-1`}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </div>
          
          <p className="text-sm text-graphite mb-3">{getStatusMessage()}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-graphite/70">Monthly Rent:</span>
              <span className="font-semibold text-graphite">
                {offerDetails.currencySymbol}{offerDetails.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite/70">Duration:</span>
              <span className="font-semibold text-graphite">{offerDetails.duration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite/70">Security Deposit:</span>
              <span className="font-semibold text-graphite">
                {offerDetails.currencySymbol}{offerDetails.securityDeposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite/70">Move-in Date:</span>
              <span className="font-semibold text-graphite">
                {new Date(offerDetails.moveInDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Debug info display */}
          <div className="text-xs text-gray-500 mt-2 mb-2 p-1 bg-gray-100 rounded">
            Debug: {debugInfo}
          </div>

          <OfferActions 
            status={currentStatus as any}
            isLister={isLister}
            isRenter={isRenter}
            isOwn={isOwn}
            isCounterOffer={!!offerDetails.isCounterOffer}
            onAccept={handleAccept}
            onReject={handleReject}
            onCounterOffer={handleCounterOffer}
            onInitiatePayment={handleInitiatePayment}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-graphite/60 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative bg-white rounded-lg w-full max-w-3xl m-4">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-graphite"
              disabled={isProcessing}
            >
              ×
            </button>
            <PaymentFlow
              amount={offerDetails.securityDeposit + offerDetails.amount} // First month + deposit
              propertyName={message.property.propertyName}
              onPaymentComplete={handlePaymentComplete}
              offerId={getMongoId(offerDetails._id) || ''}
            />
          </div>
        </div>
      )}
      
      {/* Counter Offer Modal */}
      {showCounterOfferModal && (
        <CounterOfferModal
          isOpen={showCounterOfferModal}
          onClose={() => setShowCounterOfferModal(false)}
          originalOffer={offerDetails}
          property={message.property}
          onSubmit={handleSubmitCounterOffer}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default OfferMessage;