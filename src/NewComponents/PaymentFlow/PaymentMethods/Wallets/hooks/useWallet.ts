import { useState, useCallback } from 'react';
import { WalletType } from '../../ChooseWallet';
import { getWalletConfig } from '../config';

interface WalletState {
  type: WalletType | null;
  address: string | null;
  connected: boolean;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    type: null,
    address: null,
    connected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (walletType: WalletType) => {
    const config = getWalletConfig(walletType);
    if (!config) {
      throw new Error(`Wallet config not found for type: ${walletType}`);
    }

    setIsConnecting(true);
    try {
      const address = await config.connect();
      setState({
        type: walletType,
        address,
        connected: true
      });
      return address;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!state.type) return;

    const config = getWalletConfig(state.type);
    if (!config) return;

    try {
      await config.disconnect();
      setState({
        type: null,
        address: null,
        connected: false
      });
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      throw error;
    }
  }, [state.type]);

  return {
    ...state,
    isConnecting,
    connect,
    disconnect
  };
};