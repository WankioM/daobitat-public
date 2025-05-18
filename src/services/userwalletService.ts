import api from './api';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

// Types
interface WalletConnection {
  address: string | null;
  connected: boolean;
  verified?: boolean;
}

interface WalletUser {
  _id: string;
  walletAddress: string | null;
  isVerified: boolean;
}

interface WalletResponse {
  user: WalletUser;
}

class WalletService {
  // Make these properties public and read-only to allow controlled access
  public readonly sdk: any;
  public readonly provider: any;
  public readonly ethereum: any;
  
  constructor() {
    // Initialize SDK only in browser environment
    if (typeof window !== 'undefined') {
      try {
        this.sdk = new CoinbaseWalletSDK({
          appName: 'DAO-Bitat',
          appLogoUrl: `${window.location.origin}/logo.png`,
        });
        
        // Set up Ethereum provider (Base Mainnet)
        this.ethereum = this.sdk.makeWeb3Provider('https://mainnet.base.org', 8453);
        
        // Create ethers provider
        this.provider = new ethers.BrowserProvider(this.ethereum);
      } catch (error) {
        console.error('Error initializing wallet service:', error);
      }
    }
  }

  /**
   * Connect to wallet and request accounts
   * This is a client-side only method that doesn't interact with the backend
   */
  async connect(): Promise<string> {
    if (!this.ethereum) {
      throw new Error('Wallet provider not initialized');
    }
    
    try {
      // Request accounts from wallet
      const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts available');
      }
      
      // Return the first account address
      return accounts[0];
    } catch (error: any) {
      // Handle user rejection
      if (error.code === 4001) {
        throw new Error('You rejected the connection request');
      }
      
      console.error('Error connecting wallet:', error);
      throw error; // Rethrow for better error handling
    }
  }
  
  /**
   * Update wallet address on the backend
   * @param walletAddress Wallet address to update
   */
  async updateWalletAddress(walletAddress: string): Promise<WalletResponse> {
    try {
      // Make API call to update wallet address
      const response = await api.patch('/api/wallet/address', { walletAddress });
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating wallet address:', error);
      
      // Check for specific error types
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 && data.message.includes('already linked')) {
          throw new Error('This wallet address is already linked to another account');
        }
        
        if (status === 400 && data.message.includes('Invalid')) {
          throw new Error('Invalid wallet address format');
        }
      }
      
      throw error; // Rethrow for better error handling
    }
  }
  
  /**
   * Clear wallet address in the backend
   */
  async clearWalletAddress(): Promise<WalletResponse> {
    try {
      const response = await api.delete('/api/wallet/address');
      return response.data.data;
    } catch (error: any) {
      console.error('Error clearing wallet address:', error);
      throw error; // Rethrow for better error handling
    }
  }
  
  /**
   * Get wallet connection status from the backend
   */
  async getWalletStatus(): Promise<WalletConnection> {
    try {
      const response = await api.get('/api/wallet/address');
      return response.data.data;
    } catch (error: any) {
      console.error('Error getting wallet status:', error);
      throw error; // Rethrow for better error handling
    }
  }
  
  /**
   * Disconnect wallet (client-side only)
   */
  async disconnect(): Promise<void> {
    try {
      // Clear wallet address in backend first
      await this.clearWalletAddress();
      
      // Then disconnect from wallet provider if possible
      if (this.ethereum && this.ethereum.close) {
        await this.ethereum.close();
      } else if (this.ethereum && this.ethereum.disconnect) {
        await this.ethereum.disconnect();
      }
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      throw error; // Rethrow for better error handling
    }
  }
  
  /**
   * Switch to Base network or add if not present
   */
  async switchToBaseNetwork(): Promise<void> {
    if (!this.ethereum) {
      throw new Error('Wallet provider not initialized');
    }
    
    const BASE_CHAIN_ID = '0x2105'; // 8453 in hex
    
    try {
      // Try to switch to Base
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      });
    } catch (error: any) {
      // If Base is not added to the wallet, add it
      if (error.code === 4902) {
        await this.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_CHAIN_ID,
            chainName: 'Base Mainnet',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org']
          }]
        });
      } else {
        throw error;
      }
    }
  }
}

export const walletService = new WalletService();
export default walletService;