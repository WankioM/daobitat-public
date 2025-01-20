import { connect, disconnect } from 'get-starknet';
import { WalletConfig } from '../walletTypes';

export const BraavosConfig: WalletConfig = {
  type: 'braavos',
  name: 'Braavos',
  icon: '/images/braavos-icon.png',
  description: 'Connect using Braavos wallet',
  
  isInstalled: () => {
    try {
      return !!(window.starknet?.isConnected && 
             window.starknet?.provider?.name?.toLowerCase().includes('braavos'));
    } catch {
      return false;
    }
  },
  
  connect: async () => {
    try {
      // First check if already connected
      if (window.starknet?.isConnected && 
          window.starknet?.provider?.name?.toLowerCase().includes('braavos')) {
        await window.starknet.enable();
        return window.starknet.selectedAddress;
      }

      // If not connected, try to connect
      const starknet = await connect({
        modalMode: 'alwaysAsk',
        modalTheme: 'light',
        // Remove walletId as it's not in ConnectOptions type
      });

      if (!starknet) {
        throw new Error('Failed to connect to Braavos wallet');
      }

      // Enable the wallet and get permissions
      await starknet.enable();
      
      if (!starknet.isConnected || 
          !starknet.provider?.name?.toLowerCase().includes('braavos')) {
        throw new Error('Connected wallet is not Braavos');
      }

      const address = starknet.selectedAddress;
      if (!address) {
        throw new Error('No wallet address found');
      }

      return address;

    } catch (error) {
      console.error('Braavos connection error:', error);
      throw error;
    }
  },
  
  disconnect: async () => {
    try {
      if (window.starknet?.isConnected) {
        await disconnect();
      }
    } catch (error) {
      console.error('Braavos disconnection error:', error);
      throw error;
    }
  }
};