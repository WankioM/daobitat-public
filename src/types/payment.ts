// types/payment.ts
import { ID } from './common';
import type { StarknetWindowObject } from 'get-starknet-core';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type EscrowStatus = 'pending' | 'created' | 'funded' | 'released' | 'refunded';
export type PaymentType = 'deposit' | 'rent';
export type PaymentMethod = 'wallet' | 'card' | 'mpesa' | 'cash' | 'bank';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type Currency = string; // Using string to match backend, though could be more specific

// Ethereum Provider interface
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  selectedAddress?: string;
  isMetaMask?: boolean;
  isConnected: () => boolean;
}

// Payment metadata
export interface PaymentMetadata {
  phoneNumber?: string;
  walletAddress?: string;
  cardLast4?: string;
  paymentMethod?: string;
  providerName?: string;
  customerEmail?: string;
  network?: string;  // For crypto payments
}

// Escrow details
export interface EscrowDetails {
  status: EscrowStatus;
  escrowId?: string;
  contractAddress?: string;
  releaseDate?: Date | string;
}

// Refund details
export interface RefundDetails {
  refundId?: string;
  amount: number;
  reason: string;
  status: PaymentStatus;
  refundedAt?: Date | string;
}

// Verification details
export interface VerificationDetails {
  verified: boolean;
  verifiedAt?: Date | string;
  verificationMethod?: string;
  verifiedBy?: ID;
}

export interface PaymentProof {
  offerId: string;
  paymentId?: string;
  imageUrl?: string;
  method?: string;
  amount: number;
  currency?: string;
  reference?: string;
  date?: Date;
  notes?: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  pendingVerification?: boolean;
  rejectionReason?: string;
  transactionHash?: string;
}

// Off-platform payment details
export interface OffPlatformDetails {
  proofImageUrl: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: ID;
  verificationDate?: Date | string;
  rejectionReason?: string;
  notes?: string;
  paymentDate?: Date | string;
}

// Smart contract details
export interface SmartContractDetails {
  contractAddress: string;
  agreementId: string;
  escrowStatus: string;
  transactionHash?: string;
}

// Timeline event
export interface TimelineEvent {
  status: string;
  timestamp: Date | string;
  description: string;
  metadata?: Record<string, any>;
}

// Notification
export interface PaymentNotification {
  type: 'payment' | 'confirmation' | 'reminder' | 'refund';
  status: 'sent' | 'failed' | 'pending';
  sentAt: Date | string;
  recipient: string;
}

// Main payment interface
export interface Payment {
  _id: ID;
  offerId: ID;
  amount: number;
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;
  currency: Currency;
  currencySymbol: string;
  transactionId?: string;
  paymentProviderId?: string;
  reference: string;
  payer: ID;
  recipient: ID;
  propertyId: ID;
  metadata: PaymentMetadata;
  escrowDetails: EscrowDetails;
  refundDetails?: RefundDetails;
  verificationDetails: VerificationDetails;
  notifications: PaymentNotification[];
  timeline: TimelineEvent[];
  smartContractDetails: SmartContractDetails;
  isOffPlatform: boolean;
  offPlatformDetails?: OffPlatformDetails;
  billingCycle: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Payment initialization request
export interface PaymentInitializationRequest {
  offerId: string;
  amount: number;
  type: PaymentType;
  method: PaymentMethod;
  currency: string;
  metadata?: PaymentMetadata;
}

// Payment verification request
export interface PaymentVerificationRequest {
  paymentId: string;
  transactionId: string;
  paymentProviderId?: string;
}

// Off-platform payment request
export interface OffPlatformPaymentRequest {
  offerId: string;
  amount: number;
  paymentDate?: string;
  proofImageUrl: string;
  notes?: string;
  paymentMethod: string;
  transactionReference?: string; 
  bankName?: string; 
  billingCycle?: number;
  currencySymbol?: string; 
  smartContractDetails?: SmartContractDetails;
  metadata?: Record<string, any>;
}

// Off-platform verification request
export interface OffPlatformVerificationRequest {
  verified: boolean;
  verificationStatus?: 'verified' | 'rejected';
  notes?: string;
  adminAction?: boolean;
  rejectionReason?: string;
}

export interface EscrowUpdateRequest {
  escrowStatus: string;
  escrowId?: string;
  contractAddress?: string;
  releaseDate?: string;
  agreementId?: string;
  transactionHash?: string; 
  notes?: string;
}

// Refund request
export interface RefundRequest {
  paymentId: string;
  reason: string;
}

// Recurring payment setup
export interface RecurringPaymentSetupRequest {
  offerId: string;
  autoRenew: boolean;
}

// Extend global Window interface for wallet providers
declare global {
  interface Window {
    ethereum?: EthereumProvider;
    // Using properly typed StarknetWindowObject from get-starknet-core
  }
}

// Payment response types
export interface PaymentInitializationResponse {
  paymentId: string;
  reference: string;
  status: string;
  // Other fields vary by payment method
  escrowAddress?: string;
  clientSecret?: string;
  checkoutUrl?: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationResponse {
  status: string;
  payment: Payment;
}

export interface PaymentDetailsResponse {
  status: string;
  data: Payment;
}

// API response type
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export type { EthereumProvider };