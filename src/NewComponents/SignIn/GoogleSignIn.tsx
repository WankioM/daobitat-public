import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {AuthService} from '../../services/authService';
import api from '../../services/api';
import { useUser } from '../../NewContexts/UserContext';

interface GoogleSignInProps {
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ setError, setIsLoading }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError(null);

        const userInfo = await AuthService.getGoogleUserInfo(tokenResponse.access_token);
        
        const response = await api.post('/auth/google/signin', {
          token: tokenResponse.access_token
        });

        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        
        navigate('/');
      } catch (err: any) {
        console.error('Sign in error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to sign in');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    },
    flow: 'implicit'
  });

  return (
    <motion.button
      onClick={() => handleGoogleLogin()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full bg-white hover:bg-gray-50 text-[#2c3e50] rounded-xl p-4 
               flex items-center justify-center gap-3 transition-colors 
               border border-gray-200 font-helvetica-regular"
    >
      <FaGoogle className="text-[#4285f4]" />
      <span>Continue with Google</span>
    </motion.button>
  );
};

export default GoogleSignIn;