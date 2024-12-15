// src/services/phoneAuthService.ts
import { 
    RecaptchaVerifier, 
    signInWithPhoneNumber,
    ConfirmationResult 
  } from 'firebase/auth';
  import { auth } from '../config/firebase';
  import api from './api';
  
  let confirmationResult: ConfirmationResult | null = null;
  
  export const phoneAuthService = {
    // Initialize reCAPTCHA verifier
    initRecaptcha: (buttonId: string) => {
      try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        });
        return recaptchaVerifier;
      } catch (error) {
        console.error('Error initializing recaptcha:', error);
        throw error;
      }
    },
  
    // Send OTP
    sendOTP: async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
      try {
        // First check with backend if phone is available
        await api.post('/auth/phone/signup/send-otp', { phoneNumber });
        
        // Then send OTP via Firebase
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return true;
      } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
      }
    },
  
    // Verify OTP and complete signup
    verifyOTPAndSignUp: async (
      code: string,
      name: string,
      role: string
    ) => {
      try {
        if (!confirmationResult) {
          throw new Error('No confirmation result found. Please send OTP first.');
        }
  
        // Verify OTP with Firebase
        const result = await confirmationResult.confirm(code);
        const idToken = await result.user.getIdToken();
        
        // Complete signup with backend
        const response = await api.post('/auth/phone/signup', {
          idToken,
          name,
          role
        });
        
        return response.data;
      } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
      }
    },
  
    // Sign in with phone
    signInWithPhone: async (code: string) => {
      try {
        if (!confirmationResult) {
          throw new Error('No confirmation result found. Please send OTP first.');
        }
  
        // Verify OTP with Firebase
        const result = await confirmationResult.confirm(code);
        const idToken = await result.user.getIdToken();
        
        // Sign in with backend
        const response = await api.post('/auth/phone/signin', { idToken });
        return response.data;
      } catch (error) {
        console.error('Error signing in with phone:', error);
        throw error;
      }
    }
  };