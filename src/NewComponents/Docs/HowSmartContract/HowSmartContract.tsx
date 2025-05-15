import React, { useState } from 'react';
import { Check, Shield, AlertTriangle, ArrowRight, ArrowLeft, Lock, FileText, Scale } from 'lucide-react';

// Define the Clock component at the top to avoid the "used before defined" error
const Clock = ({size = 24, className}: {size?: number, className?: string}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
};

const HowSmartContractsWork = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeSidebarItem, setActiveSidebarItem] = useState(0);
  
  // Pages content
  const pages = [
    // Introduction page
    {
      id: 'intro',
      title: 'Smart Contracts',
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-milk leading-tight">Revolutionizing Real Estate with Smart Contracts</h1>
          <p className="text-lg text-milk/80">
            At DAO-Bitat, we're leveraging blockchain technology to transform how property transactions work.
            Smart contracts provide security, transparency, and efficiency that traditional methods can't match.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-graphite/60 border border-lightstone/10 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold text-rustyred mb-3">Property Verification</h3>
              <p className="text-milk/70">Immutable records of property ownership verified on the blockchain, ensuring authenticity and preventing fraud.</p>
              <button 
                onClick={() => setCurrentPage(1)} 
                className="mt-4 inline-flex items-center text-rustyred hover:text-rustyred/80 transition-colors duration-300"
              >
                Learn more <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="bg-graphite/60 border border-lightstone/10 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold text-rustyred mb-3">Rental Escrow</h3>
              <p className="text-milk/70">Secure payment system that protects both tenants and landlords throughout the rental process.</p>
              <button 
                onClick={() => setCurrentPage(2)} 
                className="mt-4 inline-flex items-center text-rustyred hover:text-rustyred/80 transition-colors duration-300"
              >
                Learn more <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-graphite/40 rounded-xl border border-lightstone/10">
            <h3 className="text-xl font-semibold text-rustyred mb-3">Why Smart Contracts?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Eliminate intermediaries, reducing costs and delays</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Automate trust with code that executes exactly as written</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Create permanent, immutable records of all transactions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Protect against the 1-in-5 real estate transactions that are fraudulent</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    
    // Property Verification page
    {
      id: 'property-verification',
      title: 'Property Verification',
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-milk leading-tight">Property Verification Smart Contract</h1>
          <p className="text-lg text-milk/80">
            Our property verification system uses blockchain technology to create an immutable record of property 
            ownership and details, ensuring that what you see is what you get.
          </p>
          
          <div className="bg-graphite/60 border border-lightstone/10 p-6 rounded-xl shadow-md mt-6">
            <h3 className="text-xl font-semibold text-rustyred mb-3">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-rustyred/10 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 text-rustyred">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-milk">Property Registration</h4>
                  <p className="text-milk/60">Property owners register their properties on the blockchain with essential details.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-rustyred/10 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 text-rustyred">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-milk">Verification Process</h4>
                  <p className="text-milk/60">Trusted verifiers confirm property details and ownership.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-rustyred/10 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 text-rustyred">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-milk">On-Chain Verification</h4>
                  <p className="text-milk/60">Once verified, the property receives a verification status on the blockchain.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-rustyred/10 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 text-rustyred">
                  <span className="font-medium">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-milk">History Tracking</h4>
                  <p className="text-milk/60">All updates and ownership transfers are permanently recorded.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-graphite/40 p-6 rounded-xl border border-lightstone/10 mt-6">
            <h3 className="text-xl font-semibold text-rustyred mb-3">Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Eliminate property fraud - verify true ownership before transactions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Transparent history of all previous owners and property updates</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Immutable records that can't be altered or deleted</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                <span className="text-milk/80">Integration with rental escrow for seamless property transactions</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-graphite/40 p-6 rounded-xl border border-lightstone/10 mt-6">
            <h3 className="text-xl font-semibold text-rustyred mb-3">Contract Address</h3>
            <p className="font-mono bg-graphite/80 p-3 rounded text-sm break-all text-milk/80 border border-lightstone/10">
              0x46AEcA1b0804FbE7D8722E09E774AB163D4b0Da5
            </p>
            <p className="mt-2 text-sm text-milk/60">
              You can view all transactions related to property verification on the blockchain explorer.
            </p>
          </div>
        </div>
      )
    },
    
    // Rental Escrow page
    {
      id: 'rental-escrow',
      title: 'Rental Escrow',
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-milk leading-tight">Rental Escrow Smart Contract</h1>
          <p className="text-lg text-milk/80">
            Our rental escrow system protects both landlords and tenants by automating the rental process with
            secure, transparent smart contracts.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="md:w-1/3">
              <div className="bg-graphite/60 border border-lightstone/10 rounded-xl p-4">
                <h2 className="text-xl font-semibold text-rustyred mb-4">Navigation</h2>
                <button
                  className={`w-full text-left p-4 rounded-lg transition ${activeSidebarItem === 0 ? "bg-rustyred/10 text-rustyred" : "bg-graphite/40 hover:bg-graphite/30"}`}
                  onClick={() => setActiveSidebarItem(0)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">User Guidelines</span>
                    {activeSidebarItem === 0 && <ArrowRight size={16} />}
                  </div>
                </button>
                <button
                  className={`w-full text-left p-4 rounded-lg transition ${activeSidebarItem === 1 ? "bg-rustyred/10 text-rustyred" : "bg-graphite/40 hover:bg-graphite/30"}`}
                  onClick={() => setActiveSidebarItem(1)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">How the Smart Contract Works</span>
                    {activeSidebarItem === 1 && <ArrowRight size={16} />}
                  </div>
                </button>
                <button
                  className={`w-full text-left p-4 rounded-lg transition ${activeSidebarItem === 2 ? "bg-rustyred/10 text-rustyred" : "bg-graphite/40 hover:bg-graphite/30"}`}
                  onClick={() => setActiveSidebarItem(2)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Legal Framework</span>
                    {activeSidebarItem === 2 && <ArrowRight size={16} />}
                  </div>
                </button>
              </div>
            </div>
            
            <div className="md:w-2/3">
              {activeSidebarItem === 0 && (
                <div className="bg-graphite/60 border border-lightstone/10 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <Shield className="text-rustyred mr-2" />
                    <h2 className="text-2xl font-semibold text-milk">User Guidelines</h2>
                  </div>
                  <p className="mb-4 text-milk">
                    <strong>Your quick guide to using smart contracts safely on DAO-Bitat.</strong>
                  </p>
                  
                  <h3 className="font-semibold text-lg mb-2 flex items-center text-rustyred">
                    <Lock className="text-rustyred h-5 w-5 mr-2" /> Must-Haves (User Responsibilities):
                  </h3>
                  <ul className="space-y-2 mb-6 text-milk/80">
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <Lock size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Protect your access:</span> Your wallet = your key. Keep your private key, passphrase, or code safe. Losing it means losing control of your agreement.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <Clock size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Be timely:</span> If you delay rent or ignore verification steps, the smart contract won't wait—it'll execute based on the timeline you agreed to.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <FileText size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Know the terms:</span> Once the contract is live, it's binding. Understand what you're signing on-chain.
                      </div>
                    </li>
                  </ul>
                  
                  <div className="bg-rustyred/10 p-4 rounded-lg border border-rustyred/20">
                    <h3 className="font-semibold text-lg flex items-center mb-2 text-rustyred">
                      <AlertTriangle className="mr-2" /> Warnings:
                    </h3>
                    <ul className="space-y-2 text-milk/80">
                      <li>
                        DAO-Bitat <strong className="text-milk">can't reverse</strong> transactions outside of what's in the contract. If you send funds manually or share your wallet keys, we can't help.
                      </li>
                      <li>
                        Escrow works <em>only</em> if both parties use it. Bypass it, and you're back to the wild west.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeSidebarItem === 1 && (
                <div className="bg-graphite/60 border border-lightstone/10 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <FileText className="text-rustyred mr-2" />
                    <h2 className="text-2xl font-semibold text-milk">How the Smart Contract Works</h2>
                  </div>
                  <p className="mb-4 text-milk">
                    <strong>Not just code—it's a neutral third party that can't be bribed or bullied.</strong>
                  </p>
                  <p className="mb-6 text-milk/80">
                    Our escrow smart contract automates the rental process with clear logic and transparent execution:
                  </p>
                  
                  <h3 className="font-semibold text-lg mb-2 text-rustyred">
                    🧩 Smart Contract Features:
                  </h3>
                  <ul className="space-y-2 mb-6 text-milk/80">
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <Lock size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Rent locking:</span> Funds are held until predefined rental conditions are met (e.g., move-in confirmed, no disputes raised).
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <Clock size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Automated triggers:</span> Rent is released monthly based on timestamps, not moods.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <Shield size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Deposit management:</span> Deposits are held until the end of the lease, then automatically released unless a damage claim is submitted and verified.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <AlertTriangle size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Dispute flagging:</span> Either party can trigger a dispute flow, pausing payouts until resolution (via a community arbiter or DAO panel).
                      </div>
                    </li>
                  </ul>
                  
                  <h3 className="font-semibold text-lg mb-2 text-rustyred">
                    🔎 On-Chain Transparency:
                  </h3>
                  <ul className="space-y-2 mb-6 text-milk/80">
                    <li className="flex items-start">
                      <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                      <span>Anyone (including regulators) can audit the contract logic and transaction history.</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                      <span>No backdoors. No admin overrides. Just code that runs exactly as written.</span>
                    </li>
                  </ul>
                  
                  <div className="bg-graphite/40 p-4 rounded-lg mt-6 border border-lightstone/10">
                    <h3 className="font-semibold text-lg mb-2 text-rustyred">Contract Address</h3>
                    <p className="font-mono bg-graphite/80 p-3 rounded text-sm break-all text-milk/80 border border-lightstone/10">
                      0x5942c3c250ddeaacd69d1ab7ccd81c261cf15204
                    </p>
                  </div>
                </div>
              )}
              
              {activeSidebarItem === 2 && (
                <div className="bg-graphite/60 border border-lightstone/10 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <Scale className="text-rustyred mr-2" />
                    <h2 className="text-2xl font-semibold text-milk">How This Fits Into Kenyan Law</h2>
                  </div>
                  <p className="mb-4 text-milk">
                    <strong>We blend smart contracts with legal enforceability.</strong>
                  </p>
                  <p className="mb-6 text-milk/80">
                    While Kenya doesn't yet have a full framework for blockchain contracts, DAO-Bitat bridges the gap by aligning with existing tenancy principles.
                  </p>
                  
                  <h3 className="font-semibold text-lg mb-2 text-rustyred">
                    ⚖️ Legal Safeguards:
                  </h3>
                  <ul className="space-y-2 mb-6 text-milk/80">
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <FileText size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Smart contracts mirror legal terms:</span> Rental conditions coded in the contract match those in standard tenancy agreements.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <Check size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Proof of agreement:</span> Blockchain records serve as digital evidence in court—immutable timestamps and actions logged on-chain.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-rustyred/10 rounded-full p-1 mr-2 mt-1">
                        <FileText size={14} className="text-rustyred" />
                      </div>
                      <div>
                        <span className="font-medium text-milk">Dispute support:</span> We provide downloadable legal templates aligned with Kenyan rental law to complement the on-chain agreement.
                      </div>
                    </li>
                  </ul>
                  
                  <h3 className="font-semibold text-lg mb-2 text-rustyred">
                    🧑‍💼 Backed by Legal Advisors:
                  </h3>
                  <ul className="space-y-2 mb-6 text-milk/80">
                    <li className="flex items-start">
                      <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                      <span>We work with Kenyan property lawyers to ensure escrow contracts are compliant with tenant/landlord law under the Landlord and Tenant Act.</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={20} className="text-rustyred mr-2 mt-1 flex-shrink-0" />
                      <span>Where needed, DAO-Bitat offers legal support documents to aid in mediation or legal proceedings.</span>
                    </li>
                  </ul>
                  
                  <div className="bg-graphite/40 p-4 rounded-lg mt-6 flex border border-lightstone/10">
                    <div className="mr-4 text-rustyred">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-rustyred">Legal Resources Available</h4>
                      <p className="text-sm text-milk/80">Download our template rental agreement that combines smart contract terms with legally enforceable language.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="min-h-screen bg-graphite text-milk">
      {/* Header with navigation */}
      <header className="bg-graphite border-b border-lightstone/10 text-milk p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-rustyred"><path d="M2 22h20"></path><path d="M18 8V6a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2"></path><path d="M10 8v2h4V8"></path><rect x="4" y="8" width="16" height="14" rx="1"></rect></svg>
            <h1 className="text-xl font-bold">DAO-Bitat</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-rustyred">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-rustyred">Properties</a>
              </li>
              <li>
                <a href="#" className="font-medium text-rustyred">How It Works</a>
              </li>
              <li>
                <a href="#" className="hover:text-rustyred">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Breadcrumb navigation */}
      <div className="bg-graphite/60 border-b border-lightstone/10">
        <div className="container mx-auto py-2 px-4">
          <div className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-milk/50 hover:text-rustyred">Home</a>
            <span className="text-milk/30">/</span>
            <span className="text-rustyred font-medium">How Smart Contracts Work</span>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <div className="bg-graphite/60 border border-lightstone/10 rounded-xl shadow-sm p-4 sticky top-4">
              <h2 className="font-bold text-lg mb-4 text-rustyred">Navigation</h2>
              <ul className="space-y-2">
                {pages.map((page, index) => (
                  <li key={page.id}>
                    <button
                      onClick={() => setCurrentPage(index)}
                      className={`w-full text-left p-2 rounded ${currentPage === index ? 'bg-rustyred/10 text-rustyred font-medium' : 'hover:bg-graphite/40'}`}
                    >
                      {page.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Content area */}
          <div className="md:col-span-3">
            <div className="bg-graphite/60 border border-lightstone/10 rounded-xl shadow-sm p-6">
              {pages[currentPage].content}
              
              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  className={`flex items-center px-4 py-2 rounded ${currentPage > 0 ? 'bg-rustyred/10 text-rustyred hover:bg-rustyred/20' : 'bg-graphite/40 text-milk/40 cursor-not-allowed'}`}
                  disabled={currentPage === 0}
                >
                  <ArrowLeft size={16} className="mr-1" /> Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                  className={`flex items-center px-4 py-2 rounded ${currentPage < pages.length - 1 ? 'bg-rustyred/10 text-rustyred hover:bg-rustyred/20' : 'bg-graphite/40 text-milk/40 cursor-not-allowed'}`}
                  disabled={currentPage === pages.length - 1}
                >
                  Next <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-graphite/80 text-milk py-8 border-t border-lightstone/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-rustyred">DAO-Bitat</h3>
              <p className="text-milk/70">
                Revolutionizing real estate transactions with blockchain technology for a secure, transparent, and efficient ecosystem.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-rustyred">Smart Contracts</h3>
              <ul className="space-y-2 text-milk/70">
                <li><a href="#" className="hover:text-rustyred">Property Verification</a></li>
                <li><a href="#" className="hover:text-rustyred">Rental Escrow</a></li>
                <li><a href="#" className="hover:text-rustyred">Dispute Resolution</a></li>
                <li><a href="#" className="hover:text-rustyred">Technical Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-rustyred">Contact Us</h3>
              <ul className="space-y-2 text-milk/70">
                <li>Nairobi, Kenya</li>
                <li>info@daobitat.io</li>
                <li>+254 700 123 456</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-lightstone/10 mt-8 pt-4 text-center text-milk/50 text-sm">
            <p>© 2025 DAO-Bitat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowSmartContractsWork;