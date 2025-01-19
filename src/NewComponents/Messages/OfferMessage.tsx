import React from 'react';
import { Message, OfferDetails } from '../../types/messages';
import { offerService } from '../../services/offerService';
import { messageService } from '../../services/messageService';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { getMongoId } from '../../utils/mongoUtils';

interface OfferMessageProps {
  message: Message;
  isOwn: boolean;
}

const OfferMessage: React.FC<OfferMessageProps> = ({ message, isOwn }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { offerDetails } = message;
  
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
      // Update offer status using the extracted offerId
      const updatedOffer = action === 'accept' 
        ? await offerService.acceptOffer(offerId)
        : await offerService.rejectOffer(offerId);
  
      // Ensure we preserve all offer details including _id when creating notification
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
    console.log('Initiating payment for offer:', offerId);
  };

  const handlePropertyClick = () => {
    const propertyId = getMongoId(message.property._id);
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  const isLister = getMongoId(user?._id) === getMongoId(message.receiver._id);
  const isRenter = getMongoId(user?._id) === getMongoId(message.sender._id);
  const showPaymentButton = isRenter && offerDetails.status === 'accepted';
  const showActionButtons = isLister && offerDetails.status === 'pending';

  const getStatusMessage = () => {
    switch (offerDetails.status) {
      case 'accepted':
        return isRenter ? 'Please proceed with payment' : 'Waiting for payment';
      case 'rejected':
        return 'Offer was rejected';
      case 'pending':
        return 'Awaiting response';
      default:
        return offerDetails.status;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-sm rounded-lg overflow-hidden shadow-lg 
                      ${isOwn ? 'bg-celadon/10' : 'bg-white'}`}>
        {/* Property Image Banner - Clickable */}
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
        
        {/* Offer Details */}
        <div className="px-4 py-3">
          <div className="font-bold text-lg mb-2">Rental Offer</div>
          
          {/* Status Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                          ${getStatusColor(offerDetails.status)} mb-1`}>
            {offerDetails.status.charAt(0).toUpperCase() + offerDetails.status.slice(1)}
          </div>
          
          {/* Status Message */}
          <p className="text-sm text-gray-600 mb-3">{getStatusMessage()}</p>
          
          {/* Offer Details */}
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

          {/* Action Buttons for Lister */}
          {showActionButtons && (
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleAction('reject')}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction('accept')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                Accept
              </button>
            </div>
          )}

          {/* Payment Button for Renter */}
          {showPaymentButton && (
            <div className="mt-4">
              <button
                onClick={handleInitiatePayment}
                className="w-full py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: OfferDetails['status']): string => {
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

export default OfferMessage;