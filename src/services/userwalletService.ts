// src/services/walletService.ts
import api from './api';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

// Types
interface WalletConnection {
  address: string;
  connected: boolean;
}

interface WalletVerification {
  user: {
    _id: string;
    walletAddress: string;
    isVerified: boolean;
  };
}

class WalletService {
  private sdk: any;
  private provider: any;
  private ethereum: any;
  
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
   */
  async connect(): Promise<WalletConnection> {
    try {
      // First try connecting via backend service
      const response = await api.post('/api/wallet/connect');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error('Backend connection failed, trying direct connection');
    } catch (error) {
      console.warn('Backend wallet connection failed, trying direct browser connection');
      
      if (!this.ethereum) {
        throw new Error('Wallet provider not initialized');
      }
      
      try {
        // Direct browser connection as fallback
        const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts available');
        }
        
        const address = accounts[0];
        
        // Switch to Base if not already on it
        await this.switchToBaseNetwork();
        
        return {
          address,
          connected: true
        };
      } catch (walletError: any) {
        console.error('Error connecting to wallet:', walletError);
        throw new Error(walletError.message || 'Failed to connect wallet');
      }
    }
  }
  
  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    try {
      // Try backend first
      await api.post('/api/wallet/disconnect');
    } catch (error) {
      console.warn('Backend wallet disconnect failed, trying direct browser disconnect');
      
      // Fall back to direct disconnect if available
      if (this.ethereum && this.ethereum.close) {
        await this.ethereum.close();
      } else if (this.ethereum && this.ethereum.disconnect) {
        await this.ethereum.disconnect();
      }
    }
  }
  
  /**
   * Get wallet connection status
   */
  async getStatus(): Promise<WalletConnection> {
    try {
      const response = await api.get('/api/wallet/status');
      return response.data.data;
    } catch (error) {
      // Fall back to browser check
      const connected = this.ethereum && this.ethereum.isConnected && this.ethereum.isConnected();
      const address = this.ethereum && this.ethereum.selectedAddress;
      
      return {
        address: address || null,
        connected: !!connected
      };
    }
  }
  
  /**
   * Get a user's wallet address
   */
  async getUserWallet(userId: string): Promise<{ walletAddress: string | null; isVerified: boolean }> {
    const response = await api.get(`/api/wallet/${userId}`);
    return response.data.data;
  }
  
  /**
   * Update a user's wallet address
   */
  async updateWallet(userId: string, walletAddress: string): Promise<WalletVerification> {
    const response = await api.patch(`/api/wallet/${userId}`, { walletAddress });
    return response.data.data;
  }
  
  /**
   * Sign a message to verify wallet ownership
   */
  async signMessage(message: string): Promise<string> {
    try {
      // Try backend first
      const response = await api.post('/api/wallet/sign', { message });
      return response.data.data.signature;
    } catch (error) {
      console.warn('Backend signing failed, trying direct browser signing');
      
      if (!this.ethereum) {
        throw new Error('Wallet provider not initialized');
      }
      
      const from = this.ethereum.selectedAddress;
      if (!from) {
        throw new Error('No wallet connected');
      }
      
      // Use personal_sign for compatibility
      const signature = await this.ethereum.request({
        method: 'personal_sign',
        params: [message, from]
      });
      
      return signature;
    }
  }
  
  /**
   * Verify wallet ownership with a signature
   */
  async verifyWallet(userId: string, signature: string, message: string): Promise<WalletVerification> {
    const response = await api.post(`/api/wallet/${userId}/verify`, { signature, message });
    return response.data.data;
  }
  
  /**
   * Get wallet balance
   */
  async getBalance(): Promise<string> {
    try {
      // Try backend first
      const response = await api.get('/api/wallet/balance');
      return response.data.data.balance;
    } catch (error) {
      console.warn('Backend balance check failed, trying direct browser balance check');
      
      if (!this.provider || !this.ethereum) {
        throw new Error('Wallet provider not initialized');
      }
      
      const address = this.ethereum.selectedAddress;
      if (!address) {
        throw new Error('No wallet connected');
      }
      
      // Get balance using ethers
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
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
  
  /**
   * Send a transaction
   */
  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.provider || !this.ethereum) {
      throw new Error('Wallet provider not initialized');
    }
    
    const from = this.ethereum.selectedAddress;
    if (!from) {
      throw new Error('No wallet connected');
    }
    
    // Convert ether to wei
    const value = ethers.parseEther(amount);
    
    try {
      // Get signer
      const signer = await this.provider.getSigner();
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to,
        value
      });
      
      // Wait for transaction to be mined
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }
}

export const walletService = new WalletService();
export default walletService;