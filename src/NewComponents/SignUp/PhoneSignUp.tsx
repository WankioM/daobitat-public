import React, { useState, useEffect } from 'react';
import { FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SignUpForm } from '../../types/auth';
import { phoneAuthService } from '../../services/phoneAuthService';
import type { RecaptchaVerifier } from 'firebase/auth';

interface PhoneSignUpProps {
  form: SignUpForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneSignUp: () => Promise<void>;
}

const PhoneSignUp: React.FC<PhoneSignUpProps> = ({ form, handleChange }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      if (!recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }
      
      await phoneAuthService.sendOTP(form.phone, recaptchaVerifier);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Handle error (show toast/alert)
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const response = await phoneAuthService.verifyOTPAndSignUp(
        otp,
        form.name,
        form.role
      );
      
      // Handle successful signup
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect or update UI state
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Handle error (show toast/alert)
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
          value={form.phone}
          onChange={handleChange}
          disabled={otpSent}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-11
                   text-white placeholder-white/40 font-[Helvetica Light-Regular]
                   focus:outline-none focus:border-[#b7e3cc]/50"
          placeholder="Enter your phone number"
          required
        />
      </div>
      
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