import React, { useState, useEffect } from 'react';
import { FaCoins, FaCalendarAlt, FaClock, FaInfoCircle, FaArrowRight, FaArrowLeft, FaHome, FaExchangeAlt } from 'react-icons/fa';
import { 
  Currency,
  getCurrencySymbol,
  getCurrencyByCode,
  currencyGroups
} from '../../../constants/currencies';
import { Property } from '../../../services/offerService';


export interface OfferFormData {
    amount: number;
    moveInDate: string;
    duration: number;
    message: string;
    totalAmount: number;
    securityDeposit: number;
    currency: string;
    currencySymbol: string;
    transactionType: 'rental' | 'sale';
    responseDeadlineDays?: number;
    responseDeadline?: Date;
  }

interface OfferFormProps {
  initialAmount: number;
  initialCurrency: string;
  propertyData: Property;
  onSubmit: (formData: OfferFormData) => void;
  onCancel: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({
  initialAmount,
  initialCurrency,
  propertyData,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

  // Determine transaction type from property data
  const transactionType = propertyData.action === 'rent' || 
                        (propertyData.action as string) === 'for rent' || 
                        String(propertyData.action).includes('rent')
  ? 'rental' 
  : 'sale';
  // Initialize form data
  const [formData, setFormData] = useState<OfferFormData>({
    amount: initialAmount,
    moveInDate: '',
    duration: transactionType === 'rental' ? 1 : 0,
    message: '',
    totalAmount: initialAmount,
    securityDeposit: initialAmount * (transactionType === 'rental' ? 0.5 : 0.1),
    currency: initialCurrency,
    currencySymbol: getCurrencySymbol(initialCurrency),
    transactionType: transactionType,
    responseDeadlineDays: 14 // Default to 14 days
  });
  // Calculate total amount whenever amount or duration changes
  useEffect(() => {
    let total: number;
    let deposit: number;

    if (transactionType === 'rental') {
      // For rentals, total is (monthly rent * duration)
      total = formData.amount * formData.duration;
      deposit = formData.amount * 0.5; // 50% security deposit
    } else {
      // For sales, total is just the purchase price
      total = formData.amount;
      deposit = formData.amount * 0.1; // 10% deposit for purchase
    }

    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      securityDeposit: deposit
    }));
  }, [formData.amount, formData.duration, transactionType]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.amount || formData.amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }

      if (formData.amount < initialAmount * 0.8) {
        newErrors.amount = 'Offer amount cannot be less than 80% of listing price';
      }
    }

    if (step === 2) {
      if (!formData.moveInDate) {
        newErrors.moveInDate = 'Please select a move-in date';
      } else {
        const selectedDate = new Date(formData.moveInDate);
        const today = new Date();
        if (selectedDate < today) {
          newErrors.moveInDate = 'Move-in date cannot be in the past';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    const responseDeadline = new Date();
  responseDeadline.setHours(responseDeadline.getHours() + ((formData.responseDeadlineDays || 14) * 24));
    
    // Pass data to parent with response deadline
    onSubmit({
      ...formData,
      responseDeadline
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-6">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center">
        <div className="w-full bg-lightstone/50 rounded-full h-2">
          <div 
            className="bg-desertclay h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm text-graphite/70">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Step 1: Basic Offer Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-graphite">Offer Details</h3>
          
          {/* Transaction Type Indicator (non-interactive) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-graphite mb-2">
              Offer Type
            </label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-desertclay/10 border border-desertclay text-desertclay">
              {transactionType === 'rental' ? (
                <>
                  <FaHome className="text-desertclay" />
                  <span className="font-medium">Rental Offer</span>
                </>
              ) : (
                <>
                  <FaExchangeAlt className="text-desertclay" />
                  <span className="font-medium">Purchase Offer</span>
                </>
              )}
            </div>
          </div>
          
          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-graphite mb-1">
              Currency
            </label>
            <div className="relative">
              <FaCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
              <select
                value={selectedCurrency}
                onChange={(e) => {
                  const newCurrency = e.target.value;
                  const currencyData = getCurrencyByCode(newCurrency);
                  setFormData(prev => ({
                    ...prev,
                    currency: newCurrency,
                    currencySymbol: currencyData?.symbol || newCurrency
                  }));
                }}
                className="pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-desertclay focus:border-desertclay"
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

          {/* Amount Offer */}
          <div>
            <label className="block text-sm font-medium text-graphite mb-1">
              {transactionType === 'rental' ? 'Monthly Rent Offer' : 'Purchase Price Offer'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50">
                {getCurrencySymbol(selectedCurrency)}
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={`pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-desertclay focus:border-desertclay ${
                  errors.amount ? 'border-rustyred' : ''
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-rustyred text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Lease Duration (only for rentals) */}
          {transactionType === 'rental' && (
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">
                Lease Duration
              </label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-desertclay focus:border-desertclay"
                >
                  {[1, 3, 6, 12, 24].map((months) => (
                    <option key={months} value={months}>
                      {months} {months === 1 ? 'month' : 'months'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-graphite hover:text-rustyred transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={goToNextStep}
              className="ml-3 px-4 py-2 bg-desertclay text-white rounded-lg hover:bg-rustyred transition-colors flex items-center"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Additional Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-graphite">
            {transactionType === 'rental' ? 'Move-In & Additional Details' : 'Additional Details'}
          </h3>
          
          {/* Move-in Date / Possession Date */}
          <div>
            <label className="block text-sm font-medium text-graphite mb-1">
              {transactionType === 'rental' ? 'Desired Move-in Date' : 'Desired Possession Date'}
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite/50" />
              <input
                type="date"
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className={`pl-10 w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-desertclay focus:border-desertclay ${
                  errors.moveInDate ? 'border-rustyred' : ''
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.moveInDate && (
              <p className="text-rustyred text-sm mt-1">{errors.moveInDate}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-graphite mb-1">
              Message to Owner (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border border-lightstone rounded-lg bg-white focus:ring-2 focus:ring-desertclay focus:border-desertclay"
              rows={3}
              placeholder="Any additional notes or requests..."
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-graphite hover:text-rustyred transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <button
              type="button"
              onClick={goToNextStep}
              className="px-4 py-2 bg-desertclay text-white rounded-lg hover:bg-rustyred transition-colors flex items-center"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Offer Summary */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-graphite">Offer Summary</h3>
          
          {/* Summary */}
          <div className="bg-lightstone/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-graphite mb-2">
              <FaInfoCircle className="text-desertclay" />
              <span className="text-sm font-medium">Offer Summary</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{transactionType === 'rental' ? 'Monthly Rent:' : 'Purchase Price:'}</span>
                <span className="font-medium">{formData.currencySymbol} {formData.amount.toLocaleString()}</span>
              </div>
              
              {transactionType === 'rental' && (
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{formData.duration} {formData.duration === 1 ? 'month' : 'months'}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>{transactionType === 'rental' ? 'Security Deposit:' : 'Initial Deposit:'}</span>
                <span className="font-medium">{formData.currencySymbol} {formData.securityDeposit.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t border-lightstone/50">
                <span>Total Amount:</span>
                <span className="text-rustyred">{formData.currencySymbol} {formData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {formData.moveInDate && (
            <div className="bg-white p-4 rounded-lg border border-lightstone">
              <div className="flex justify-between">
                <span className="text-graphite/70">
                  {transactionType === 'rental' ? 'Move-in Date:' : 'Possession Date:'}
                </span>
                <span className="font-medium">{new Date(formData.moveInDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}
          
          {formData.message && (
            <div className="bg-white p-4 rounded-lg border border-lightstone">
              <div className="text-sm">
                <p className="font-medium mb-1">Your message:</p>
                <p className="text-graphite/70">{formData.message}</p>
              </div>
            </div>
          )}

          {/* Response Deadline */}
          <div className="bg-white p-4 rounded-lg border border-lightstone">
            <div className="flex justify-between">
                <span className="text-graphite/70">Owner response deadline:</span>
                <span className="font-medium">
                {formData.responseDeadlineDays || 14} {(formData.responseDeadlineDays || 14) === 1 ? 'day' : 'days'} after submission
                </span>
            </div>
            </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-graphite hover:text-rustyred transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-desertclay text-white rounded-lg hover:bg-rustyred transition-colors"
            >
              Review Offer
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default OfferForm;