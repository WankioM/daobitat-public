import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignUpForm } from '../../types/auth';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaUser, FaInfoCircle } from 'react-icons/fa';
import WalletSignUpInfo from '../Docs/WalletSignUpInfo';
import WalletSelector from '../Wallet/WalletSelector';

interface WalletSignUpProps {
  form: SignUpForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const WalletSignUp: React.FC<WalletSignUpProps> = ({ 
  form, 
  handleChange, 
  setError,
  setIsLoading 
}) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleWalletSelect = async (walletId: string) => {
    try {
      setIsWalletConnecting(true);
      setIsLoading(true);
      setError(null);

      let provider;
      let walletAddress;

      switch (walletId) {
        case 'metamask':
          if (!window.ethereum) {
            setError('Please install MetaMask to continue');
            return;
          }
          provider = window.ethereum;
          const accounts = await provider.request({ 
            method: 'eth_requestAccounts' 
          });
          walletAddress = accounts[0];
          break;
          
        case 'rainbow':
          // Rainbow wallet integration
          setError('Rainbow wallet integration coming soon');
          return;
          
        case 'braavos':
          if (!window.starknet) {
            setError('Please install Braavos wallet to continue');
            return;
          }
          await window.starknet.enable();
          walletAddress = window.starknet.selectedAddress;
          break;
          
        case 'argent':
          if (!window.starknet) {
            setError('Please install Argent X wallet to continue');
            return;
          }
          await window.starknet.enable();
          walletAddress = window.starknet.selectedAddress;
          break;
          
        default:
          setError('Unsupported wallet');
          return;
      }

      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }

      // Update form with wallet address
      handleChange({
        target: {
          name: 'walletAddress',
          value: walletAddress
        }
      } as React.ChangeEvent<HTMLInputElement>);

      setShowWalletModal(false);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      if (err.code === 4001) {
        setError('User rejected the connection request');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setIsWalletConnecting(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.walletAddress || !form.name || !form.role) {
        setError('Wallet address, username, and role are required');
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await api.post('/auth/wallet/signup', {
        walletAddress: form.walletAddress,
        name: form.name,
        role: form.role
      });

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      setUser(response.data.data.user);
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up with wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Username Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-helvetica-regular">Username</label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-11
                     text-gray-900 placeholder-gray-400 font-helvetica-light
                     focus:outline-none focus:border-[#24191E]"
            placeholder="Choose a username"
            required
          />
        </div>
      </div>

      {/* Wallet Address Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-helvetica-regular">Wallet Address</label>
        <div className="relative">
          <FaWallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="walletAddress"
            value={form.walletAddress}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-11
                     text-gray-900 placeholder-gray-400 font-helvetica-light
                     focus:outline-none focus:border-[#24191E]"
            placeholder="Connect wallet to get address"
            required
            readOnly
          />
        </div>
      </div>

      {/* Info Button */}
      <button
        onClick={() => setShowInfo(true)}
        className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
      >
        <FaInfoCircle />
        <span>Important Information About Wallet Signup</span>
      </button>

      {/* Connect Wallet Button */}
      <motion.button
        onClick={() => setShowWalletModal(true)}
        className="w-full bg-white text-[#24191E] rounded-xl py-3 mt-6
                 border-2 border-[#24191E] font-helvetica-regular
                 hover:bg-[#24191E] hover:text-white transition-colors
                 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <FaWallet />
        <span>Connect Wallet</span>
      </motion.button>

      {/* Submit Button - Only shown when wallet is connected */}
      {form.walletAddress && (
        <motion.button
          onClick={handleSubmit}
          className="w-full bg-[#24191E] text-white rounded-xl py-3 mt-4 
                   font-helvetica-regular hover:bg-opacity-90"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Sign Up
        </motion.button>
      )}

      {/* Wallet Selection Modal */}
      <WalletSelector
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />

      {/* Info Modal */}
      <WalletSignUpInfo 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
      />
    </div>
  );
};

export default WalletSignUp;