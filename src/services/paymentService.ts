// services/paymentService.ts
import api from './api';
import { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  PaymentInitializationRequest, 
  PaymentVerificationRequest, 
  OffPlatformPaymentRequest, 
  OffPlatformVerificationRequest,
  RecurringPaymentSetupRequest,
  EscrowUpdateRequest,
  RefundRequest,
  Payment,
  PaymentInitializationResponse,
  PaymentVerificationResponse,
  PaymentDetailsResponse,
  EthereumProvider
} from '../types/payment';

// Import the StarknetWindowObject type
import type { StarknetWindowObject } from 'get-starknet-core';

export class PaymentService {
  /**
   * Initialize a new payment
   */
  static async initializePayment(data: PaymentInitializationRequest): Promise<ApiResponse<PaymentInitializationResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<PaymentInitializationResponse>> = await api.post('/api/payment/initialize', data);
      return response.data;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  }

  /**
   * Verify a payment has been completed
   */
  static async verifyPayment(data: PaymentVerificationRequest): Promise<ApiResponse<PaymentVerificationResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<PaymentVerificationResponse>> = await api.post('/api/payment/verify', data);
      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  /**
   * Get details of a payment
   */
  static async getPaymentDetails(paymentId: string): Promise<ApiResponse<Payment>> {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await api.get(`/api/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment details:', error);
      throw error;
    }
  }

  /**
 * Record an off-platform payment
 */
static async recordOffPlatformPayment(data: any): Promise<ApiResponse<Payment>> {
  try {
    // Create a request that matches exactly what the controller extracts and uses
    // Based on paymentController.recordOffPlatformPayment implementation
    const request = {
      // Primary fields that controller explicitly extracts
      offerId: data.offerId,
      amount: data.amount,
      paymentMethod: data.paymentMethod || 'cash',
      proofImageUrl: data.proofImageUrl || '',
      notes: data.notes || '',
      billingCycle: data.billingCycle || 1,
      
      // These fields are used by the controller but configured differently
      type: 'rent',
      currency: 'KES',
      
      // Add metadata if needed
      metadata: {
        paymentType: 'offPlatform',
        paymentReference: data.reference || ''
      }
    };
    
    console.log('Final payment request to send:', JSON.stringify(request));
    
    const response = await api.post('/api/payment/off-platform', request);
    return response.data;
  } catch (error) {
    console.error('Failed to record off-platform payment:', error);
    throw error;
  }
}
  /**
   * Verify an off-platform payment
   */
  static async verifyOffPlatformPayment(paymentId: string, data: OffPlatformVerificationRequest): Promise<ApiResponse<Payment>> {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await api.post(`/api/payment/${paymentId}/verify-off-platform`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to verify off-platform payment:', error);
      throw error;
    }
  }

  /**
   * Get payments for a specific billing cycle
   */
  static async getBillingCyclePayments(offerId: string, cycleNumber: number): Promise<ApiResponse<Payment[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Payment[]>> = await api.get(`/api/payment/offer/${offerId}/cycle/${cycleNumber}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get billing cycle payments:', error);
      throw error;
    }
  }

  /**
   * Initialize a recurring payment setup
   */
  static async initializeRecurringPayment(data: RecurringPaymentSetupRequest): Promise<ApiResponse<any>> {
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
  static async updatePaymentEscrowDetails(paymentId: string, data: EscrowUpdateRequest): Promise<ApiResponse<Payment>> {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await api.post(`/api/payment/${paymentId}/escrow`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update escrow details:', error);
      throw error;
    }
  }

  /**
   * Process a refund
   */
  static async processRefund(data: RefundRequest): Promise<ApiResponse<Payment>> {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await api.post('/api/payment/refund', data);
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
    paymentData: Omit<OffPlatformPaymentRequest, 'proofImageUrl'>, 
    proofFile: File
  ): Promise<ApiResponse<Payment>> {
    try {
      // Step 1: Upload the proof image
      const proofImageUrl = await this.uploadPaymentProof(proofFile);
      
      // Step 2: Record the payment with the image URL
      const paymentWithProof: OffPlatformPaymentRequest = {
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
  static async getWalletEscrowBalance(walletAddress: string, contractAddress: string): Promise<ApiResponse<any>> {
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
  static async getUserPaymentHistory(): Promise<ApiResponse<Payment[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Payment[]>> = await api.get('/api/payment/user/history');
      return response.data;
    } catch (error) {
      console.error('Failed to get user payment history:', error);
      throw error;
    }
  }

  /**
   * Connect wallet for blockchain payments
   */
  static async connectWallet(walletType: 'ethereum' | 'starknet' | 'braavos' | 'argentX'): Promise<string> {
    try {
      let address = '';
      
      switch (walletType) {
        case 'ethereum':
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            address = accounts[0];
          } else {
            throw new Error('Ethereum provider not found. Please install MetaMask or another Web3 wallet.');
          }
          break;
          
        case 'starknet':
          // Properly type the starknet object from window
          if (window.starknet) {
            await window.starknet.enable();
            // Ensure the selectedAddress exists before using it
            if (window.starknet.selectedAddress) {
              address = window.starknet.selectedAddress;
            } else {
              throw new Error('Starknet wallet address not available after enabling.');
            }
          } else {
            throw new Error('Starknet wallet not detected.');
          }
          break;
          
        case 'braavos':
          // Check for starknet_braavos first (using type assertion)
          const braavosProvider = window.starknet_braavos as StarknetWindowObject | undefined;
          if (braavosProvider) {
            await braavosProvider.enable();
            if (braavosProvider.selectedAddress) {
              address = braavosProvider.selectedAddress;
            } else {
              throw new Error('Braavos wallet address not available after enabling.');
            }
          } else {
            throw new Error('Braavos wallet not detected.');
          }
          break;
          
        case 'argentX':
          // Check for starknet_argentX first (using type assertion)
          const argentProvider = window.starknet_argentX as StarknetWindowObject | undefined;
          if (argentProvider) {
            await argentProvider.enable();
            if (argentProvider.selectedAddress) {
              address = argentProvider.selectedAddress;
            } else {
              throw new Error('Argent X wallet address not available after enabling.');
            }
          } else {
            throw new Error('Argent X wallet not detected.');
          }
          break;
          
        default:
          throw new Error('Unsupported wallet type.');
      }
      
      if (!address) {
        throw new Error(`Failed to get address from ${walletType} wallet.`);
      }
      
      return address;
    } catch (error) {
      console.error(`Failed to connect ${walletType} wallet:`, error);
      throw error;
    }
  }
}

export default PaymentService;