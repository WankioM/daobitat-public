import React, { useState, useEffect } from 'react';
import { FaCoins, FaCalendarAlt, FaClock, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useUser } from '../../../NewContexts/UserContext';
import { 
  Currency,
  getCurrencySymbol,
  getCurrencyByCode,
  currencyGroups
} from '../../../constants/currencies';
import { offerService, CreateOfferDTO } from '../../../services/offerService';
import { messageService } from '../../../services/messageService';
import ConfirmationDialog from './ConfirmationDialog';


interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyId: string;
  ownerId: string;
  listingPrice: number;
  currency: string;
}

export interface OfferData {
  amount: number;
  moveInDate: string;
  duration: number;
  message: string;
  totalAmount: number;
  securityDeposit: number;
  currency: string;
  currencySymbol: string;
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  propertyName,
  propertyId,
  ownerId,
  listingPrice,
  currency: initialCurrency,
}) => {
  const { user } = useUser();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

  // Initialize form data
  const [offerData, setOfferData] = useState<OfferData>({
    amount: listingPrice,
    moveInDate: '',
    duration: 1,
    message: '',
    totalAmount: listingPrice,
    securityDeposit: listingPrice * 0.5, // 50% security deposit
    currency: initialCurrency,
    currencySymbol: getCurrencySymbol(initialCurrency)
  });

  // Calculate total amount whenever amount or duration changes
  useEffect(() => {
    const total = offerData.amount * offerData.duration;
    const deposit = offerData.amount * 0.5; // 50% security deposit
    setOfferData(prev => ({
      ...prev,
      totalAmount: total,
      securityDeposit: deposit
    }));
  }, [offerData.amount, offerData.duration]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!offerData.amount || offerData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (offerData.amount < listingPrice * 0.8) {
      newErrors.amount = 'Offer amount cannot be less than 80% of listing price';
    }

    if (!offerData.moveInDate) {
      newErrors.moveInDate = 'Please select a move-in date';
    } else {
      const selectedDate = new Date(offerData.moveInDate);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.moveInDate = 'Move-in date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      const shouldLogin = window.confirm('You need to be logged in to make an offer. Would you like to log in?');
      if (shouldLogin) {
        window.location.href = '/login';
      }
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmOffer = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Calculate total amount (monthly rent * duration + security deposit)
      const totalAmount = (offerData.amount * offerData.duration) + offerData.securityDeposit;
      
      // Set expiry to 48 hours from now
      const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
  
      // Create the offer with all required fields
      const createOfferDTO: CreateOfferDTO = {
        propertyId,
        amount: offerData.amount,
        securityDeposit: offerData.securityDeposit,
        currency: offerData.currency,
        moveInDate: new Date(offerData.moveInDate),
        duration: offerData.duration,
        message: offerData.message || '', // Ensure message is not undefined
        totalAmount,  // Add total amount
        expiry       // Add expiry date
      };
  
      const offer = await offerService.createOffer(createOfferDTO);
  
      // Send notification message to property owner
      const messageContent = `New offer received for ${propertyName}:
  - Monthly Rent: ${offerData.currencySymbol}${offerData.amount.toLocaleString()}
  - Duration: ${offerData.duration} months
  - Move-in Date: ${new Date(offerData.moveInDate).toLocaleDateString()}
  - Security Deposit: ${offerData.currencySymbol}${offerData.securityDeposit.toLocaleString()}
  - Total Amount: ${offerData.currencySymbol}${totalAmount.toLocaleString()}
  
  ${offerData.message ? `\nMessage from tenant: ${offerData.message}` : ''}`;
  
  await messageService.sendMessage(
    ownerId,
    propertyId,
    JSON.stringify({
      type: 'offer',
      content: `New offer for ${propertyName}`,
      offerDetails: {
        amount: offerData.amount,
        currency: offerData.currency,
        currencySymbol: offerData.currencySymbol,
        duration: offerData.duration,
        status: 'pending',
        securityDeposit: offerData.securityDeposit,
        moveInDate: offerData.moveInDate,
        propertyImage: undefined // Can be added if property images are available
      }
    })
  );

  
      onClose();
      // You might want to show a success toast/notification here
    } catch (error) {
      console.error('Error submitting offer:', error);
      setErrors({ submit: 'Failed to submit offer. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Make an Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Property: {propertyName}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Currency and Amount Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <div className="relative">
                <FaCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCurrency}
                  onChange={(e) => {
                    const newCurrency = e.target.value;
                    const currencyData = getCurrencyByCode(newCurrency);
                    setOfferData(prev => ({
                      ...prev,
                      currency: newCurrency,
                      currencySymbol: currencyData?.symbol || newCurrency
                    }));
                  }}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-celadon"
                >
                  <optgroup label="Fiat Currencies">
                    {currencyGroups.fiat.map((cur: Currency) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.name} ({cur.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cryptocurrencies">
                    {currencyGroups.crypto.map((cur: Currency) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.name} ({cur.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Stablecoins">
                    {currencyGroups.stablecoin.map(cur => (
                      <option key={cur.code} value={cur.code}>
                        {cur.name} ({cur.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent Offer
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {getCurrencySymbol(selectedCurrency)}
                </span>
                <input
                  type="number"
                  value={offerData.amount}
                  onChange={(e) => setOfferData({ ...offerData, amount: Number(e.target.value) })}
                  className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-celadon ${
                    errors.amount ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desired Move-in Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={offerData.moveInDate}
                onChange={(e) => setOfferData({ ...offerData, moveInDate: e.target.value })}
                className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-celadon ${
                  errors.moveInDate ? 'border-red-500' : ''
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.moveInDate && (
              <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>
            )}
          </div>

          {/* Lease Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lease Duration
            </label>
            <div className="relative">
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={offerData.duration}
                onChange={(e) => setOfferData({ ...offerData, duration: Number(e.target.value) })}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-celadon"
              >
                {[1, 3, 6, 12, 24].map((months) => (
                  <option key={months} value={months}>
                    {months} {months === 1 ? 'month' : 'months'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message to Owner (Optional)
            </label>
            <textarea
              value={offerData.message}
              onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-celadon"
              rows={3}
              placeholder="Any additional notes or requests..."
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FaInfoCircle />
              <span className="text-sm">Offer Summary</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monthly Rent:</span>
                <span>{selectedCurrency} {offerData.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span>{selectedCurrency} {offerData.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total Amount:</span>
                <span>{selectedCurrency} {offerData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90 transition-all"
              disabled={isSubmitting}
            >
              Review Offer
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          offerData={offerData}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmOffer}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default MakeOfferModal;