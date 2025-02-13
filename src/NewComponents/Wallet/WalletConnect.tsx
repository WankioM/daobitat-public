import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../NewContexts/UserContext';
import WalletSelector from './WalletSelector';
import { SignUpForm } from '../../types/auth';
import api from '../../services/api';


interface WalletConnectProps {
  mode: 'signin' | 'signup';
  form?: SignUpForm;
  onSuccess?: (walletAddress: string) => void;
  onError?: (error: string) => void;
  setIsLoading?: (loading: boolean) => void;
}

interface WalletProvider {
  id: string;
  name: string;
  connect: () => Promise<string>;
  isInstalled: () => boolean;
  getProvider: () => any;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  mode,
  form,
  onSuccess,
  onError,
  setIsLoading = () => {}
}) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  const walletProviders: Record<string, WalletProvider> = {
    metamask: {
      id: 'metamask',
      name: 'MetaMask',
      isInstalled: () => typeof window.ethereum !== 'undefined',
      getProvider: () => window.ethereum,
      connect: async () => {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask to continue');
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      }
    },
    rainbow: {
      id: 'rainbow',
      name: 'Rainbow',
      isInstalled: () => typeof window.ethereum !== 'undefined',
      getProvider: () => window.ethereum,
      connect: async () => {
        if (!window.ethereum) {
          throw new Error('Please install Rainbow Wallet to continue');
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      }
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    try {
      setIsLoading(true);
      const provider = walletProviders[walletId];
      
      if (!provider) {
        throw new Error('Unsupported wallet');
      }

      if (!provider.isInstalled()) {
        throw new Error(`Please install ${provider.name} to continue`);
      }

      const walletAddress = await provider.connect();
      console.log('Connected wallet address:', walletAddress);

      if (mode === 'signup') {
        if (!form) {
          throw new Error('Form data is required for signup');
        }

        const response = await api.post('/auth/wallet/signup', {
          ...form,
          walletAddress
        });

        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        navigate('/');
      } else {
        const response = await api.post('/auth/wallet/signin', {
          walletAddress
        });

        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        navigate('/');
      }

      setIsWalletSelectorOpen(false);
      onSuccess?.(walletAddress);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      const errorMessage = err.message || 'Failed to connect wallet';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletSelector
      isOpen={isWalletSelectorOpen}
      onClose={() => setIsWalletSelectorOpen(false)}
      onSelectWallet={handleWalletSelect}
    />
  );
};

export default WalletConnect;
