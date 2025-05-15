// src/hooks/useWallet.ts
import { useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/userwalletService';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isVerified: boolean;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  verifyWallet: (userId: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export const useWallet = (userId?: string): UseWalletReturn => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isVerified: false,
    balance: null,
    isLoading: false,
    error: null
  });

  // Initialize wallet state on component mount
  useEffect(() => {
    const initWallet = async () => {
      try {
        setWalletState(prev => ({ ...prev, isLoading: true }));
        // Get wallet connection status
        const status = await walletService.getStatus();
        
        if (status.connected && status.address && userId) {
          // If connected and we have a userId, get verification status
          const userWallet = await walletService.getUserWallet(userId);
          
          if (userWallet.walletAddress === status.address) {
            // Get balance if the wallet is verified
            let balance: string | null = null;
            if (userWallet.isVerified) {
              try {
                balance = await walletService.getBalance();
              } catch (error) {
                console.warn('Error getting balance:', error);
              }
            }
            
            setWalletState({
              address: status.address,
              isConnected: true,
              isVerified: userWallet.isVerified,
              balance,
              isLoading: false,
              error: null
            });
          } else {
            // Wallet address doesn't match what's on the user account
            setWalletState({
              address: status.address,
              isConnected: true,
              isVerified: false,
              balance: null,
              isLoading: false,
              error: null
            });
          }
        } else if (status.connected && status.address) {
          // Connected but no userId to check verification
          setWalletState({
            address: status.address,
            isConnected: true,
            isVerified: false,
            balance: null,
            isLoading: false,
            error: null
          });
        } else {
          // Not connected
          setWalletState({
            address: null,
            isConnected: false,
            isVerified: false,
            balance: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error: any) {
        console.error('Error initializing wallet:', error);
        setWalletState({
          address: null,
          isConnected: false,
          isVerified: false,
          balance: null,
          isLoading: false,
          error: error.message || 'Failed to initialize wallet'
        });
      }
    };
    
    initWallet();
  }, [userId]);
  
  // Connect wallet
  const connect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const connection = await walletService.connect();
      
      // If we have a userId, update the user's wallet address
      if (userId && connection.address) {
        try {
          await walletService.updateWallet(userId, connection.address);
        } catch (error: any) {
          console.warn('Error updating user wallet:', error);
          // Continue even if update fails
        }
      }
      
      setWalletState(prev => ({
        ...prev,
        address: connection.address,
        isConnected: connection.connected,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  }, [userId]);
  
  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await walletService.disconnect();
      
      setWalletState({
        address: null,
        isConnected: false,
        isVerified: false,
        balance: null,
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
  
  // Verify wallet ownership
  const verifyWallet = useCallback(async (userId: string) => {
    if (!walletState.address) {
      setWalletState(prev => ({
        ...prev,
        error: 'No wallet connected to verify'
      }));
      return;
    }
    
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Generate a verification message
      const timestamp = Date.now();
      const message = `Verify wallet ownership for DAO-Bitat user ${userId} at ${timestamp}`;
      
      // Sign the message
      const signature = await walletService.signMessage(message);
      
      // Verify the signature on the backend
      const verification = await walletService.verifyWallet(userId, signature, message);
      
      // Get balance now that wallet is verified
      let balance: string | null = null;
      if (verification.user.isVerified) {
        try {
          balance = await walletService.getBalance();
        } catch (balanceError) {
          console.warn('Error getting balance:', balanceError);
        }
      }
      
      setWalletState(prev => ({
        ...prev,
        isVerified: verification.user.isVerified,
        balance,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error verifying wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to verify wallet'
      }));
    }
  }, [walletState.address]);
  
  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!walletState.isConnected || !walletState.isVerified) {
      return;
    }
    
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const balance = await walletService.getBalance();
      
      setWalletState(prev => ({
        ...prev,
        balance,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error refreshing balance:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to refresh balance'
      }));
    }
  }, [walletState.isConnected, walletState.isVerified]);
  
  return {
    ...walletState,
    connect,
    disconnect,
    verifyWallet,
    refreshBalance
  };
};

export default useWallet;