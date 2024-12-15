export interface SignUpForm {
    name: string;
    email: string;
    phone: string;
    walletAddress: string;
    role: string;
    verificationCode?: string;
  }
  
  export type AuthMethod = 'email' | 'phone' | 'wallet';
  
  export interface AuthMethodOption {
    id: AuthMethod;
    icon: React.ReactNode;
    label: string;
  }