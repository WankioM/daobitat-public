
import React from 'react';

const HowPaymentsWork: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-graphite mb-6">How Payments Will Work</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <p className="text-xl text-gray-700 mb-6 font-medium italic">
          "Think of it like a digital lockbox. When you send money, it's held safely by code — not a person — until both sides agree the deal is done."
        </p>
        
        {/* Step-by-step process illustration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Step 1 */}
          <div className="bg-rustyred/5 p-4 rounded-lg relative">
            <div className="w-10 h-10 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mb-4">1</div>
            <h4 className="text-graphite font-semibold mb-2">Buyer Funds Escrow</h4>
            <p className="text-sm text-gray-600">Money is securely locked in a smart contract</p>
            
            {/* Arrow for desktop */}
            <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4A4947" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="bg-rustyred/5 p-4 rounded-lg relative">
            <div className="w-10 h-10 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mb-4">2</div>
            <h4 className="text-graphite font-semibold mb-2">Property Verified</h4>
            <p className="text-sm text-gray-600">Confirmation of property details and ownership</p>
            
            {/* Arrow for desktop */}
            <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4A4947" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="bg-rustyred/5 p-4 rounded-lg relative">
            <div className="w-10 h-10 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mb-4">3</div>
            <h4 className="text-graphite font-semibold mb-2">Both Parties Approve</h4>
            <p className="text-sm text-gray-600">Digital signatures confirm the transaction</p>
            
            {/* Arrow for desktop */}
            <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4A4947" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="bg-rustyred/5 p-4 rounded-lg">
            <div className="w-10 h-10 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mb-4">4</div>
            <h4 className="text-graphite font-semibold mb-2">Funds Released & Recorded</h4>
            <p className="text-sm text-gray-600">Transfer completes automatically</p>
          </div>
        </div>
        
        {/* Key Benefits Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-graphite mb-4">Key Benefits</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>No more "trusting" the other person to pay or deliver</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Your money only moves when everyone plays fair</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Transactions happen automatically, no middlemen stalling things</span>
            </li>
          </ul>
        </div>
        
        {/* Coming Soon Features */}
        <div className="bg-lightstone/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-graphite mb-4">Coming Soon</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.933 12.8a1 1 0 000-1.6l-5-3A1 1 0 005 9v6a1 1 0 001.6.8l5-3zm9 0a1 1 0 000-1.6l-5-3A1 1 0 0014 9v6a1 1 0 001.6.8l5-3z" />
              </svg>
              <span>Earn passive income while your money is in escrow (staking)</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Real-time analytics and transaction tracking</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Embedded multi-signature security for large transactions</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Smart Contract Info Box */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-graphite">Smart Contract Integration</h3>
            <p className="text-gray-600">The RentalEscrow smart contract has been deployed and is ready for integration.</p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-mono text-gray-700">Contract Address:</span>
            <span className="text-sm font-mono">0x5942c3c250ddeaacd69d1ab7ccd81c261cf15204</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm">
          Our development team is currently finalizing the integration between our frontend application and the deployed smart contracts. Once complete, you'll be able to make secure payments through the blockchain.
        </p>
      </div>
    </div>
  );
};

export default HowPaymentsWork;