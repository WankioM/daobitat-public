import React, { useState } from 'react';
import { OfferDetails } from '../../types/messages';
import { FaCalendarAlt, FaCoins, FaClock } from 'react-icons/fa';

// Define the MongoDBId type to match what's in your system
interface MongoDBId {
  $oid: string;
  [key: string]: any;
}

// Use a property type that matches what's available in the Message component
interface PropertyForModal {
  _id: string | MongoDBId; // Allow for both string and MongoDBId
  propertyName: string;
  propertyType?: string;
  images?: string[];
  [key: string]: any; // Allow for additional properties
}

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalOffer: OfferDetails;
  property: PropertyForModal;
  onSubmit: (counterOfferData: CounterOfferData) => Promise<void>;
  isProcessing: boolean;
}

export interface CounterOfferData {
  amount: number;
  securityDeposit: number;
  duration: number;
  moveInDate: string;
  message: string;
  currency: string;
}

const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  isOpen,
  onClose,
  originalOffer,
  property,
  onSubmit,
  isProcessing
}) => {
  const [formData, setFormData] = useState<CounterOfferData>({
    amount: originalOffer.amount,
    securityDeposit: originalOffer.securityDeposit,
    duration: originalOffer.duration,
    moveInDate: new Date(originalOffer.moveInDate).toISOString().split('T')[0],
    message: '',
    currency: originalOffer.currency
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'securityDeposit' || name === 'duration' 
        ? Number(value) 
        : value
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.securityDeposit || formData.securityDeposit < 0) {
      errors.securityDeposit = 'Please enter a valid security deposit';
    }
    
    if (!formData.moveInDate) {
      errors.moveInDate = 'Please select a move-in date';
    } else {
      const selectedDate = new Date(formData.moveInDate);
      const today = new Date();
      if (selectedDate < today) {
        errors.moveInDate = 'Move-in date cannot be in the past';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-graphite/60 z-50 flex items-center justify-center overflow-y-auto">
      <div className="relative bg-milk rounded-lg max-w-md w-full m-4">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-graphite hover:text-rustyred"
            disabled={isProcessing}
          >
            ×
          </button>
          
          <h2 className="text-xl font-bold text-graphite mb-2">Counter Offer</h2>
          <p className="text-sm text-graphite/70 mb-6">
            For: {property.propertyName}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  Monthly Rent
                </label>
                <div className="relative">
                  <FaCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-rustyred focus:border-rustyred ${
                      formErrors.amount ? 'border-rustyred' : ''
                    }`}
                  />
                </div>
                {formErrors.amount && (
                  <p className="text-rustyred text-sm mt-1">{formErrors.amount}</p>
                )}
              </div>
              
              {/* Security Deposit */}
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  Security Deposit
                </label>
                <div className="relative">
                  <FaCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    className={`pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-rustyred focus:border-rustyred ${
                      formErrors.securityDeposit ? 'border-rustyred' : ''
                    }`}
                  />
                </div>
                {formErrors.securityDeposit && (
                  <p className="text-rustyred text-sm mt-1">{formErrors.securityDeposit}</p>
                )}
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  Lease Duration (months)
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-rustyred focus:border-rustyred"
                  >
                    {[1, 3, 6, 12, 24].map((months) => (
                      <option key={months} value={months}>
                        {months} {months === 1 ? 'month' : 'months'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Move-in Date */}
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  Move-in Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
                  <input
                    type="date"
                    name="moveInDate"
                    value={formData.moveInDate}
                    onChange={handleChange}
                    className={`pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-rustyred focus:border-rustyred ${
                      formErrors.moveInDate ? 'border-rustyred' : ''
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {formErrors.moveInDate && (
                  <p className="text-rustyred text-sm mt-1">{formErrors.moveInDate}</p>
                )}
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Explain your counter offer..."
                  className="w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-rustyred focus:border-rustyred"
                  rows={3}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-graphite hover:text-rustyred transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>Submitting...</span>
                  ) : (
                    <span>Submit Counter Offer</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounterOfferModal;