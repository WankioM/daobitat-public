
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HowPaymentsWork from './HowPaymentsWork';
import HowOwnershipChanges from './HowOwnershipChanges';
import HowWeSafeguard from './HowWeSafeguard';

type FeatureTab = 'Payments' | 'Ownership' | 'Security' | null;

const PlotInDev: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureTab>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    if (activeFeature) {
      setActiveFeature(null);
    } else {
      navigate('/dashboard', { state: { activeTab: 'Properties' } });
    }
  };

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'Payments':
        return <HowPaymentsWork />;
      case 'Ownership':
        return <HowOwnershipChanges />;
      case 'Security':
        return <HowWeSafeguard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-milk">
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center text-rustyred hover:text-rustyred/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {activeFeature ? 'Back to features' : 'Back to dashboard'}
        </button>

        {activeFeature ? (
          renderFeatureContent()
        ) : (
          <>
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-graphite mb-4">
                Payments & Ownership Transfer: Coming On-Chain Soon
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're building secure, automated property payments powered by blockchain. 
                Until then, here's how it'll work — and why it's going to be better than 
                anything you've used before.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 - How Payments Work */}
              <div 
                onClick={() => setActiveFeature('Payments')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-graphite mb-2">How Payments Will Work</h3>
                  <p className="text-gray-500 mb-4">
                    Secure digital escrow, automatic payments, and transparent tracking—all without middlemen.
                  </p>
                  <span className="text-rustyred font-medium flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 2 - How Ownership Changes */}
              <div 
                onClick={() => setActiveFeature('Ownership')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-graphite mb-2">How Ownership Changes Happen</h3>
                  <p className="text-gray-500 mb-4">
                    Digital property deeds that update automatically when all conditions are met.
                  </p>
                  <span className="text-rustyred font-medium flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 3 - How We Keep You Safe */}
              <div 
                onClick={() => setActiveFeature('Security')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-graphite mb-2">How We Keep You Safe</h3>
                  <p className="text-gray-500 mb-4">
                    Built-in verification, fraud prevention, and compliance for peace of mind.
                  </p>
                  <span className="text-rustyred font-medium flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlotInDev;