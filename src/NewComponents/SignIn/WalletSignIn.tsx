import React, { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';
import WalletSelector from '../Wallet/WalletSelector';

interface WalletSignInProps {
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const WalletSignIn: React.FC<WalletSignInProps> = ({ setError, setIsLoading }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  const handleWalletSelect = async (walletId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let provider;
      switch (walletId) {
        case 'metamask':
          if (!window.ethereum) {
            setError('Please install MetaMask to continue');
            return;
          }
          provider = window.ethereum;
          break;
        case 'rainbow':
          // Rainbow wallet integration
          setError('Rainbow wallet integration coming soon');
          return;
        case 'braavos':
          // Braavos wallet integration
          setError('Braavos wallet integration coming soon');
          return;
        case 'argent':
          // Argent wallet integration
          setError('Argent wallet integration coming soon');
          return;
        default:
          setError('Unsupported wallet');
          return;
      }

      // Request account access
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const walletAddress = accounts[0];

      // Send sign-in request to backend
      const response = await api.post('/auth/wallet/signin', {
        walletAddress
      });

      // Store auth data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      setUser(response.data.data.user);

      setIsWalletSelectorOpen(false);
      navigate('/');
    } catch (err: any) {
      console.error('Wallet sign in error:', err);
      if (err.code === 4001) {
        setError('User rejected the connection request');
      } else {
        setError(err.response?.data?.message || 'Failed to sign in with wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsWalletSelectorOpen(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-white text-[#24191E] rounded-xl p-4 
                 flex items-center justify-center gap-3 transition-colors 
                 border-2 border-[#24191E] font-helvetica-regular
                 hover:text-white hover:bg-[#24191E]"
      >
        <FaWallet />
        <span>Connect Wallet</span>
      </motion.button>

      <WalletSelector
        isOpen={isWalletSelectorOpen}
        onClose={() => setIsWalletSelectorOpen(false)}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
};

export default WalletSignIn;