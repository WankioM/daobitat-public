// src/types/auth.ts
export type UserRole = 'lister' | 'agent' | 'buyer' | 'renter';
export type WalletAddress = `0x${string}` | string;

export interface BaseUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  walletAddress?: WalletAddress;
  role: UserRole;
  profileImage?: string;
  verified: {
    email: boolean;
    phone: boolean;
    wallet: boolean;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface User extends BaseUser {
  properties: string[];
  wishlist: string[];
  loans: string[];
}

export interface SignUpForm {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  walletAddress?: WalletAddress;
  role: UserRole;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signOutUser: () => void;
  updateUserWishlist: (propertyId: string, action: 'add' | 'remove') => void;
  loading: boolean;
}

export type AuthMethod = 'email' | 'google' | 'wallet' | 'phone';

export interface AuthMethodOption {
  id: AuthMethod;
  icon: JSX.Element;
  label: string;
}

export interface WalletProviders {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<string[]>;
  };
  starknet?: {
    enable: () => Promise<void>;
    selectedAddress: string;
  };
}