import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
}

const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect to your MetaMask Wallet',
    color: 'bg-orange-500'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '🌈',
    description: 'Connect to your Rainbow Wallet',
    color: 'bg-purple-500'
  },
  {
    id: 'braavos',
    name: 'Braavos',
    icon: '🛡️',
    description: 'Connect to your Braavos Wallet',
    color: 'bg-blue-500'
  },
  {
    id: 'argent',
    name: 'Argent',
    icon: '⚡',
    description: 'Connect to your Argent Wallet',
    color: 'bg-pink-500'
  }
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
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wallet List */}
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onSelectWallet(wallet.id)}
              className="w-full transform rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${wallet.color}`}>
                  <span className="text-2xl">{wallet.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                  <p className="text-sm text-gray-500">{wallet.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer - Optional */}
        <div className="mt-6 text-center text-sm text-gray-500">
          By connecting a wallet, you agree to our Terms of Service
        </div>
      </div>
    </div>
  );
};

export default WalletSelector;