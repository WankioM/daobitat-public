import React, { useState } from 'react';
import { FaWallet, FaTimes } from 'react-icons/fa';

export type WalletType = 'metamask' | 'braavos' | 'argent';

interface ChooseWalletProps {
  onWalletSelect: (walletType: WalletType) => Promise<void>;
  onClose: () => void;
  isConnecting: boolean;
}

interface WalletOption {
  type: WalletType;
  name: string;
  icon: string;
  description: string;
}

const walletOptions: WalletOption[] = [
  {
    type: 'metamask',
    name: 'MetaMask',
    icon: '/images/metamask-icon.png',
    description: 'Connect using MetaMask wallet'
  },
  {
    type: 'braavos',
    name: 'Braavos',
    icon: '/images/braavos-icon.png',
    description: 'Connect using Braavos wallet'
  },
  {
    type: 'argent',
    name: 'Argent',
    icon: '/images/argent-icon.png',
    description: 'Connect using Argent wallet'
  }
];

const ChooseWallet: React.FC<ChooseWalletProps> = ({
  onWalletSelect,
  onClose,
  isConnecting
}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  const handleWalletClick = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    await onWalletSelect(walletType);
  };

  const isWalletInstalled = (walletType: WalletType): boolean => {
    switch (walletType) {
      case 'metamask':
        return typeof window.ethereum !== 'undefined';
      case 'braavos':
        return typeof window.braavos !== 'undefined';
      case 'argent':
        return typeof window.argent !== 'undefined';
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaWallet className="text-2xl text-celadon" />
            <h3 className="text-xl font-semibold">Choose Wallet</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isConnecting}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.type}
              onClick={() => handleWalletClick(wallet.type)}
              disabled={isConnecting || !isWalletInstalled(wallet.type)}
              className={`w-full p-4 border rounded-lg flex items-center gap-4 transition-colors
                ${selectedWallet === wallet.type ? 'border-celadon bg-celadon/10' : ''}
                ${isConnecting || !isWalletInstalled(wallet.type) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-gray-300'}`}
            >
              <img 
                src={wallet.icon} 
                alt={wallet.name} 
                className="w-10 h-10 rounded-full"
              />
              <div className="text-left">
                <div className="font-medium">{wallet.name}</div>
                <div className="text-sm text-gray-600">
                  {isWalletInstalled(wallet.type) 
                    ? wallet.description
                    : `${wallet.name} not installed`}
                </div>
              </div>
            </button>
          ))}
        </div>

        {isConnecting && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Connecting to wallet...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseWallet;