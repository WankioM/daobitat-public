import React, { useState } from 'react';
import { FaWallet, FaCreditCard, FaMobile } from 'react-icons/fa';
import WalletPayment from './PaymentMethods/WalletPayment';
import CardPayment from './PaymentMethods/CardPayment';
import MPesaPayment from './PaymentMethods/MPesaPayment';
import PaymentSuccess from './PaymentSuccess';

type PaymentMethod = 'wallet' | 'card' | 'mpesa' | null;

interface PaymentFlowProps {
  amount: number;
  propertyName: string;
  onPaymentComplete: () => void;
  offerId: string;
  disabled?: boolean;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({
  amount,
  propertyName,
  onPaymentComplete,
  offerId
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
  };

  const getPaymentComponent = () => {
    const props = { amount, offerId, onSuccess: handlePaymentSuccess };
    
    switch (paymentMethod) {
      case 'wallet':
        return <WalletPayment {...props} />;
      case 'card':
        return <CardPayment {...props} />;
      case 'mpesa':
        return <MPesaPayment {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
      
      {/* Payment Summary */}
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

      {/* Payment Method Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setPaymentMethod('wallet')}
          className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2
            ${paymentMethod === 'wallet' ? 'border-celadon bg-celadon/10' : ''}`}
        >
          <FaWallet className="text-2xl" />
          <span>Crypto Wallet</span>
        </button>
        
        <button
          onClick={() => setPaymentMethod('card')}
          className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2
            ${paymentMethod === 'card' ? 'border-celadon bg-celadon/10' : ''}`}
        >
          <FaCreditCard className="text-2xl" />
          <span>Card Payment</span>
        </button>
        
        <button
          onClick={() => setPaymentMethod('mpesa')}
          className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2
            ${paymentMethod === 'mpesa' ? 'border-celadon bg-celadon/10' : ''}`}
        >
          <FaMobile className="text-2xl" />
          <span>M-PESA</span>
        </button>
      </div>

      {/* Selected Payment Method Component */}
      {getPaymentComponent()}

      {/* Success Modal */}
      {showSuccess && (
        <PaymentSuccess
          onComplete={onPaymentComplete}
        />
      )}
    </div>
  );
};

export default PaymentFlow;