// src/services/authService.ts

interface GoogleUserPayload {
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
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
      if (error instanceof Error) {
        throw new Error(`Failed to get Google user info: ${error.message}`);
      }
      throw new Error('Failed to get Google user info');
    }
  }
}

export default AuthService;