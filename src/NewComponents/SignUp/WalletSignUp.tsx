import React , {useState} from 'react';
import { motion } from 'framer-motion';
import { SignUpForm } from '../../types/auth';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaUser, FaInfoCircle } from 'react-icons/fa';
import WalletSignUpInfo from '../Docs/WalletSignUpInfo';

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
  const [isMetaMaskConnecting, setIsMetaMaskConnecting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
        name: form.name,  // Using existing name field
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
            name="name"  // Using existing name field
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
            placeholder="Enter your wallet address"
            required
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

      {/* Info Modal */}
      <WalletSignUpInfo 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
      />


      <motion.button
        onClick={handleSubmit}
        className="w-full bg-[#b7e3cc] text-[#24191E] rounded-xl py-3 mt-6 font-[Helvetica-Regular]
                 hover:bg-[#a5d1b9] transition-colors duration-300 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaWallet />
        <span>Sign up with Metamask</span>
      </motion.button>
    </div>
  );
};

export default WalletSignUp;