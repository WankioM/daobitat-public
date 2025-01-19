import { WalletConfig } from '../walletTypes';

export const MetaMaskConfig: WalletConfig = {
  type: 'metamask',
  name: 'MetaMask',
  icon: '/images/metamask-icon.png',
  description: 'Connect using MetaMask wallet',
  
  isInstalled: () => {
    return typeof window.ethereum !== 'undefined';
  },
  
  connect: async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      return accounts[0];
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw error;
    }
  },
  
  disconnect: async () => {
    // MetaMask doesn't have a disconnect method
    return Promise.resolve();
  }
};

