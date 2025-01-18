import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaWallet, FaChevronDown, FaLongArrowAltRight } from 'react-icons/fa';
import GoogleSignUp from './GoogleSignUp';
import WalletSignUp from './WalletSignUp';
import { SignUpForm, AuthMethod, AuthMethodOption } from '../../types/auth';
import api from '../../services/api';


const authMethods: AuthMethodOption[] = [
  { id: 'email', icon: <FaGoogle />, label: 'Google' },
  { id: 'wallet', icon: <FaWallet />, label: 'Wallet' }
];

const SignUp = () => {
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    phone: '',
    walletAddress: '',
    role: ''
  });
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('email');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      if (!form.name || !form.email || !form.password || !form.role) {
        setError('Please fill in all required fields');
        return;
      }

      const response = await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSignUp = async (): Promise<void> => {
    try {
      if (!form.walletAddress || !form.role) {
        setError('Wallet address and role are required');
        return;
      }
      setError('Wallet sign-up coming soon!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Section - Sign Up Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center pt-20 px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg border border-gray-100 rounded-2xl p-8 sm:p-12 bg-white shadow-sm"
        >
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="font-helvetica-regular text-[#24191E] text-4xl sm:text-5xl font-bold">
                Create Account
              </h2>
              <p className="font-helvetica-light text-gray-500 text-base sm:text-lg">
                Join our community today
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <p className="text-red-500 text-sm text-center font-helvetica-light">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-helvetica-regular">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           text-[#24191E] appearance-none font-helvetica-light
                           focus:outline-none focus:border-[#24191E] transition-colors"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="lister">Property Lister</option>
                  <option value="agent">Agent</option>
                  <option value="buyer">Buyer</option>
                  <option value="renter">Renter</option>
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Auth Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeMethod === 'email' && (
                  <GoogleSignUp
                    role={form.role}
                    setError={setError}
                    setIsLoading={setIsLoading}
                  />
                )}
                {activeMethod === 'wallet' && (
                  <WalletSignUp
                    form={form}
                    handleChange={handleChange}
                    handleWalletSignUp={handleWalletSignUp}
                    setError={setError}
                    setIsLoading={setIsLoading}
                  />
                )}
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-6 bg-white text-gray-400 font-helvetica-light">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           text-[#24191E] placeholder-gray-400 font-helvetica-light
                           focus:outline-none focus:border-[#24191E] transition-colors"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           text-[#24191E] placeholder-gray-400 font-helvetica-light
                           focus:outline-none focus:border-[#24191E] transition-colors"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={form.password || ''}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           text-[#24191E] placeholder-gray-400 font-helvetica-light
                           focus:outline-none focus:border-[#24191E] transition-colors"
                  required
                />

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="w-full bg-[#24191E] text-white rounded-xl 
                           p-4 flex items-center justify-center gap-2 transition-colors
                           font-helvetica-regular hover:bg-opacity-90
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                  {!isLoading && <FaLongArrowAltRight />}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setActiveMethod('wallet')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-white border border-gray-200 text-[#24191E] rounded-xl 
                           p-4 flex items-center justify-center gap-2 transition-colors
                           font-helvetica-regular hover:bg-gray-50"
                >
                  <FaWallet />
                  Sign up with Wallet
                </motion.button>
              </form>
            </div>

            <div className="text-center">
              <p className="text-gray-500 font-helvetica-light">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/signin')}
                  className="text-[#24191E] font-helvetica-regular hover:text-opacity-80"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Background Image with Overlay */}
      <div className="hidden lg:block w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://i.pinimg.com/736x/af/04/db/af04db986bd49578b34959da802e79a3.jpg)'
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
              <h1 className="text-white font-helvetica-light text-5xl leading-tight">
                Join DAO-Bitat Today
              </h1>
              <p className="text-white/80 font-helvetica-light text-l">
                Discover a new way to find, list, and manage properties with our innovative blockchain-powered platform.
                Join our growing community of property enthusiasts.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;