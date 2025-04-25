import React, { useState, useRef } from 'react';
import { FaUpload, FaFileImage, FaMoneyBillWave, FaMobile, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { uploadImageToGCS } from '../../../services/imageUpload';
import { PaymentService } from '../../../services/paymentService';

interface OffPlatformPaymentProps {
  amount: number;
  offerId: string;
  onSuccess: () => void;
}

const OffPlatformPayment: React.FC<OffPlatformPaymentProps> = ({ 
  amount, 
  offerId, 
  onSuccess 
}) => {
  // Form state
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank' | 'cheque' | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment method options
  const paymentMethods = [
    { 
      type: 'cash', 
      label: 'Cash Payment', 
      icon: <FaMoneyBillWave className="text-2xl" /> 
    },
    { 
      type: 'mpesa', 
      label: 'M-PESA Transaction', 
      icon: <FaMobile className="text-2xl" /> 
    },
    { 
      type: 'bank', 
      label: 'Bank Transfer', 
      icon: <FaMoneyBillWave className="text-2xl" /> 
    },
    { 
      type: 'cheque', 
      label: 'Cheque Payment', 
      icon: <FaMoneyBillWave className="text-2xl" /> 
    }
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please upload an image or PDF.');
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage('File is too large. Maximum size is 5MB.');
        return;
      }

      setPaymentProof(file);
      setErrorMessage(null);
    }
  };

  
  // Submit form
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate offerId
    if (!offerId) {
      setErrorMessage('Invalid offer ID. Please refresh and try again.');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage(null);
  
    try {
      // First, upload the proof image if provided
      let proofImageUrl = '';
      if (paymentProof) {
        setUploadingFile(true);
        try {
          proofImageUrl = await uploadImageToGCS(paymentProof);
          setUploadingFile(false);
        } catch (uploadError) {
          setUploadingFile(false);
          throw new Error('Failed to upload payment proof. Please try again.');
        }
      }
  
      // Simplified payment data that matches exactly what the controller expects
      const paymentData = {
        offerId,
        amount,
        paymentMethod: paymentMethod || 'cash',
        proofImageUrl,
        notes: notes || `Payment made via ${paymentMethod || 'cash'}`,
        reference: reference || '',
        // The following fields are used in controller.recordOffPlatformPayment
        // but might not be directly mapped to the Payment model
        type: 'rent',
        currency: 'KES', 
        currencySymbol: 'KES',
        billingCycle: 1,
        isOffPlatform: true
      };
  
      // Record the payment using PaymentService
      console.log('Recording off-platform payment:', paymentData);
      const response = await PaymentService.recordOffPlatformPayment(paymentData);
      
      console.log('Payment recorded successfully:', response);
      onSuccess();
    } catch (error: any) {
      console.error('Off-platform payment error:', error);
      setErrorMessage(error.message || 'Failed to submit payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <FaMoneyBillWave className="text-3xl text-celadon" />
        <div>
          <h3 className="font-semibold text-lg">Off-Platform Payment</h3>
          <p className="text-sm text-gray-600">Verify payment with property owner</p>
        </div>
      </div>

      {/* Amount display */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount to Pay</span>
          <span className="font-semibold text-lg">${amount.toLocaleString()}</span>
        </div>
        
        {/* Important notice about platform's role */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs">
          <div className="flex items-start">
            <FaExclamationCircle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium mb-1">Important Notice</p>
              <p className="text-amber-700">
                Your payment will be marked as pending until verified by the property owner. 
                The platform is not liable for verification of this transaction or any related disputes. 
                We simply record the payment information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment method selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.type}
                type="button"
                onClick={() => setPaymentMethod(method.type as any)}
                className={`p-3 border rounded-lg flex items-center gap-3 transition-colors
                  ${paymentMethod === method.type 
                    ? 'border-celadon bg-celadon/10' 
                    : 'hover:border-gray-300'}`}
              >
                {method.icon}
                <span className="text-sm">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment form - shown after selecting a method */}
        {paymentMethod && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {paymentMethod !== 'cash' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {paymentMethod === 'mpesa' 
                    ? 'M-PESA Transaction Code' 
                    : paymentMethod === 'bank' 
                    ? 'Bank Transfer Reference' 
                    : 'Cheque Number'}
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder={`Enter ${paymentMethod} reference`}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
                  required
                />
              </div>
            )}

            {/* Proof upload (for non-cash payments) */}
            {paymentMethod !== 'cash' && (
              <div>
                <label className="block text-sm font-medium mb-1">Upload Proof</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-3 border border-dashed rounded-lg flex items-center justify-center gap-2 
                      hover:bg-gray-100 transition-colors"
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaUpload />
                    )}
                    <span>
                      {paymentProof 
                        ? `${paymentProof.name}` 
                        : 'Choose File (PDF/Image)'}
                    </span>
                  </button>
                </div>
                {uploadingFile && (
                  <div className="w-full mt-2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-celadon h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>
            )}

            {/* Notes field */}
            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information about the payment"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Error message display */}
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isProcessing || !paymentMethod || (paymentMethod !== 'cash' && !reference)}
              className="w-full py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting Payment...
                </>
              ) : (
                'Submit for Verification'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OffPlatformPayment;