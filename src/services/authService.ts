// services/authService.ts
import api from './api';
import { SignUpForm, AuthResponse } from '../types/auth';

interface GoogleUserPayload {
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
  // Google Auth Methods
  static async getGoogleUserInfo(accessToken: string): Promise<GoogleUserPayload> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const data = await response.json();
      
      if (!data.email) {
        throw new Error('Invalid user info');
      }

      return {
        email: data.email,
        name: data.name || '',
        picture: data.picture
      };
    } catch (error) {
      console.error('Google user info error:', error);
      throw error;
    }
  }

  static async googleSignUp(token: string, role: SignUpForm['role']): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google/signup', { token, role });
    return response.data;
  }

  static async googleSignIn(token: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google/signin', { token });
    return response.data;
  }

  // Email Auth Methods
  static async emailSignUp(data: Pick<SignUpForm, 'name' | 'email' | 'password' | 'role'>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  }

  static async emailSignIn(data: Pick<SignUpForm, 'email' | 'password'>): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', data);

      if (response.data.status !== 'success' || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      const { token } = response.data.data;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Authentication failed');
      }
      throw error;
    }
  }

  // Wallet Auth Methods
  static async walletSignUp(data: Pick<SignUpForm, 'walletAddress' | 'name' | 'role'>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/wallet/signup', data);
    return response.data;
  }

  static async walletSignIn(data: Pick<SignUpForm, 'walletAddress'>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/wallet/signin', data);
    return response.data;
  }
}