// src/NewComponents/Messages/OfferMessage.tsx
import React , { useState } from 'react';
import { Message } from '../../types/messages';
import { offerService } from '../../services/offerService';
import { messageService } from '../../services/messageService';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { getMongoId } from '../../utils/mongoUtils';
import OfferActions from './OfferActions';
import PaymentFlow from '../PaymentFlow/PaymentFlow';

interface OfferMessageProps {
  message: Message;
  isOwn: boolean;
}

const OfferMessage: React.FC<OfferMessageProps> = ({ message, isOwn }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { offerDetails } = message;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  if (!offerDetails) return null;

  const handleAction = async (action: 'accept' | 'reject') => {
    if (!offerDetails) {
      console.error('No offer details found');
      return;
    }

    const offerId = getMongoId(offerDetails._id);
    if (!offerId) {
      console.error('No valid offer ID found in offer details:', offerDetails);
      return;
    }
  
    try {
      const updatedOffer = action === 'accept' 
        ? await offerService.acceptOffer(offerId)
        : await offerService.rejectOffer(offerId);
  
      const notificationContent = {
        type: 'offer' as const,
        content: `Offer ${action}ed for ${message.property.propertyName}`,
        offerDetails: {
          _id: updatedOffer._id,
          amount: updatedOffer.amount,
          currency: updatedOffer.currency,
          currencySymbol: updatedOffer.currencySymbol,
          duration: updatedOffer.duration,
          securityDeposit: updatedOffer.securityDeposit,
          moveInDate: updatedOffer.moveInDate,
          status: updatedOffer.status,
          totalAmount: updatedOffer.totalAmount,
          propertyImage: message.property.images?.[0]
        }
      };

      const senderId = getMongoId(message.sender._id);
      const propertyId = getMongoId(message.property._id);

      if (!senderId || !propertyId) {
        throw new Error('Invalid sender or property ID');
      }

      await messageService.sendMessage(
        senderId,
        propertyId,
        JSON.stringify(notificationContent)
      );
  
      console.log(`Offer ${action}ed successfully:`, updatedOffer);
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
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
      
      // Create notification for payment completion
      const notificationContent = {
        type: 'offer' as const,
        content: `Payment completed for ${message.property.propertyName}`,
        offerDetails: {
          _id: updatedOffer._id,
          amount: updatedOffer.amount,
          currency: updatedOffer.currency,
          currencySymbol: updatedOffer.currencySymbol,
          duration: updatedOffer.duration,
          securityDeposit: updatedOffer.securityDeposit,
          moveInDate: updatedOffer.moveInDate,
          status: updatedOffer.status,
          totalAmount: updatedOffer.totalAmount,
          propertyImage: message.property.images?.[0]
        }
      };

      // Send payment completion notification
      const senderId = getMongoId(message.sender._id);
      const propertyId = getMongoId(message.property._id);

      if (!senderId || !propertyId) {
        throw new Error('Invalid sender or property ID');
      }

      await messageService.sendMessage(
        senderId,
        propertyId,
        JSON.stringify(notificationContent)
      );

      console.log('Payment completed and status updated:', updatedOffer);
      
      // Close payment modal
      setShowPaymentModal(false);
      
    } catch (error) {
      console.error('Error updating offer status after payment:', error);
      // Optionally show error notification to user
      alert('Error updating offer status. Please contact support if payment was completed.');
    }
  };

  const handlePropertyClick = () => {
    const propertyId = getMongoId(message.property._id);
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  const isLister = getMongoId(user?._id) === getMongoId(message.receiver._id);
  const isRenter = getMongoId(user?._id) === getMongoId(message.sender._id);

  const getStatusMessage = () => {
    switch (offerDetails.status) {
      case 'accepted':
        return isRenter 
          ? 'Your offer has been accepted! Please proceed with the initial payment.' 
          : 'Waiting for tenant to complete initial payment';
      case 'rejected':
        return isRenter 
          ? 'Your offer was not accepted. You can revise your offer or close this chat.'
          : 'You have rejected this offer.';
      case 'pending':
        return 'Awaiting response';
      default:
        return offerDetails.status;
    }
  };

  const getStatusColor = (status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'completed'): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      withdrawn: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-sm rounded-lg overflow-hidden shadow-lg 
                      ${isOwn ? 'bg-celadon/10' : 'bg-white'}`}>
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
          <div className="font-bold text-lg mb-2">Rental Offer</div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                          ${getStatusColor(offerDetails.status)} mb-1`}>
            {offerDetails.status.charAt(0).toUpperCase() + offerDetails.status.slice(1)}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{getStatusMessage()}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent:</span>
              <span className="font-semibold">
                {offerDetails.currencySymbol}{offerDetails.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{offerDetails.duration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Deposit:</span>
              <span className="font-semibold">
                {offerDetails.currencySymbol}{offerDetails.securityDeposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Move-in Date:</span>
              <span className="font-semibold">
                {new Date(offerDetails.moveInDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <OfferActions 
            status={offerDetails.status}
            isLister={isLister}
            isRenter={isRenter}
            onAccept={() => handleAction('accept')}
            onReject={() => handleAction('reject')}
            onInitiatePayment={handleInitiatePayment}
          />
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative bg-white rounded-lg w-full max-w-3xl m-4">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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

    </div>
  );
};

export default OfferMessage;