import React from 'react';
import ConnectWallet from './ConnectWallet'; 
import ConnectBaseSmartWallet from './ConnectSmartWallet'; 
import './ConnectWallet.css'

interface ConnectYourWalletProps {
  // You can add props here if needed in the future
}

const ConnectYourWallet: React.FC<ConnectYourWalletProps> = () => {
  return (
    <div className='parentwallet'>
      <h2> Connect Your Wallet </h2>
      <h3>Connect with one of our available data providers</h3>
    <div className="connectdiv">
      <ConnectWallet />
      <ConnectBaseSmartWallet />
    </div>
    </div>
  );
};

export default ConnectYourWallet;