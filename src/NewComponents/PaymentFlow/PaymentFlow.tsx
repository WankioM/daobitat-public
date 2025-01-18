import React, { useState } from 'react';
import { FaWallet, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

interface PaymentFlowProps {
  amount: number;
  propertyName: string;
  onPaymentComplete: () => void;
}

type PaymentMethod = 'wallet' | 'card';

const PaymentFlow: React.FC<PaymentFlowProps> = ({
  amount,
  propertyName,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  const PaymentSuccessModal = () => (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Your payment is now in escrow. The funds will be released once you confirm moving in.
        </p>
        <button
          onClick={onPaymentComplete}
          className="w-full py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h3 className="font-semibold mb-4">Payment Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Property</span>
          <span>{propertyName}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total Amount</span>
          <span>${amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod('wallet')}
            className={`flex-1 p-4 border rounded-lg flex items-center justify-center gap-2 ${
              paymentMethod === 'wallet' ? 'border-celadon bg-celadon/10' : ''
            }`}
          >
            <FaWallet />
            <span>Crypto Wallet</span>
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 p-4 border rounded-lg flex items-center justify-center gap-2 ${
              paymentMethod === 'card' ? 'border-celadon bg-celadon/10' : ''
            }`}
          >
            <FaCreditCard />
            <span>Credit Card</span>
          </button>
        </div>

        {paymentMethod === 'wallet' && (
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Connect Wallet</h4>
            <p className="text-gray-600 text-sm mb-4">
              Connect your wallet to process the payment through our smart contract.
            </p>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Connect & Pay'}
            </button>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Card Details</h4>
            {/* Add card form fields here */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-2 bg-celadon text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        )}
      </div>

      {showSuccessModal && <PaymentSuccessModal />}
    </div>
  );
};

export default PaymentFlow;