import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaWallet, FaChevronDown, FaLongArrowAltRight } from 'react-icons/fa';
import { SignUpForm, AuthMethod, WalletAddress, UserRole } from '../../types/auth';
import api from '../../services/api';
import WalletSelector from '../Wallet/WalletSelector';
import { useUser } from '../../NewContexts/UserContext';
import PhoneSignUp from './PhoneSignUp';
import GoogleSignUp from './GoogleSignUp';

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    walletAddress: undefined,
    role: '' as UserRole,
    phone: undefined
  });
  
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('email');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      if (!form.name || !form.email || !form.password) {
        setError('Please fill in all required fields');
        return;
      }

      if (!form.role) {
        setError('Please select your role');
        return;
      }

      console.log('Attempting email signup with data:', { 
        name: form.name, 
        email: form.email, 
        role: form.role 
      });

      const response = await api.post('/auth/email/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      console.log('Signup response received:', response.data);

      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Detailed signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    try {
      console.log('Starting wallet connection process for:', walletId);
      setIsLoading(true);
      setError(null);

      if (!form.role) {
        setError('Please select your role before connecting wallet');
        setIsLoading(false);
        return;
      }

      let walletAddress: WalletAddress | undefined;

      switch (walletId) {
        case 'metamask':
          console.log('Attempting to connect MetaMask...');
          if (!window.ethereum) {
            setError('Please install MetaMask to continue');
            return;
          }
          console.log('Requesting MetaMask accounts...');
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          console.log('MetaMask accounts received:', accounts);
          walletAddress = accounts[0] as WalletAddress;
          break;
          
        case 'rainbow':
          console.log('Rainbow wallet connection attempted');
          setError('Rainbow wallet integration coming soon');
          return;
          
        case 'braavos':
          console.log('Attempting to connect Braavos...');
          if (!window.starknet) {
            setError('Please install Braavos wallet to continue');
            return;
          }
          console.log('Enabling Braavos wallet...');
          await window.starknet.enable();
          walletAddress = window.starknet.selectedAddress as WalletAddress;
          console.log('Braavos wallet address:', walletAddress);
          break;
          
        case 'argent':
          console.log('Attempting to connect Argent X...');
          if (!window.starknet) {
            setError('Please install Argent X wallet to continue');
            return;
          }
          console.log('Enabling Argent X wallet...');
          await window.starknet.enable();
          walletAddress = window.starknet.selectedAddress as WalletAddress;
          console.log('Argent X wallet address:', walletAddress);
          break;
          
        default:
          setError('Unsupported wallet');
          return;
      }

      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }

      console.log('Setting wallet address in form:', walletAddress);
      
      // Create the updated form data
      const updatedForm = {
        ...form,
        walletAddress
      };
      
      // Update the form state
      setForm(updatedForm);
      setShowWalletModal(false);
      setActiveMethod('wallet');

      // Use the updated data directly instead of relying on state
      try {
        setIsLoading(true);
        setError(null);

        console.log('Attempting wallet signup with:', {
          walletAddress: updatedForm.walletAddress,
          name: updatedForm.name || '',
          role: updatedForm.role
        });

        const response = await api.post('/auth/wallet/signup', {
          walletAddress: updatedForm.walletAddress,
          name: updatedForm.name || '',
          role: updatedForm.role
        });

        console.log('Signup response:', response.data);

        if (!response.data?.data?.token || !response.data?.data?.user) {
          throw new Error('Invalid response from server');
        }

        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        
        // Navigate based on role
        if (updatedForm.role === 'lister') {
          navigate('/listerdashboard');
        } else if (updatedForm.role === 'agent') {
          navigate('/agentdashboard');
        } else if (updatedForm.role === 'buyer') {
          navigate('/buyerdashboard');
        } else {
          navigate('/');
        }
      } catch (err: any) {
        console.error('Wallet signup error:', err);
        setError(err.response?.data?.message || 'Failed to sign up with wallet');
      }

    } catch (err: any) {
      console.error('Wallet connection error:', err);
      if (err.code === 4001) {
        setError('User rejected the connection request');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSignUp = async () => {
    try {
      if (!form.walletAddress || !form.role) {
        setError('Wallet address and role are required');
        return;
      }

      setIsLoading(true);
      setError(null);

      console.log('Attempting wallet signup with:', {
        walletAddress: form.walletAddress,
        name: form.name || '',  
        role: form.role
      });

      const response = await api.post('/auth/wallet/signup', {
        walletAddress: form.walletAddress,
        name: form.name || '',  
        role: form.role
      });

      console.log('Signup response:', response.data);

      if (!response.data?.data?.token || !response.data?.data?.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      setUser(response.data.data.user);
      
      // Show success message
      setError(null);
      
      // Navigate based on role
      if (form.role === 'lister') {
        navigate('/listerdashboard');
      } else if (form.role === 'agent') {
        navigate('/agentdashboard');
      } else if (form.role === 'buyer') {
        navigate('/buyerdashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Wallet signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up with wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignUp = async () => {
    // Phone sign up logic will be handled in PhoneSignUp component
    try {
      setIsLoading(true);
      // Implementation details in PhoneSignUp component
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with phone');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Section - Sign Up Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join our community today
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-gray-700">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           appearance-none focus:outline-none focus:border-[#24191E]"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="lister">Property Lister</option>
                  <option value="agent">Agent</option>
                  <option value="buyer">Buyer</option>
                  <option value="renter">Renter</option>
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Auth Methods */}
            <div className="space-y-4 ">
            <div className="flex space-x-4">

              {/* Google Sign Up */}
              <GoogleSignUp 
                role={form.role}
                setError={setError}
                setIsLoading={setIsLoading}
              />


              {/* Wallet Sign Up */}
              <motion.button
                onClick={() => setShowWalletModal(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white border border-gray-200 text-gray-700 
                         rounded-xl p-4 flex items-center justify-center gap-3 
                         hover:bg-gray-50 transition-colors"
              >
                <FaWallet />
                <span>Continue with Wallet</span>
              </motion.button>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                
                <div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full border border-gray-200 rounded-xl p-4 
                             placeholder-gray-400 focus:outline-none focus:border-[#24191E]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border border-gray-200 rounded-xl p-4 
                             placeholder-gray-400 focus:outline-none focus:border-[#24191E]"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="w-full bg-[#24191E] text-white rounded-xl p-4 
                           flex items-center justify-center gap-3
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                  {!isLoading && <FaLongArrowAltRight />}
                </motion.button>
              </form>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#24191E] hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#24191E] via-[#24191E]/60 to-[#24191E]/40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-white text-4xl font-light leading-tight">
                Welcome to DAO-Bitat
              </h2>
              <p className="text-white/80 text-lg font-light">
                Join our decentralized property marketplace. Buy, sell, and manage real estate assets with the power of blockchain technology.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      <WalletSelector
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </div>
  );
};

export default SignUp;