import { connect, disconnect } from 'get-starknet';
import { WalletConfig } from '../walletTypes';

export const BraavosConfig: WalletConfig = {
  type: 'braavos',
  name: 'Braavos',
  icon: '/images/braavos-icon.png',
  description: 'Connect using Braavos wallet',
  
  isInstalled: () => {
    // Check if Starknet wallet is available and if it's Braavos
    return typeof window.starknet !== 'undefined' &&
           window.starknet?.provider?.name === 'Braavos';
  },
  
  connect: async () => {
    try {
      const starknet = await connect({
        modalMode: 'alwaysAsk',
        modalTheme: 'light'
      });

      if (!starknet) {
        throw new Error('Failed to connect to Braavos wallet');
      }

      // Verify we're connected to Braavos
      if (starknet.provider.name !== 'Braavos') {
        throw new Error('Selected wallet is not Braavos');
      }

      await starknet.enable();
      const userAddress = starknet.selectedAddress;

      if (!userAddress) {
        throw new Error('No address found');
      }

      return userAddress;
    } catch (error) {
      console.error('Braavos connection error:', error);
      throw error;
    }
  },
  
  disconnect: async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Braavos disconnection error:', error);
      throw error;
    }
  }
};