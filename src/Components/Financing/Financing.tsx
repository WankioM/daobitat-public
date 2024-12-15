import React, { useState } from 'react';
import { CSSProperties } from 'react';
import FinancingHeader from './FinancingHeader';
import LoanDetails from './LoanDetails';
import LendDetails from './LendDetails';
import ApprovedRequests from './ApprovedRequests';
import PendingRequests from './PendingRequests';
import Statement from './Statement';



const customStyles: CSSProperties = {
  ['--select-button-svg' as string]: "url('data:image/svg+xml...",
  fontFamily: '"Public Sans", "Noto Sans", sans-serif'
};
const FinancingDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('Borrow');

  const renderContent = () => {
    switch (currentTab) {
      case 'Borrow':
        return <LoanDetails />;
      case 'Lend':
        return <LendDetails />;
      case 'ApprovedRequests':
        return <ApprovedRequests />;
      case 'PendingRequests':
        return <PendingRequests />;
      case 'Statement':
        return <Statement />;
      default:
        return <LoanDetails />;
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#181114] dark group/design-root overflow-x-hidden"
      style={customStyles}
    >
      <FinancingHeader currentTab={currentTab} onTabChange={setCurrentTab} />
      {renderContent()}
    </div>
  );
};

export default FinancingDashboard;
