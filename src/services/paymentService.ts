// services/paymentService.ts
import api from './api';
import { AxiosResponse } from 'axios';

// Type definitions
interface PaymentInitialization {
  offerId: string;
  amount: number;
  type: 'deposit' | 'rent';
  method: 'wallet' | 'card' | 'mpesa' | 'cash' | 'bank';
  currency: string;
  metadata?: Record<string, any>;
}

interface OffPlatformPayment {
  offerId: string;
  amount: number;
  paymentDate?: string; // ISO date string
  proofImageUrl: string;
  notes?: string;
  paymentMethod: string;
  billingCycle?: number;
  metadata?: Record<string, any>;
}

interface PaymentVerification {
  paymentId: string;
  transactionId: string;
  paymentProviderId?: string;
}

interface OffPlatformVerification {
  verificationStatus: 'verified' | 'rejected';
  notes?: string;
}

interface RecurringPaymentSetup {
  offerId: string;
  autoRenew: boolean;
}

interface EscrowUpdate {
  escrowStatus: string;
  escrowId?: string;
  contractAddress?: string;
  releaseDate?: string; // ISO date string
  agreementId?: string;
}

interface RefundRequest {
  paymentId: string;
  reason: string;
}

// Response types
interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export class PaymentService {
  /**
   * Initialize a new payment
   */
  static async initializePayment(data: PaymentInitialization): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post('/api/payment/initialize', data);
      return response.data;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  }

  /**
   * Verify a payment has been completed
   */
  static async verifyPayment(data: PaymentVerification): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post('/api/payment/verify', data);
      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  /**
   * Get details of a payment
   */
  static async getPaymentDetails(paymentId: string): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(`/api/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment details:', error);
      throw error;
    }
  }

  /**
   * Record an off-platform payment
   */
  static async recordOffPlatformPayment(data: OffPlatformPayment): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post('/api/payment/off-platform', data);
      return response.data;
    } catch (error) {
      console.error('Failed to record off-platform payment:', error);
      throw error;
    }
  }

  /**
   * Verify an off-platform payment
   */
  static async verifyOffPlatformPayment(paymentId: string, data: OffPlatformVerification): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(`/api/payment/${paymentId}/verify-off-platform`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to verify off-platform payment:', error);
      throw error;
    }
  }

  /**
   * Get payments for a specific billing cycle
   */
  static async getBillingCyclePayments(offerId: string, cycleNumber: number): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(`/api/payment/offer/${offerId}/cycle/${cycleNumber}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get billing cycle payments:', error);
      throw error;
    }
  }

  /**
   * Initialize a recurring payment setup
   */
  static async initializeRecurringPayment(data: RecurringPaymentSetup): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post('/api/payment/recurring', data);
      return response.data;
    } catch (error) {
      console.error('Failed to initialize recurring payment:', error);
      throw error;
    }
  }

  /**
   * Update payment escrow details
   */
  static async updatePaymentEscrowDetails(paymentId: string, data: EscrowUpdate): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(`/api/payment/${paymentId}/escrow`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update escrow details:', error);
      throw error;
    }
  }

  /**
   * Process a refund
   */
  static async processRefund(data: RefundRequest): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post('/api/payment/refund', data);
      return response.data;
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get('/api/payment/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get payment statistics:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics by billing cycle for an offer
   */
  static async getPaymentStatsByBillingCycle(offerId: string): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(`/api/payment/stats/${offerId}/by-cycle`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment statistics by billing cycle:', error);
      throw error;
    }
  }

  /**
   * Upload payment proof image
   * This method integrates with your image upload service
   */
  static async uploadPaymentProof(file: File): Promise<string> {
    try {
      // Using the existing image upload functionality
      const { uploadImageToGCS } = await import('./imageUpload');
      const imageUrl = await uploadImageToGCS(file);
      return imageUrl;
    } catch (error) {
      console.error('Failed to upload payment proof:', error);
      throw error;
    }
  }

  /**
   * Complete payment workflow including proof upload
   */
  static async recordPaymentWithProof(
    paymentData: OffPlatformPayment, 
    proofFile: File
  ): Promise<ApiResponse<any>> {
    try {
      // Step 1: Upload the proof image
      const proofImageUrl = await this.uploadPaymentProof(proofFile);
      
      // Step 2: Record the payment with the image URL
      const paymentWithProof = {
        ...paymentData,
        proofImageUrl
      };
      
      return await this.recordOffPlatformPayment(paymentWithProof);
    } catch (error) {
      console.error('Failed to record payment with proof:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance for escrow payments
   * This method would interact with blockchain contracts
   */
  static async getWalletEscrowBalance(walletAddress: string, contractAddress: string): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(
        `/api/payment/wallet/${walletAddress}/escrow/${contractAddress}/balance`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get wallet escrow balance:', error);
      throw error;
    }
  }

  /**
   * Get all payment history for a user
   */
  static async getUserPaymentHistory(): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get('/api/payment/user/history');
      return response.data;
    } catch (error) {
      console.error('Failed to get user payment history:', error);
      throw error;
    }
  }
}

export default PaymentService;