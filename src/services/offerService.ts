import api from './api';

// Types
export interface User {
  _id: string;
  name: string;
  email?: string;
  profileImage?: string;
  role: 'tenant' | 'owner' | 'admin';
  walletAddress?: string;
}

export interface Property {
  _id: string;
  propertyName: string;
  location: string;
  streetAddress: string;
  propertyType: string;
  specificType: string;
  action: 'sale' | 'rent';
  price: number;
  space: number;
  images?: string[];
  owner: User | string;
  status: {
    sold: boolean;
    occupied: boolean;
    listingState: 'simply listed' | 'under contract' | 'sold' | 'rented';
  };
}

export interface CreateOfferDTO {
  propertyId: string;
  amount: number;
  securityDeposit: number;
  currency: string;
  moveInDate: Date;
  duration: number;
  message?: string;
  totalAmount: number;    
  expiry: Date;
}

export interface PaymentUpdateDTO {
  paymentStatus: 'awaiting' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionHash?: string;
  paymentType: 'rent' | 'deposit' | 'refund';
}

export interface Offer {
  _id: string;
  property: Property;
  tenant: User;
  owner: User;
  amount: number;
  securityDeposit: number;
  totalAmount: number;
  currency: string;
  currencySymbol: string;
  moveInDate: Date;
  duration: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'completed';
  payment: {
    status: 'awaiting' | 'processing' | 'completed' | 'failed' | 'refunded';
    transactionHash?: string;
    escrowId?: string;
    depositPaid: boolean;
    rentPaid: boolean;
    history: Array<{
      type: 'rent' | 'deposit' | 'refund';
      amount: number;
      status: string;
      timestamp: Date;
      transactionHash?: string;
    }>;
  };
  escrow: {
    status: 'pending' | 'created' | 'funded' | 'released' | 'refunded' | 'disputed';
    escrowAddress?: string;
    depositHeld: number;
    rentHeld: number;
    lastUpdated: Date;
  };
  contract: {
    tenantSigned: boolean;
    ownerSigned: boolean;
    contractHash?: string;
    signedAt?: Date;
    terms?: {
      rentAmount: number;
      depositAmount: number;
      startDate: Date;
      endDate: Date;
      specialConditions: string[];
    };
  };
  expiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class OfferService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = '/api/offers';  // Base URL is configured in api.ts
  }

  /**
   * Create a new rental offer
   */
  async createOffer(offerData: CreateOfferDTO): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        this.baseUrl,
        offerData
      );
      
      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to create offer');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Accept an offer (property owner only)
   */
  async acceptOffer(offerId: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/accept`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to accept offer');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Reject an offer (property owner only)
   */
  async rejectOffer(offerId: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/reject`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to reject offer');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Withdraw an offer (tenant only)
   */
  async withdrawOffer(offerId: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/withdraw`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to withdraw offer');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get all offers for a specific property
   */
  async getPropertyOffers(propertyId: string): Promise<Offer[]> {
    try {
      const response = await api.get<APIResponse<Offer[]>>(
        `${this.baseUrl}/property/${propertyId}`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch property offers');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get all offers for the current user (both as tenant and owner)
   */
  async getUserOffers(): Promise<Offer[]> {
    try {
      const response = await api.get<APIResponse<Offer[]>>(
        `${this.baseUrl}/user`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch user offers');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Update payment status for an offer
   */
  async updatePaymentStatus(
    offerId: string, 
    paymentData: PaymentUpdateDTO
  ): Promise<Offer> {
    try {
      const response = await api.patch<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/payment`,
        paymentData
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to update payment status');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Helper method to format error messages
   */
  private handleError(error: any): void {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    console.error('Service Error:', error);
    throw error;
  }

  /**
   * Helper method to check if a user can accept/reject an offer
   */
  canManageOffer(offer: Offer, userId: string): boolean {
    return offer.owner._id === userId && offer.status === 'pending';
  }

  /**
   * Helper method to check if a user can withdraw an offer
   */
  canWithdrawOffer(offer: Offer, userId: string): boolean {
    return offer.tenant._id === userId && offer.status === 'pending';
  }

  /**
   * Helper method to get offer status label with proper formatting
   */
  getStatusLabel(status: Offer['status']): string {
    const statusMap: Record<Offer['status'], string> = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      expired: 'Expired',
      withdrawn: 'Withdrawn',
      completed: 'Completed'
    };
    return statusMap[status] || status;
  }

  /**
   * Helper method to format payment amount with currency symbol
   */
  formatAmount(amount: number, currencySymbol: string): string {
    return `${currencySymbol}${amount.toLocaleString()}`;
  }
}

// Export a singleton instance
export const offerService = new OfferService();