import React from 'react';
import { FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';

interface WalletSignInProps {
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const WalletSignIn: React.FC<WalletSignInProps> = ({ setError, setIsLoading }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleWalletSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError('Please install MetaMask to continue');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
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
    <motion.button
      onClick={handleWalletSignIn}
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
  );
};

export default WalletSignIn;