import api from './api';

interface GoogleUserPayload {
  email: string;
  name: string;
  picture?: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface WalletSignUpData {
  walletAddress: string;
  name: string;
  role: string;
}

interface WalletSignInData {
  walletAddress: string;
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

  static async googleSignUp(token: string, role: string) {
    const response = await api.post('/auth/google/signup', { token, role });
    return response.data;
  }

  static async googleSignIn(token: string) {
    const response = await api.post('/auth/google/signin', { token });
    return response.data;
  }

  // Email Auth Methods
  static async emailSignUp(data: SignUpData) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }

  // Email Auth Methods
  static async emailSignIn(data: SignInData) {
    try {
      console.log('Making sign in request with:', { email: data.email });
      
      const response = await api.post('/auth/signin', data);
      console.log('Raw sign in response:', response);

      // Check for proper response structure
      if (response.data?.status !== 'success' || !response.data?.data) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response from server');
      }

      const { token, user } = response.data.data;

      if (!token || !user) {
        console.error('Missing token or user in response:', response.data);
        throw new Error('Invalid response data');
      }

      // Store the token in axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        data: {
          token,
          user
        }
      };
    } catch (error: any) {
      console.error('Full error object:', error);
      
      if (error.response) {
        console.error('Error response:', error.response);
        throw new Error(error.response.data?.message || 'Authentication failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', error);
        throw new Error('Failed to make authentication request');
      }
    }
  }

  // Wallet Auth Methods
  static async walletSignUp(data: WalletSignUpData) {
    const response = await api.post('/auth/wallet/signup', data);
    return response.data;
  }

  static async walletSignIn(data: WalletSignInData) {
    const response = await api.post('/auth/wallet/signin', data);
    return response.data;
  }
}