import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useUser } from '../../../NewContexts/UserContext';
import { offerService, CreateOfferDTO, Property } from '../../../services/offerService';
import { messageService } from '../../../services/messageService';
import ConfirmationDialog from './ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import ErrorReroute from '../../Errors/ErrorReroute';
import { OfferFormData } from './OfferForm';
import OfferForm from './OfferForm';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyId: string;
  ownerId: string;
  listingPrice: number;
  currency: string;
  propertyData: Property; // Add this line
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  propertyName,
  propertyId,
  ownerId,
  listingPrice,
  currency: initialCurrency,
  propertyData
}) => {
  const { user } = useUser();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorRedirect, setErrorRedirect] = useState<{show: boolean; message: string} | null>(null);
  const [formData, setFormData] = useState<OfferFormData | null>(null);
  const navigate = useNavigate();

  
  // Determine the transaction type based on property data
    const transactionType = 
    propertyData.action === 'rent' || 
    (propertyData.action as string) === 'for rent' || 
    String(propertyData.action).includes('rent')
      ? 'rental' 
      : 'sale';

  const handleOfferFormSubmit = (data: OfferFormData) => {
    if (!user) {
      const shouldLogin = window.confirm('You need to be logged in to make an offer. Would you like to log in?');
      if (shouldLogin) {
        window.location.href = '/login';
      }
      return;
    }

    // Store form data and show confirmation dialog
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleConfirmOffer = async () => {
    if (!user || !formData) return;
    
    setIsSubmitting(true);
    try {
      const deadlineHours = formData.responseDeadlineDays ? (formData.responseDeadlineDays * 24) : (14 * 24);
      const expiry = new Date(Date.now() + deadlineHours * 60 * 60 * 1000);
  
      // Make sure we have a valid ownerId
      if (!ownerId) {
        throw new Error('Property owner information is missing');
      }
  
      // Create the offer with all required fields
      const createOfferDTO: CreateOfferDTO = {
        propertyId,
        amount: formData.amount,
        securityDeposit: formData.securityDeposit,
        currency: formData.currency,
        moveInDate: new Date(formData.moveInDate),
        duration: formData.duration,
        message: formData.message || '', // Ensure message is not undefined
        totalAmount: formData.totalAmount,
        expiry, // Add expiry date
        transactionType // Use the determined transaction type
      };
  
      console.log('Creating offer with data:', createOfferDTO);
      const offer = await offerService.createOffer(createOfferDTO);
      console.log('Offer created successfully:', offer._id);
  
      // Add debugging to verify ownerId is valid
      console.log('Sending message to owner ID:', ownerId);
      console.log('Property ID:', propertyId);
  
      // Send notification message to property owner
      try {
        await messageService.sendMessage(
          ownerId,
          propertyId,
          JSON.stringify({
            type: 'offer',
            content: `New offer for ${propertyName}`,
            offerDetails: {
              _id: offer._id,
              amount: formData.amount,
              currency: formData.currency,
              currencySymbol: formData.currencySymbol,
              duration: formData.duration,
              status: 'pending',
              securityDeposit: formData.securityDeposit,
              moveInDate: formData.moveInDate,
              totalAmount: formData.totalAmount,
              propertyImage: propertyData.images?.[0], // Use the first property image if available
              transactionType // Use the determined transaction type
            }
          })
        );
        console.log('Offer message sent successfully');
        navigate(`/offer/${offer._id}`, { 
          state: { 
            fromCreateOffer: true,
            propertyId: propertyId 
          } 
        });
      } catch (messageError) {
        console.error('Error sending offer message:', messageError);
        // Continue anyway, as the offer was created successfully
        // The UI will show the offer in the dashboard even if the message fails
      }
  
      onClose();
      // You might want to show a success toast/notification here
    } catch (error:any) {
      console.error('Error submitting offer:', error);
      if (error.message?.includes('active offer already exists') || 
        (error.response?.data?.message && error.response.data.message.includes('active offer already exists'))) {
        setErrorRedirect({
          show: true,
          message: "An offer has already been created for this property"
        });
      } else {
        // Show error in the confirmation dialog
        setErrorRedirect({
          show: true,
          message: "Failed to submit offer. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-graphite/60 z-40 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-milk rounded-lg shadow-xl max-w-md w-full mt-24 mb-8">
        {/* Header */}
        <div className="sticky top-0 bg-milk px-6 py-4 border-b border-lightstone z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-graphite">
              {transactionType === 'rental' ? 'Make a Rental Offer' : 'Make a Purchase Offer'}
            </h2>
            <button
              onClick={onClose}
              className="text-graphite hover:text-rustyred transition-colors"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <p className="text-graphite/70 text-sm mt-1">
            Property: {propertyName}
          </p>
        </div>

        {/* Updated Offer Form Component */}
        <OfferForm 
            initialAmount={listingPrice}
            initialCurrency={initialCurrency}
            propertyData={propertyData}
            onSubmit={handleOfferFormSubmit}
            onCancel={onClose}
          />
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && formData && (
        <ConfirmationDialog
          offerData={{
            ...formData,
            transactionType // Ensure we use the determined transaction type
          }}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmOffer}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Error Redirect Component */}
      {errorRedirect && errorRedirect.show && (
        <ErrorReroute
          errorMessage={errorRedirect.message}
          redirectRoute="/listerdashboard"
          redirectState={{ activeTab: 'Billings' }}
          timeout={2000}
        />
      )}
    </div>
  );
};

export default MakeOfferModal;