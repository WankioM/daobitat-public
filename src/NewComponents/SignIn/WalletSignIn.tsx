import React, { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';
import WalletSelector from '../Wallet/WalletSelector';
import { walletService } from '../../services/walletService';

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

      const walletAddress = await walletService.connectWallet(walletId);
      console.log('Connected wallet address:', walletAddress);

      // Send sign-in request to backend
      console.log('Sending sign-in request with wallet:', walletAddress);
      const response = await api.post('/auth/wallet/signin', {
        walletAddress
      });

      console.log('Sign-in response:', response.data);

      if (!response.data?.data?.token || !response.data?.data?.user) {
        throw new Error('Invalid response format - missing token or user data');
      }

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
      } else if (err.message === 'Invalid response format - missing token or user data') {
        setError('Invalid response format - missing token or user data');
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
        Connect Wallet
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