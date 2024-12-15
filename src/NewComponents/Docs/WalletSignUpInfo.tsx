import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface WalletSignUpInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletSignUpInfo: React.FC<WalletSignUpInfoProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-lg w-full relative">
        {/* Improved close button positioning and styling */}
        <div className="absolute -top-4 -right-4">
          <button
            onClick={onClose}
            className="bg-[#b7e3cc] hover:bg-[#a5d1b9] text-black rounded-full p-2 
                     transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Close dialog"
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-[#b7e3cc] mb-6">
            Wallet Signup Information
          </h2>
          <div className="space-y-4 text-white/80">
            <p>
              You can sign up using your wallet address. However, please note that if you decide to 
              borrow in the future, you will be required to complete a full{' '}
              <strong className="text-[#b7e3cc]">KYC (Know Your Customer)</strong> process.
            </p>
            <p>
              This is necessary for credit access, and after completing the KYC, you will no longer 
              be able to remain anonymous on the platform.
            </p>
            <p className="font-semibold text-[#b7e3cc]">
              By proceeding, you acknowledge that you understand this requirement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSignUpInfo;