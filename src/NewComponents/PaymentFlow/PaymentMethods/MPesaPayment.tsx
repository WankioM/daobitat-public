import React, { useState, useEffect } from 'react';
import { FaMobile, FaSpinner, FaCheck, FaTimes, FaPhoneAlt } from 'react-icons/fa';
import PaymentService from '../../../services/paymentService';

interface MPesaPaymentProps {
  amount: number;
  offerId: string;
  onSuccess: () => void;
  paymentType?: 'rent' | 'deposit';
}

type PaymentStage = 'input' | 'pushed' | 'confirming' | 'completed' | 'failed';

const MPesaPayment: React.FC<MPesaPaymentProps> = ({ 
  amount, 
  offerId, 
  onSuccess, 
  paymentType = 'rent'
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stage, setStage] = useState<PaymentStage>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timeout
  const [checkCount, setCheckCount] = useState(0);
  const [paymentId, setPaymentId] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

  // Timer for countdown and automatic status checking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (stage === 'pushed') {
      // Set up the countdown timer
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else {
        setStage('failed');
        setErrorMessage('Payment request timed out. Please try again.');
      }
      
      // Set up automatic status checking every 5 seconds
      if (paymentId && checkoutRequestId) {
        const statusTimer = setInterval(() => {
          checkPaymentStatus();
        }, 5000);
        
        // Clean up the status timer
        return () => {
          clearInterval(statusTimer);
          clearInterval(timer);
        };
      }
    }
    
    return () => clearInterval(timer);
  }, [stage, timeLeft, paymentId, checkoutRequestId]);

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digits
    let numbers = input.replace(/\D/g, '');

    // Handle different formats
    if (numbers.startsWith('254')) {
      numbers = numbers.substring(0, 12);
    } else if (numbers.startsWith('0')) {
      numbers = '254' + numbers.substring(1);
    } else if (numbers.startsWith('7') || numbers.startsWith('1')) {
      numbers = '254' + numbers;
    }

    // Format for display (optional)
    if (numbers.length > 9) {
      const formatted = numbers.match(/(\d{3})(\d{3})(\d{3})(\d{3})?/);
      if (formatted) {
        return formatted.slice(1).join(' ').trim();
      }
    }

    return numbers;
  };

  const validatePhoneNumber = (number: string): boolean => {
    const regex = /^254(7|1)\d{8}$/;
    return regex.test(number.replace(/\s/g, ''));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleInitiate = async () => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // Call the PaymentService to initiate M-PESA payment
      const response = await PaymentService.initializeMpesaPayment({
        offerId,
        amount,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        paymentType
      });
      
      if (response.status === 'success' && response.data) {
        // Store payment ID and checkout request ID for status checking
        setPaymentId(response.data.paymentId);
        setCheckoutRequestId(response.data.checkoutRequestID);
        
        // Update stage to pushed
        setStage('pushed');
        setTimeLeft(60);
        
        console.log('M-PESA payment initiated:', response.data);
      } else {
        throw new Error(response.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('M-PESA payment initiation error:', error);
      setErrorMessage(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentId || !checkoutRequestId) return;
    
    try {
      // Check payment status without showing loading state
      const response = await PaymentService.checkMpesaPaymentStatus(
        paymentId, 
        checkoutRequestId
      );
      
      console.log('Payment status check response:', response);
      
      if (response.status === 'success' && response.data) {
        if (response.data.paymentStatus === 'completed') {
          // Payment successful - update escrow
          if (response.data.transactionId) {
            await updateEscrow(response.data.transactionId);
          }
          
          // Set completed stage
          setStage('completed');
          setTimeout(() => onSuccess(), 1500);
        } else if (response.data.paymentStatus === 'failed') {
          // Payment failed
          setStage('failed');
          setErrorMessage('Payment was not successful. Please try again.');
        }
        // If still pending, keep waiting
      }
    } catch (error) {
      console.error('Payment status check error:', error);
      // Don't show error message for automatic checks
    }
  };

  const updateEscrow = async (transactionId: string) => {
    try {
      // Update the escrow contract with the M-PESA payment
      await PaymentService.updateEscrowWithMpesaPayment(paymentId, transactionId);
    } catch (error) {
      console.error('Error updating escrow:', error);
      // Continue even if escrow update fails - payment was successful
    }
  };

  const handleManualCheck = async () => {
    setIsProcessing(true);
    setCheckCount(prev => prev + 1);

    try {
      await checkPaymentStatus();
      
      // If we're still here and not redirected, payment is still pending
      if (checkCount >= 2) {
        // After 3 manual checks, show confirming state while we continue to poll
        setStage('confirming');
      } else {
        setErrorMessage(`Payment not received yet. Please make sure you've entered your PIN.`);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to confirm payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setStage('input');
    setErrorMessage('');
    setTimeLeft(60);
    setCheckCount(0);
    setPaymentId('');
    setCheckoutRequestId('');
  };

  const renderPaymentStage = () => {
    switch (stage) {
      case 'input':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">M-PESA Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="e.g., 254712345678"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
                maxLength={12}
                required
              />
              <p className="text-sm text-gray-500 mt-1">Enter your M-PESA registered number</p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleInitiate}
              disabled={isProcessing || !validatePhoneNumber(phoneNumber.replace(/\s/g, ''))}
              className="w-full py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <FaPhoneAlt />
                  Request Payment
                </>
              )}
            </button>
          </div>
        );

      case 'pushed':
        return (
          <div className="space-y-6 text-center">
            <div className="animate-pulse">
              <FaMobile className="text-5xl text-celadon mx-auto mb-4" />
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Payment Request Sent!</h4>
              <p className="text-sm text-gray-600">
                1. You will receive a prompt on your phone
              </p>
              <p className="text-sm text-gray-600">
                2. Enter your M-PESA PIN to complete payment
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Time remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleManualCheck}
                disabled={isProcessing}
                className="flex-1 py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? <FaSpinner className="animate-spin mr-2" /> : null}
                {isProcessing ? 'Checking...' : 'I\'ve Entered PIN'}
              </button>
              <button
                onClick={handleRetry}
                disabled={isProcessing}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="space-y-4 text-center">
            <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto">
              <FaTimes className="text-3xl text-red-600 m-2" />
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Failed</h4>
              <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
            </div>

            <button
              onClick={handleRetry}
              className="w-full py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        );

      case 'confirming':
        return (
          <div className="text-center space-y-4">
            <FaSpinner className="animate-spin text-3xl text-celadon mx-auto" />
            <p className="mt-4">Confirming your payment...</p>
            <p className="text-sm text-gray-500">
              This may take a moment. Please don't close this window.
            </p>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center space-y-4">
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto">
              <FaCheck className="text-3xl text-green-600 m-2" />
            </div>
            <h4 className="font-medium">Payment Successful!</h4>
            <p className="text-sm text-gray-600">Your payment has been processed successfully.</p>
          </div>
        );
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <FaMobile className="text-3xl text-celadon" />
        <div>
          <h3 className="font-semibold text-lg">M-PESA Payment</h3>
          <p className="text-sm text-gray-600">Pay directly from your M-PESA account</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount to Pay</span>
          <span className="font-semibold text-lg">KSh {amount.toLocaleString()}</span>
        </div>
        {paymentType === 'deposit' && (
          <p className="text-xs text-gray-500 mt-1">
            Includes security deposit and first month's rent
          </p>
        )}
      </div>

      {renderPaymentStage()}
    </div>
  );
};

export default MPesaPayment;