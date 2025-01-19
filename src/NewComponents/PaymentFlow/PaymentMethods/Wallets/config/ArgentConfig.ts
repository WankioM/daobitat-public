// frontend/src/NewComponents/PaymentFlow/PaymentMethods/Wallets/config/ArgentConfig.ts
import { connect, disconnect } from 'get-starknet';
import { WalletConfig } from '../walletTypes';

export const ArgentConfig: WalletConfig = {
  type: 'argent',
  name: 'Argent',
  icon: '/images/argent-icon.png',
  description: 'Connect using Argent wallet',
  
  isInstalled: () => {
    // Check if Starknet wallet is available
    return typeof window.starknet !== 'undefined' && 
           // Check if it's Argent by looking at available methods or properties
           window.starknet?.provider?.name === 'argentX';
  },
  
  connect: async () => {
    try {
      const starknet = await connect({
        modalMode: 'alwaysAsk',
        modalTheme: 'light'
      });

      if (!starknet) {
        throw new Error('Failed to connect to Argent wallet');
      }

      await starknet.enable();
      const userAddress = starknet.selectedAddress;

      if (!userAddress) {
        throw new Error('No address found');
      }

      return userAddress;
    } catch (error) {
      console.error('Argent connection error:', error);
      throw error;
    }
  },
  
  disconnect: async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Argent disconnection error:', error);
      throw error;
    }
  }
};