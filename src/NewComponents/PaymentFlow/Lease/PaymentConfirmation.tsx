import React from 'react';

interface PaymentConfirmationProps {
  paymentDetails: {
    amount: number;
    method: string;
    date: string;
    transactionId: string;
    propertyAddress: string;
    leaseStartDate: string;
    leaseEndDate: string;
  };
  onViewLease: () => void;
  onDownloadReceipt: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentDetails,
  onViewLease,
  onDownloadReceipt,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-block p-3 bg-green-100 text-green-600 rounded-full">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">Your payment has been processed successfully.</p>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium">${paymentDetails.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{paymentDetails.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{paymentDetails.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">{paymentDetails.transactionId}</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Property Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Property Address:</span>
            <span className="font-medium">{paymentDetails.propertyAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lease Start Date:</span>
            <span className="font-medium">{paymentDetails.leaseStartDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lease End Date:</span>
            <span className="font-medium">{paymentDetails.leaseEndDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onDownloadReceipt}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Receipt
        </button>
        <button
          onClick={onViewLease}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Lease
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
