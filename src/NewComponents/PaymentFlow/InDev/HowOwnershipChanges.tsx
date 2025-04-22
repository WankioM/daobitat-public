
import React from 'react';

const HowOwnershipChanges: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-graphite mb-6">How Ownership Changes Happen</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <p className="text-xl text-gray-700 mb-8 font-medium italic">
          "Instead of paper deeds, we use secure digital ones. These update automatically once payment is done and approvals are in."
        </p>
        
        {/* Comparison Table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-graphite mb-4">Old Way vs DAO Way</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional Method */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-semibold text-graphite mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Traditional Way
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Paper deeds that can be lost or damaged</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Manual filing at government offices</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Weeks or months to process changes</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Multiple intermediaries and fees</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Difficult to verify authenticity</span>
                </li>
              </ul>
            </div>
            
            {/* DAO-Bitat Method */}
            <div className="bg-rustyred/10 p-6 rounded-lg">
              <h4 className="font-semibold text-graphite mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                DAO-Bitat Way
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Digital deeds secured by blockchain</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Automated updates when conditions are met</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Transfer completes in minutes, not months</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Direct buyer-seller connection, minimal fees</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Publicly verifiable ownership history</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Key Concepts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-graphite mb-4">Key Concepts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Digital Deed */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-2">Tokenized Deed</h4>
              <p className="text-sm text-gray-600">
                Every property has a unique digital ID on the blockchain that represents ownership rights.
              </p>
            </div>
            
            {/* Public Record */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-2">Public Record</h4>
              <p className="text-sm text-gray-600">
                Your name is recorded directly on the blockchain — publicly verifiable and permanently secure.
              </p>
            </div>
            
            {/* Conditional Transfer */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-2">Conditional Transfer</h4>
              <p className="text-sm text-gray-600">
                Transfers only happen if all rules are followed — payments completed, approvals received, and verification passed.
              </p>
            </div>
          </div>
        </div>
        
        {/* Validation Process */}
        <div className="bg-lightstone/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-graphite mb-4">Validation Process</h3>
          <p className="mb-4 italic">
            "We check with trusted local agents or registries before any change is locked in."
          </p>
          
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 mb-4 md:mb-0 md:mr-6">
              <div className="bg-white p-4 rounded-lg h-full">
                <h4 className="font-semibold text-graphite mb-2">On-Chain Verification</h4>
                <p className="text-sm text-gray-600">
                  Our PropertyVerification smart contract maintains an immutable record of all property details, including ownership history, verification status, and approved changes.
                </p>
                <div className="mt-4">
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                    Contract: 0x46AEcA1b0804FbE7D8722E09E774AB163D4b0Da5
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded-lg h-full">
                <h4 className="font-semibold text-graphite mb-2">Transparent History</h4>
                <p className="text-sm text-gray-600">
                  Anyone can view the complete history of a property — when it was registered, verified by authorities, updated, or transferred between owners.
                </p>
                <div className="mt-4">
                  <span className="text-xs text-rustyred font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Coming soon: Public verification portal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Technical Architecture Preview */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start mb-6">
          <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-graphite">Under Development</h3>
            <p className="text-gray-600">Our engineering team is currently finalizing the ownership transfer system.</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-4">
            The PropertyVerification smart contract is already deployed and will work in tandem with the RentalEscrow contract to enable seamless ownership transfers.
          </p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Smart contract development: <span className="font-medium">Complete</span></span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Interface integration: <span className="font-medium">In Progress</span></span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">User testing: <span className="font-medium">Pending</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowOwnershipChanges;