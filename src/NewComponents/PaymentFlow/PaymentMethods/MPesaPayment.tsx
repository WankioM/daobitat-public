import React, { useState, useEffect } from 'react';
import { FaMobile, FaSpinner, FaCheck, FaTimes, FaPhoneAlt } from 'react-icons/fa';

interface MPesaPaymentProps {
  amount: number;
  offerId: string;
  onSuccess: () => void;
}

type PaymentStage = 'input' | 'pushed' | 'confirming' | 'failed';

const MPesaPayment: React.FC<MPesaPaymentProps> = ({ amount, onSuccess, offerId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stage, setStage] = useState<PaymentStage>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timeout
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'pushed' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && stage === 'pushed') {
      setStage('failed');
      setErrorMessage('Payment request timed out. Please try again.');
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStage('pushed');
      setTimeLeft(60);
    } catch (error) {
      setErrorMessage('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckPayment = async () => {
    setIsProcessing(true);
    setCheckCount(prev => prev + 1);

    try {
      // Simulate checking payment status
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success after 2 checks
      if (checkCount >= 1) {
        setStage('confirming');
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSuccess();
      } else {
        setErrorMessage('Payment not received yet. Please try again after entering your PIN.');
      }
    } catch (error) {
      setErrorMessage('Failed to confirm payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setStage('input');
    setErrorMessage('');
    setTimeLeft(60);
    setCheckCount(0);
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
              disabled={isProcessing || !validatePhoneNumber(phoneNumber)}
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
                onClick={handleCheckPayment}
                disabled={isProcessing}
                className="flex-1 py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
          <div className="text-center">
            <FaSpinner className="animate-spin text-3xl text-celadon mx-auto" />
            <p className="mt-4">Confirming your payment...</p>
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
      </div>

      {renderPaymentStage()}
    </div>
  );
};

export default MPesaPayment;