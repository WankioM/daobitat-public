import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignUpForm } from '../../types/auth';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaUser, FaInfoCircle } from 'react-icons/fa';
import WalletSignUpInfo from '../Docs/WalletSignUpInfo';
import ChooseWallet from '../PaymentFlow/PaymentMethods/ChooseWallet';
import { WalletType } from '../PaymentFlow/PaymentMethods/Wallets/walletTypes';

interface WalletSignUpProps {
  form: SignUpForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWalletSignUp: () => Promise<void>;
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

  const handleWalletSelect = async (walletType: WalletType) => {
    try {
      setIsWalletConnecting(true);
      setIsLoading(true);
      setError(null);

      // Here you would implement the wallet connection logic
      // This would depend on your wallet connection implementation
      let walletAddress;
      
      if (walletType === 'metamask') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        walletAddress = accounts[0];
      } else if (window.starknet) {
        await window.starknet.enable();
        walletAddress = window.starknet.selectedAddress;
      }

      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }

      // Update the form with the wallet address
      handleChange({
        target: {
          name: 'walletAddress',
          value: walletAddress
        }
      } as React.ChangeEvent<HTMLInputElement>);

      setShowWalletModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
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
        <label className="block text-[#b7e3cc] mb-2 font-[Helvetica-Regular]">Username</label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-11
                     text-white placeholder-white/40 font-[Helvetica Light-Regular]
                     focus:outline-none focus:border-[#b7e3cc]/50"
            placeholder="Choose a username (can be anonymous)"
            required
          />
        </div>
      </div>

      {/* Wallet Address Input */}
      <div>
        <label className="block text-[#b7e3cc] mb-2 font-[Helvetica-Regular]">Wallet Address</label>
        <div className="relative">
          <FaWallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            name="walletAddress"
            value={form.walletAddress}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-11
                     text-white placeholder-white/40 font-[Helvetica Light-Regular]
                     focus:outline-none focus:border-[#b7e3cc]/50"
            placeholder="Connect wallet to get address"
            required
            readOnly
          />
        </div>
      </div>

      {/* Info Button */}
      <button
        onClick={() => setShowInfo(true)}
        className="text-black hover:text-[#a5d1b9] flex items-center gap-2 mb-4"
      >
        <FaInfoCircle />
        <span>Important Information About Wallet Signup</span>
      </button>

      {/* Connect Wallet Button */}
      <motion.button
        onClick={() => setShowWalletModal(true)}
        className="w-full bg-[#b7e3cc] text-[#24191E] rounded-xl py-3 mt-6 font-[Helvetica-Regular]
                 hover:bg-[#a5d1b9] transition-colors duration-300 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaWallet />
        <span>Connect Wallet</span>
      </motion.button>

      {/* Submit Button - Only shown when wallet is connected */}
      {form.walletAddress && (
        <motion.button
          onClick={handleSubmit}
          className="w-full bg-[#24191E] text-white rounded-xl py-3 mt-4 font-[Helvetica-Regular]
                   hover:bg-opacity-90 transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign Up
        </motion.button>
      )}

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <ChooseWallet
          onWalletSelect={handleWalletSelect}
          onClose={() => setShowWalletModal(false)}
          isConnecting={isWalletConnecting}
        />
      )}

      {/* Info Modal */}
      <WalletSignUpInfo 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
      />
    </div>
  );
};

export default WalletSignUp;