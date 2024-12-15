import React, { useState } from 'react';
import LoanProcess from '../../Docs/LoanProcess';
import LendProcess from '../../Docs/LendProcess';
import EscrowProcess from '../../Docs/Escrow';
import { motion } from 'framer-motion';

const Financing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'escrow' | 'loan' | 'lend'>('escrow');

  return (
    <div className="min-h-screen bg-[#24191E] -m-8 overflow-hidden">
      {/* Background Gradient Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#b7e3cc]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#e49ab0]/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Header with Tabs */}
      <div className="bg-licorice relative pt-8 px-8 pb-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-6 py-3 rounded-lg font-helvetica text-lg transition-all duration-300
              ${activeTab === 'escrow' 
                ? 'bg-[#b7e3cc] text-[#24191E] shadow-lg' 
                : 'bg-[#24191E] text-[#b7e3cc] border border-[#b7e3cc] hover:bg-[#b7e3cc]/10'}`}
          >
            Escrow Services
          </button>
          <button
            onClick={() => setActiveTab('loan')}
            className={`px-6 py-3 rounded-lg font-helvetica text-lg transition-all duration-300
              ${activeTab === 'loan' 
                ? 'bg-[#b7e3cc] text-[#24191E] shadow-lg' 
                : 'bg-[#24191E] text-[#b7e3cc] border border-[#b7e3cc] hover:bg-[#b7e3cc]/10'}`}
          >
            Get a Loan
          </button>
          <button
            onClick={() => setActiveTab('lend')}
            className={`px-6 py-3 rounded-lg font-helvetica text-lg transition-all duration-300
              ${activeTab === 'lend' 
                ? 'bg-[#b7e3cc] text-[#24191E] shadow-lg' 
                : 'bg-[#24191E] text-[#b7e3cc] border border-[#b7e3cc] hover:bg-[#b7e3cc]/10'}`}
          >
            Lend Money
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'escrow' ? <EscrowProcess /> : 
           activeTab === 'loan' ? <LoanProcess /> : 
           <LendProcess />}
        </motion.div>
      </div>
    </div>
  );
};

export default Financing;