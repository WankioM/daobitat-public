import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWallet, FaLongArrowAltRight } from 'react-icons/fa';
import GoogleSignIn from './GoogleSignIn';
import WalletSignIn from './WalletSignIn';

const SignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Section - Sign In Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center pt-20 px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg border border-gray-100 rounded-2xl p-8 sm:p-12 bg-white shadow-sm"
        >
          <div className="space-y-10 mt-10">
            <div className="space-y-2">
              <h2 className="font-helvetica-regular text-[#24191E] text-4xl sm:text-5xl font-bold">
                Welcome back
              </h2>
              <p className="font-helvetica-light text-gray-500 text-base sm:text-lg">
                Please sign in to continue
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

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GoogleSignIn 
                  setError={setError}
                  setIsLoading={setIsLoading}
                />

                <WalletSignIn 
                  setError={setError}
                  setIsLoading={setIsLoading}
                />
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

              <div className="space-y-6">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           text-[#24191E] placeholder-gray-400 font-helvetica-light
                           focus:outline-none focus:border-[#24191E] transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 
                           text-[#24191E] placeholder-gray-400 font-helvetica-light
                           focus:outline-none focus:border-[#24191E] transition-colors"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-gray-600 font-helvetica-light">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span>Remember me</span>
                  </label>
                  <span className="text-gray-500 font-helvetica-light hover:text-[#24191E] cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#24191E] text-white rounded-xl 
                           p-4 flex items-center justify-center gap-2 transition-colors
                           font-helvetica-regular hover:bg-opacity-90"
                >
                  Sign In
                  <FaLongArrowAltRight />
                </motion.button>
              </div>
            </div>

            <div className="text-center">
              
                <button
                  onClick={() => navigate('/signup')}
                  className="text-[#24191E] font-helvetica-regular hover:text-opacity-80"
                >
                  Sign up
                </button>
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Background Image with Overlay and Text */}
      <div className="hidden lg:block w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://storage.googleapis.com/web-vids/roadcover.png)'
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
              <h1 className="text-white font-helvetica-light text-3xl leading-tight">
                Find Your Perfect Home With DAO-Bitat
              </h1>
              <p className="text-white/80 font-helvetica-light text-l">
                Experience the future of real estate with our blockchain-powered platform.
                Seamless, secure, and transparent property transactions await.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;