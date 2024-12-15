import React from 'react';

interface LoanCardProps {
  earnings: number;
  totalBilled: number;
  feesAndTaxes: number;
  loanName: string;
  assetLien: string;
  interestRate: number;
  openDate: string;
  maturityDate: string;
  terms: string;
  balanceAmount: number;
  jobName: string;
  feesDetails: string;
}

const LoanCard: React.FC<LoanCardProps> = ({
  earnings,
  totalBilled,
  feesAndTaxes,
  loanName,
  assetLien,
  interestRate,
  openDate,
  maturityDate,
  terms,
  balanceAmount,
  jobName,
  feesDetails
}) => {
  const handlePaymentMethodClick = () => {
    // Implement payment method logic here
    console.log('Payment method button clicked');
  };

  return (
    <div className="flex flex-col max-w-[600px] p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Earnings and Billed Amount */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-[#333]">${earnings.toFixed(2)}</p>
          <p className="text-gray-500">Loan Details</p>
        </div>
        <div>
          <span role="img" aria-label="money" className="text-4xl">
            🪙
          </span>
        </div>
      </div>

      {/* Billed and Fees Section */}
      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <div className="flex justify-between text-gray-700">
          <p>Initial Loan Amount:</p>
          <p className="font-bold">${totalBilled.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Interest Rate:</p>
          <p className="font-bold">{interestRate}%</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Open date:</p>
          <p className="font-bold">{openDate}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Maturity Date:</p>
          <p className="font-bold">{maturityDate}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Repayment period:</p>
          <p className="font-bold">{terms}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Balance amount:</p>
          <p className="font-bold">${balanceAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="text-sm text-gray-600 mb-4">
        <p className="font-bold">Loan Lien reference</p>
        <p>{assetLien}</p>
        <p className="text-xs mt-2 text-gray-500">{feesDetails}</p>
      </div>

      {/* Payment Method Button */}
      <button
        onClick={handlePaymentMethodClick}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Make Payment
      </button>
    </div>
  );
};

export default LoanCard;