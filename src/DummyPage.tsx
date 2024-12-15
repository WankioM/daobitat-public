import React from 'react';
import PaymentMethod from './Components/Dashboards/AddProperty/Billing/PaymentMethod';
import LoanCard from './Components/Dashboards/AddProperty/Billing/LoanCard';
import NftsOwned from './Components/Financing/NFTowned';
import PaymentSuccess from './Components/Financing/PaymentSuccess';
import Portfolio from './Components/Financing/Portfolio';
import TopPicks from './Components/Financing/TopPicks';

const loanCardProps = {
  earnings: 5000,
  totalBilled: 50000,
  feesAndTaxes: 500,
  loanName: "Home Loan",
  assetLien: "Property at 123 Main St",
  interestRate: 3.5,
  openDate: "2023-01-01",
  maturityDate: "2053-01-01",
  terms: "30 years",
  balanceAmount: 48000,
  jobName: "Primary Residence Loan",
  feesDetails: "Origination fee: $1000, Appraisal fee: $500"
};
const DummyPage: React.FC = () => {
  return (
    <>
  <div className="p-4">
      <div className="mb-8 pb-8 border-b border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">Loan Card</h2>
        <LoanCard {...loanCardProps} />
      </div>

      <div className="mb-8 pb-8 border-b border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">NFTs Owned</h2>
        <NftsOwned />
      </div>

      <div className="mb-8 pb-8 border-b border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">Payment Success</h2>
        <PaymentSuccess />
      </div>

      <div className="mb-8 pb-8 border-b border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">Portfolio</h2>
        <Portfolio />
      </div>

      <div className="mb-8 pb-8 border-b border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">Top Picks</h2>
        <TopPicks />
      </div>

      <div className="mb-8 pb-8 border-b border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600">Choose Payment Method</h2>
        <PaymentMethod />
      </div>
    </div>
 

    </>
  );
};

export default DummyPage;
