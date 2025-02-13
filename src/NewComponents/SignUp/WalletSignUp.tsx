import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignUpForm } from '../../types/auth';
import { FaWallet, FaInfoCircle } from 'react-icons/fa';
import WalletSignUpInfo from '../Docs/WalletSignUpInfo';
import WalletSelector from '../Wallet/WalletSelector';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { walletService } from '../../services/walletService';

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
  const [showInfo, setShowInfo] = useState(false);

  const handleWalletSelect = async (walletId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const walletAddress = await walletService.connectWallet(walletId);
      console.log('Wallet successfully connected with address:', walletAddress);

      // Update form with wallet address
      handleChange({
        target: {
          name: 'walletAddress',
          value: walletAddress
        }
      } as React.ChangeEvent<HTMLInputElement>);

      setShowWalletModal(false);
    } catch (err: any) {
      console.error('Detailed wallet connection error:', err);
      if (err.code === 4001) {
        setError('User rejected the connection request');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/auth/wallet/signup', form);

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      setUser(response.data.data.user);
      navigate('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaInfoCircle size={20} />
        </motion.button>
      </div>

      {showInfo && (
        <WalletSignUpInfo 
          isOpen={showInfo} 
          onClose={() => setShowInfo(false)}
        />
      )}

      <motion.button
        onClick={() => setShowWalletModal(true)}
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
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />

      {/* Name Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-helvetica-regular">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#24191E]"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-gray-700 mb-2 font-helvetica-regular">Role</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange({
              target: { name: 'role', value: 'lister' }
            } as React.ChangeEvent<HTMLInputElement>)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              form.role === 'lister'
                ? 'border-[#24191E] bg-[#24191E] text-white'
                : 'border-gray-300 hover:border-[#24191E]'
            }`}
          >
            Lister
          </button>
          <button
            type="button"
            onClick={() => handleChange({
              target: { name: 'role', value: 'renter' }
            } as React.ChangeEvent<HTMLInputElement>)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              form.role === 'renter'
                ? 'border-[#24191E] bg-[#24191E] text-white'
                : 'border-gray-300 hover:border-[#24191E]'
            }`}
          >
            Renter
          </button>
        </div>
      </div>

      {/* Submit Button - Only shown when wallet is connected */}
      {form.walletAddress && (
        <motion.button
          onClick={handleSubmit}
          className="w-full bg-[#24191E] text-white rounded-xl py-3
                   font-helvetica-regular hover:bg-[#3A2D33] transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Sign Up
        </motion.button>
      )}
    </div>
  );
};

export default WalletSignUp;