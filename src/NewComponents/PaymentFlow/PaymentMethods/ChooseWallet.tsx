import React, { useState, useEffect } from 'react';
import { FaWallet, FaTimes } from 'react-icons/fa';
import { WalletType } from './Wallets/walletTypes';
import { ArgentConfig } from './Wallets/config/ArgentConfig';
import { BraavosConfig } from './Wallets/config/BraavosConfig';
import { getWalletConfig } from './Wallets/config';
import type { EthereumProvider } from '../../../types/payment';

interface ChooseWalletProps {
  onWalletSelect: (walletType: WalletType) => Promise<void>;
  onClose: () => void;
  isConnecting: boolean;
}

const walletOptions = [
  {
    type: 'metamask' as WalletType,
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png',
    description: 'Connect using MetaMask wallet'
  },
  {
    ...BraavosConfig,
    icon: 'https://play-lh.googleusercontent.com/HUk0fYbBtiJUFO1H_GCYq4p6kPxifsRP5vqHG96ZeK38-hepdPUU0GMprslWvItn3WUj=w240-h480-rw'
  },
  {
    ...ArgentConfig,
    icon: 'https://play-lh.googleusercontent.com/P-xt-cfYUtwVQ3YsNb5yd5_6MzCHmcKAbRkt-up8Ga44x_OCGLy4WFxsGhxfJaSLEw=w240-h480-rw'
  }
];

const ChooseWallet: React.FC<ChooseWalletProps> = ({
  onWalletSelect,
  onClose,
  isConnecting
}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const checkWallets = () => {
      // Force a re-render to update wallet states
      setForceUpdate(prev => prev + 1);
    };

    // Check initially and every 1 second
    const interval = setInterval(checkWallets, 1000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, []);

  const handleWalletClick = async (walletType: WalletType) => {
    try {
      setSelectedWallet(walletType);
      const config = getWalletConfig(walletType);
      
      if (!config) {
        throw new Error(`Configuration not found for ${walletType}`);
      }

      // Use the wallet's configuration to connect
      await onWalletSelect(walletType);
      
    } catch (error) {
      console.error(`Error connecting to ${walletType}:`, error);
      setSelectedWallet(null);
      // Show error to user
      alert(`Failed to connect to ${walletType}. Please try again.`);
    }
  };

  const isWalletInstalled = (walletType: WalletType): boolean => {
    try {
      switch (walletType) {
        case 'metamask':
          return typeof window.ethereum !== 'undefined';
        case 'braavos':
          console.log('Checking Braavos:', {
            starknetExists: !!window.starknet,
            providerName: window.starknet?.provider?.name,
            currentWalletId: window.starknet?.id
          });
          
          return !!window.starknet && (
            window.starknet.provider?.name?.toLowerCase().includes('braavos') ||
            window.starknet.id?.toLowerCase().includes('braavos') ||
            typeof window.starknet_braavos !== 'undefined'
          );
        case 'argent':
          return !!window.starknet && (
            window.starknet.provider?.name?.toLowerCase().includes('argentx') ||
            window.starknet.id?.toLowerCase() === 'argentx'
          );
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error checking ${walletType} installation:`, error);
      return false;
    }
  };

  // Rest of the component remains the same...

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaWallet className="text-2xl text-celadon" />
            <h3 className="text-xl font-semibold">Choose Wallet</h3>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isConnecting}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="space-y-3">
          {walletOptions.map((wallet) => {
            const isInstalled = isWalletInstalled(wallet.type);
            return (
              <div
                key={wallet.type}
                className={`w-full p-4 border rounded-lg flex items-center gap-4 transition-colors
                  ${selectedWallet === wallet.type ? 'border-celadon bg-celadon/10' : ''}
                  ${isConnecting || !isInstalled 
                    ? 'opacity-50' 
                    : 'hover:border-gray-300'}`}
              >
                <button
                  onClick={() => handleWalletClick(wallet.type)}
                  disabled={isConnecting || !isInstalled}
                  className="flex items-center gap-4 w-full"
                >
                  <img 
                    src={wallet.icon} 
                    alt={wallet.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-gray-600">
                      {isInstalled 
                        ? wallet.description
                        : `${wallet.name} not installed`}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
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