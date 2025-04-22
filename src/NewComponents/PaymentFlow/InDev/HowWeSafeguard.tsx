import React from 'react';

const HowWeSafeguard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-graphite mb-6">How We Keep You Safe</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <p className="text-xl text-gray-700 mb-8 font-medium italic">
          "Our system doesn't rely on 'trust' — it relies on verified facts."
        </p>
        
        {/* Key Concepts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-graphite mb-6">Verification Layers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Identity Verification */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-3">Identity Verification</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Multi-factor authentication</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Document validation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Digital signature verification</span>
                </li>
              </ul>
            </div>
            
            {/* Property Verification */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-3">Property Verification</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>GPS location confirmation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Land registry cross-check</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ownership history verification</span>
                </li>
              </ul>
            </div>
            
            {/* Transaction Security */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-3">Transaction Security</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Escrow payment protection</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Smart contract automation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Multi-signature approvals</span>
                </li>
              </ul>
            </div>
            
            {/* Legal Compliance */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h4 className="font-semibold text-graphite mb-3">Legal Compliance</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Automated regulatory checks</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Compliant document templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Local authority integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Automation Examples */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-graphite mb-4">Smart Automation in Action</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-graphite mb-1">Automatic Verification</h4>
                  <p className="text-gray-600">
                    "If the location, ID, and registry all match — boom, deal goes through."
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-graphite mb-1">Anomaly Detection</h4>
                  <p className="text-gray-600">
                    "If anything looks off, it's paused automatically for review."
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-rustyred rounded-full text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-graphite mb-1">Smart Dispute Resolution</h4>
                  <p className="text-gray-600">
                    "If there's a disagreement, funds stay secure while trusted arbitrators review."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Peace of Mind Section */}
        <div className="bg-rustyred/10 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-graphite mb-4">Peace of Mind</h3>
          <p className="text-gray-700 mb-4 italic">
            "It's like having a lawyer, land agent, and bank — all working instantly, in sync, with no hidden fees."
          </p>
          
          <div className="flex items-center justify-center p-4">
            <div className="max-w-md">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-graphite font-medium">
                    No fake buyers. No ghost sellers. No last-minute surprises.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-graphite font-medium">
                    Our system doesn't rely on 'trust' — it relies on verified facts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Smart Contract Protection Box */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start mb-6">
          <div className="w-12 h-12 bg-rustyred/10 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-graphite">Smart Contract Protection</h3>
            <p className="text-gray-600">Our blockchain infrastructure provides automated security throughout your transaction.</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-graphite mb-3">Key Safeguards in Our Smart Contracts:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><span className="font-medium">Escrow Protection:</span> Payments are held securely until all conditions are met</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><span className="font-medium">Trusted Arbitrators:</span> Neutral third parties can resolve disputes if needed</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><span className="font-medium">Ownership Verification:</span> Properties must be verified before transactions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-rustyred mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><span className="font-medium">Transparent Actions:</span> Every transaction step is recorded and visible</span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center p-4 bg-lightstone/20 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rustyred mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-graphite">
              While our payment infrastructure is under development, these security measures are already built into our smart contracts and ready for deployment. We're currently finalizing the user interface to make this powerful security accessible to everyone.
            </p>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Banner */}
      <div className="mt-8 border-2 border-dashed border-rustyred/30 rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold text-graphite mb-2">Coming Soon</h3>
        <p className="text-gray-600 mb-4">
          Our team is putting the finishing touches on these security features. Check back soon to experience the full protection of blockchain-powered real estate transactions.
        </p>
        <div className="inline-block bg-rustyred text-white px-4 py-2 rounded-lg font-medium">
          Launching Q2 2025
        </div>
      </div>
    </div>
  );
};

export default HowWeSafeguard;