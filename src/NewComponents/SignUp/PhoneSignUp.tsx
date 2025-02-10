import React, { useState, useEffect } from 'react';
import { FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SignUpForm } from '../../types/auth';
import { phoneAuthService } from '../../services/phoneAuthService';
import type { RecaptchaVerifier } from 'firebase/auth';

interface PhoneSignUpProps {
  form: SignUpForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePhoneSignUp: () => Promise<void>;
}

const PhoneSignUp: React.FC<PhoneSignUpProps> = ({ form, handleChange }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize recaptcha when component mounts
    const verifier = phoneAuthService.initRecaptcha('phone-sign-up-button');
    setRecaptchaVerifier(verifier);

    return () => {
      // Clean up recaptcha when component unmounts
      verifier.clear?.();
    };
  }, []);

  const handleSendOTP = async () => {
    try {
      if (!form.phone?.trim()) {
        setError('Please enter a valid phone number');
        return;
      }

      setLoading(true);
      setError(null);
      
      if (!recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }
      
      await phoneAuthService.sendOTP(form.phone.trim(), recaptchaVerifier);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!form.phone?.trim()) {
        setError('Phone number is required');
        return;
      }

      if (!otp.trim()) {
        setError('Please enter the verification code');
        return;
      }

      if (!form.name || !form.role) {
        setError('Name and role are required');
        return;
      }

      setLoading(true);
      setError(null);

      const response = await phoneAuthService.verifyOTPAndSignUp(
        otp.trim(),
        form.name,
        form.role
      );
      
      // Handle successful signup
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect or update UI state
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-[#b7e3cc] mb-2 font-[Helvetica-Regular]">Phone Number</label>
      <div className="relative">
        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
        <input
          type="tel"
          name="phone"
          value={form.phone || ''}
          onChange={handleChange}
          disabled={otpSent}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-11
                   text-white placeholder-white/40 font-[Helvetica Light-Regular]
                   focus:outline-none focus:border-[#b7e3cc]/50"
          placeholder="Enter your phone number"
          required
        />
      </div>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {otpSent && (
        <div className="mt-4">
          <label className="block text-[#b7e3cc] mb-2 font-[Helvetica-Regular]">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4
                     text-white placeholder-white/40 font-[Helvetica Light-Regular]
                     focus:outline-none focus:border-[#b7e3cc]/50"
            placeholder="Enter OTP"
            required
          />
        </div>
      )}

      <motion.button
        id="phone-sign-up-button"
        onClick={otpSent ? handleVerifyOTP : handleSendOTP}
        disabled={loading}
        className="w-full bg-[#b7e3cc] text-[#24191E] rounded-xl py-3 mt-4 font-[Helvetica-Regular]
                 hover:bg-[#a5d1b9] transition-colors duration-300 flex items-center justify-center gap-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        <FaPhone />
        <span>
          {loading 
            ? 'Loading...' 
            : otpSent 
              ? 'Verify OTP' 
              : 'Send Verification Code'}
        </span>
      </motion.button>
    </div>
  );
};

export default PhoneSignUp;