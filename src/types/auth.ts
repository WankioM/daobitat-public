// types/auth.ts
export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  walletAddress: string;
  role: string;
}

export type AuthMethod = 'email' | 'phone' | 'wallet';

export interface AuthMethodOption {
  id: AuthMethod;
  icon: JSX.Element;
  label: string;
}