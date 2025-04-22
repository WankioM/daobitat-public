// src/components/PaymentFlow/PaymentFlowNavigation.tsx
import React from 'react';
import HowPaymentsWork from './HowPaymentsWork';
import HowOwnershipChanges from './HowOwnershipChanges';
import HowWeSafeguard from './HowWeSafeguard';

type PaymentSection = 'Payments' | 'Ownership' | 'Security';

interface PaymentFlowNavigationProps {
  section: PaymentSection;
  onSectionChange: (section: PaymentSection) => void;
  onBack: () => void;
}

const PaymentFlowNavigation: React.FC<PaymentFlowNavigationProps> = ({
  section,
  onSectionChange,
  onBack
}) => {
  // Helper function to get next and previous sections
  const getNextSection = (): PaymentSection | null => {
    switch (section) {
      case 'Payments': return 'Ownership';
      case 'Ownership': return 'Security';
      case 'Security': return null;
      default: return null;
    }
  };

  const getPrevSection = (): PaymentSection | null => {
    switch (section) {
      case 'Payments': return null;
      case 'Ownership': return 'Payments';
      case 'Security': return 'Ownership';
      default: return null;
    }
  };

  // Get nice display names for sections
  const getSectionDisplayName = (sectionKey: PaymentSection): string => {
    switch (sectionKey) {
      case 'Payments': return 'How Payments Work';
      case 'Ownership': return 'How Ownership Changes';
      case 'Security': return 'How We Keep You Safe';
      default: return '';
    }
  };

  // Content based on current section
  const renderContent = () => {
    switch (section) {
      case 'Payments': return <HowPaymentsWork />;
      case 'Ownership': return <HowOwnershipChanges />;
      case 'Security': return <HowWeSafeguard />;
    }
  };

  const nextSection = getNextSection();
  const prevSection = getPrevSection();

  return (
    <div>
      {/* Navigation Controls at the TOP */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={prevSection ? () => onSectionChange(prevSection) : onBack}
            className="px-4 py-2 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors flex items-center mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevSection ? `Back` : 'Back to Overview'}
          </button>
          
          <h2 className="text-2xl font-bold text-graphite">{getSectionDisplayName(section)}</h2>
        </div>
        
        {nextSection && (
          <button
            onClick={() => onSectionChange(nextSection)}
            className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors flex items-center"
          >
            Next: {getSectionDisplayName(nextSection)}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`flex-1 text-center ${section === 'Payments' ? 'font-bold text-rustyred' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${section === 'Payments' ? 'bg-rustyred text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className="text-sm">Payments</span>
          </div>
          <div className="w-full flex-1 flex items-center">
            <div className={`h-1 w-full ${section === 'Payments' || section === 'Ownership' || section === 'Security' ? 'bg-rustyred' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`flex-1 text-center ${section === 'Ownership' ? 'font-bold text-rustyred' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${section === 'Ownership' || section === 'Security' ? 'bg-rustyred text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className="text-sm">Ownership</span>
          </div>
          <div className="w-full flex-1 flex items-center">
            <div className={`h-1 w-full ${section === 'Security' ? 'bg-rustyred' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`flex-1 text-center ${section === 'Security' ? 'font-bold text-rustyred' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${section === 'Security' ? 'bg-rustyred text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className="text-sm">Security</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      {renderContent()}
      
      {/* Navigation Controls at the BOTTOM too for convenience */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={prevSection ? () => onSectionChange(prevSection) : onBack}
          className="px-4 py-2 bg-lightstone text-graphite rounded-lg hover:bg-lightstone/80 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {prevSection ? `Back to ${getSectionDisplayName(prevSection)}` : 'Back to Overview'}
        </button>
        
        {nextSection && (
          <button
            onClick={() => onSectionChange(nextSection)}
            className="px-4 py-2 bg-rustyred text-white rounded-lg hover:bg-rustyred/90 transition-colors flex items-center"
          >
            Next: {getSectionDisplayName(nextSection)}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentFlowNavigation;