import React, { useState } from 'react';
import { FaCheckCircle, FaFilePdf, FaWhatsapp, FaEnvelope, FaDownload } from 'react-icons/fa';

interface PaymentSuccessProps {
  onComplete: () => void;
  paymentDetails?: {
    transactionId: string;
    amount: number;
    currency: string;
    method: string;
    date: Date;
    reference: string;
    propertyName?: string;
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  onComplete,
  paymentDetails = {
    transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: 0,
    currency: 'KES',
    method: 'M-PESA',
    date: new Date(),
    reference: 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  }
}) => {
  const [showShare, setShowShare] = useState(false);

  const handleDownloadReceipt = () => {
    // Implement receipt download
    console.log('Downloading receipt...');
  };

  const handleShare = (method: 'whatsapp' | 'email') => {
    const message = `Payment Confirmation for ${paymentDetails.propertyName}\n` +
                   `Amount: ${paymentDetails.currency} ${paymentDetails.amount}\n` +
                   `Transaction ID: ${paymentDetails.transactionId}\n` +
                   `Date: ${paymentDetails.date.toLocaleDateString()}`;

    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    } else {
      window.location.href = `mailto:?subject=Payment Confirmation&body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your payment is now in escrow and will be released according to the agreed terms.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium">{paymentDetails.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium">
                {paymentDetails.currency} {paymentDetails.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{paymentDetails.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {paymentDetails.date.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reference</span>
              <span className="font-medium">{paymentDetails.reference}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadReceipt}
              className="w-full py-3 px-4 bg-celadon text-white rounded-lg 
                       hover:bg-opacity-90 flex items-center justify-center gap-2"
            >
              <FaDownload />
              Download Receipt
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="py-3 px-4 bg-green-500 text-white rounded-lg 
                         hover:bg-opacity-90 flex items-center justify-center gap-2"
              >
                <FaWhatsapp />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('email')}
                className="py-3 px-4 bg-blue-500 text-white rounded-lg 
                         hover:bg-opacity-90 flex items-center justify-center gap-2"
              >
                <FaEnvelope />
                Email
              </button>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg 
                       hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;