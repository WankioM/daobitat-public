// src/hooks/useWallet.ts
import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/userwalletService';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateWalletAddress: (address: string) => Promise<void>;
}

/**
 * Hook for managing wallet connection and state
 */
export const useWallet = (): UseWalletReturn => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isVerified: false,
    isLoading: false,
    error: null
  });

  // Initialize wallet state from backend on component mount
  useEffect(() => {
    const initWallet = async () => {
      try {
        setWalletState(prev => ({ ...prev, isLoading: true }));
        
        // Get wallet status from backend
        const status = await walletService.getWalletStatus();
        
        setWalletState({
          address: status.address,
          isConnected: status.connected,
          isVerified: !!status.verified,
          isLoading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Error initializing wallet:', error);
        setWalletState({
          address: null,
          isConnected: false,
          isVerified: false,
          isLoading: false,
          error: error.message || 'Failed to initialize wallet'
        });
      }
    };
    
    initWallet();
  }, []);
  
  // Connect to wallet and update backend
  const connect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Connect to wallet (client side)
      const address = await walletService.connect();
      
      if (!address) {
        throw new Error('Failed to connect wallet');
      }
      
      // Update backend with wallet address
      const response = await walletService.updateWalletAddress(address);
      
      setWalletState({
        address,
        isConnected: true,
        isVerified: response.user.isVerified,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  }, []);
  
  // Update wallet address in backend
  const updateWalletAddress = useCallback(async (address: string) => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Update backend with wallet address
      const response = await walletService.updateWalletAddress(address);
      
      setWalletState({
        address,
        isConnected: true,
        isVerified: response.user.isVerified,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error updating wallet address:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update wallet address'
      }));
    }
  }, []);
  
  // Disconnect wallet and clear from backend
  const disconnect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Disconnect wallet and clear from backend
      await walletService.disconnect();
      
      setWalletState({
        address: null,
        isConnected: false,
        isVerified: false,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to disconnect wallet'
      }));
    }
  }, []);
  
  return {
    ...walletState,
    connect,
    disconnect,
    updateWalletAddress
  };
};

export default useWallet;