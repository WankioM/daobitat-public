import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import AuthService from '../../services/authService';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../NewContexts/UserContext';

interface GoogleSignUpProps {
  role: string;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const GoogleSignUp: React.FC<GoogleSignUpProps> = ({ role, setError, setIsLoading }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login successful');
        setIsLoading(true);
        setError(null);

        if (!role) {
          setError('Please select a role first');
          setIsLoading(false);
          return;
        }

        console.log('Getting user info from Google...');
        const userInfo = await AuthService.getGoogleUserInfo(tokenResponse.access_token);
        console.log('User info retrieved:', userInfo);

        console.log('Sending signup request to backend...');
        const response = await api.post('/auth/google/signup', {
          token: tokenResponse.access_token,
          role
        });
        console.log('Backend response:', response.data);

        // Store token and user data
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Update user context
        setUser(response.data.data.user);
        
        navigate('/');

      } catch (err: any) {
        console.error('Signup error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to sign up');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google sign-up failed. Please try again.');
      setIsLoading(false);
    },
    flow: 'implicit'
  });

  return (
    <motion.button
      onClick={() => handleGoogleLogin()}
      className="w-full bg-[#b7e3cc] text-[#24191E] rounded-xl py-3 font-[Helvetica-Regular]
                hover:bg-[#a5d1b9] transition-colors duration-300 flex items-center justify-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <FaGoogle />
      <span>Sign up with Google</span>
    </motion.button>
  );
};

export default GoogleSignUp;