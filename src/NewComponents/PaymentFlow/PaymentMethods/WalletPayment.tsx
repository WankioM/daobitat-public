import React, { useState } from 'react';
import { FaWallet, FaEthereum, FaBitcoin, FaExchangeAlt } from 'react-icons/fa';
import { currencyGroups } from '../../../constants/currencies';
import ChooseWallet from './ChooseWallet';
import { useWallet } from './Wallets/hooks/useWallet';
import { WalletType } from './Wallets/walletTypes';


interface WalletPaymentProps {
  amount: number;
  offerId: string;
  onSuccess: () => void;
}

const WalletPayment: React.FC<WalletPaymentProps> = ({ amount, onSuccess, offerId }) => {
  const [showWalletChooser, setShowWalletChooser] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    type: walletType,
    address,
    connected,
    isConnecting,
    connect,
    disconnect 
  } = useWallet();

  const cryptoCurrencies = [...currencyGroups.crypto, ...currencyGroups.stablecoin];

  const handleWalletSelect = async (walletType: WalletType) => {
    try {
      await connect(walletType);
      setShowWalletChooser(false);
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedCurrency || !connected) return;
    
    setIsProcessing(true);
    try {
      // Add actual payment processing logic here based on wallet type
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrencyIcon = (code: string) => {
    switch (code) {
      case 'ETH':
        return <FaEthereum className="text-2xl" />;
      case 'BTC':
        return <FaBitcoin className="text-2xl" />;
      default:
        return <FaExchangeAlt className="text-2xl" />;
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <FaWallet className="text-3xl text-celadon" />
        <div>
          <h3 className="font-semibold text-lg">Crypto Wallet</h3>
          <p className="text-sm text-gray-600">Pay using your preferred cryptocurrency</p>
        </div>
      </div>

      {/* Wallet Connection Status */}
      {connected && address && (
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="font-medium">
              Connected to {walletType} ({address.slice(0, 6)}...{address.slice(-4)})
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium">Select Payment Currency</h4>
        <div className="grid grid-cols-2 gap-3">
          {cryptoCurrencies.map(currency => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              disabled={!connected}
              className={`p-4 border rounded-lg flex items-center gap-3 transition-colors
                ${selectedCurrency === currency.code 
                  ? 'border-celadon bg-celadon/10' 
                  : 'hover:border-gray-300'}
                ${!connected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {getCurrencyIcon(currency.code)}
              <div className="text-left">
                <div className="font-medium">{currency.code}</div>
                <div className="text-sm text-gray-600">{currency.name}</div>
              </div>
            </button>
          ))}
        </div>

        {!connected ? (
          <button
            onClick={() => setShowWalletChooser(true)}
            className="w-full py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90 
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">{amount} USD</span>
              </div>
              {selectedCurrency && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. {selectedCurrency}</span>
                  <span className="font-medium">≈ {(amount * 0.00025).toFixed(6)}</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedCurrency || isProcessing}
              className="w-full py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        )}
      </div>

      {showWalletChooser && (
        <ChooseWallet
          onWalletSelect={handleWalletSelect}
          onClose={() => setShowWalletChooser(false)}
          isConnecting={isConnecting}
        />
      )}
    </div>
  );
};

export default WalletPayment;