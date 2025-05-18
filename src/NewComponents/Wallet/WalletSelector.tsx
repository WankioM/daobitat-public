import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
}

// More compact wallet list with proper icons and using Coinbase as first option
const wallets = [
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/assets/wallets/coinbase.svg', // Update with your actual path
    description: 'Connect to your Coinbase Wallet',
    color: 'bg-blue-500'
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/assets/wallets/metamask.svg',
    description: 'Connect to your MetaMask Wallet',
    color: 'bg-orange-500'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '/assets/wallets/rainbow.svg',
    description: 'Connect to your Rainbow Wallet',
    color: 'bg-purple-500'
  }
  // Keeping the list shorter to fit viewport better
];

const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose, onSelectWallet }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle background click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-4 text-gray-600 text-sm">
          <p>Connect your wallet to verify ownership of your properties and documents on the blockchain.</p>
        </div>

        {/* Wallet List - more compact */}
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onSelectWallet(wallet.id)}
              className="w-full flex items-center p-3 rounded-lg border border-gray-200 bg-white hover:border-desertclay hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-desertclay transition-all"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${wallet.color} mr-3`}>
                {/* Use text fallback if image is not available */}
                {wallet.id === 'coinbase' && <span className="text-xl">🪙</span>}
                {wallet.id === 'metamask' && <span className="text-xl">🦊</span>}
                {wallet.id === 'rainbow' && <span className="text-xl">🌈</span>}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                <p className="text-xs text-gray-500">Connect to your {wallet.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Benefits section - more compact */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside ml-1">
            <li>Verify ownership of your properties on-chain</li>
            <li>Secure your documents with blockchain verification</li>
            <li>Easily prove authenticity to potential buyers/renters</li>
          </ul>
          <p className="mt-3 text-center text-xs text-gray-500">
            By connecting a wallet, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletSelector;