import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaPhone, FaWallet, FaChevronDown } from 'react-icons/fa';
import GoogleSignUp from './GoogleSignUp';
import PhoneSignUp from './PhoneSignUp';
import WalletSignUp from './WalletSignUp';
import { SignUpForm, AuthMethod, AuthMethodOption } from '../../types/auth';

const authMethods: AuthMethodOption[] = [
  { id: 'email', icon: <FaGoogle />, label: 'Google' },
  //{ id: 'phone', icon: <FaPhone />, label: 'Phone' },
  { id: 'wallet', icon: <FaWallet />, label: 'Wallet' }
];

const SignUpContainer: React.FC = () => {
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
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

  const handleMethodChange = (method: AuthMethod) => {
    setActiveMethod(method);
    setError(null);
  };

  const handlePhoneSignUp = async () => {
    try {
      if (!form.phone || !form.role) {
        setError('Phone number and role are required');
        return;
      }
      setError('Phone sign-up coming soon!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleWalletSignUp = async () => {
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
    <div className="min-h-screen bg-[#24191E] flex items-center justify-center px-4 py-12">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#b7e3cc]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#e49ab0]/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-[#24191E]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8
                    shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)]">
          <h2 className="font-[Helvetica-Regular] text-[#b7e3cc] text-3xl font-bold text-center mb-8">
            Create Account
          </h2>

          {/* Auth Method Selector */}
          <div className="flex gap-2 mb-8">
            {authMethods.map((method) => (
              <motion.button
                key={method.id}
                onClick={() => handleMethodChange(method.id)}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2
                         ${activeMethod === method.id 
                           ? 'bg-[#b7e3cc] text-[#24191E]' 
                           : 'bg-white/5 text-white/80'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {method.icon}
                <span className="font-[Helvetica-Regular]">{method.label}</span>
              </motion.button>
            ))}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
            >
              <p className="text-red-400 text-sm text-center font-[Helvetica Light-Regular]">{error}</p>
            </motion.div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-[#b7e3cc] mb-2 font-[Helvetica-Regular]">Role</label>
            <div className="relative">
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4
                         text-white appearance-none font-[Helvetica Light-Regular]
                         focus:outline-none focus:border-[#b7e3cc]/50"
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="lister">Property Lister</option>
                <option value="agent">Agent</option>
                <option value="buyer">Buyer</option>
                <option value="renter">Renter</option>
              </select>
            </div>
          </div>

          {/* Render active signup method component */}
          {activeMethod === 'email' && (
            <GoogleSignUp
              role={form.role}
              setError={setError}
              setIsLoading={setIsLoading}
            />
          )}
          {/* {activeMethod === 'phone' && (
            <PhoneSignUp
              form={form}
              handleChange={handleChange}
              handlePhoneSignUp={handlePhoneSignUp}
            />
          )}
             */}
          {activeMethod === 'wallet' && (
            <WalletSignUp
            form={form}
            handleChange={handleChange}
            handleWalletSignUp={handleWalletSignUp}
            setError={setError}
            setIsLoading={setIsLoading}
          />
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center mt-4">
              <svg className="animate-spin h-5 w-5 text-[#b7e3cc]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-white/60 font-[Helvetica Light-Regular]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#b7e3cc] hover:underline font-[Helvetica-Regular]"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpContainer;