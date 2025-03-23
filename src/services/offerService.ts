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

export interface BillingCycle {
  cycleNumber: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paidDate?: Date;
  paymentId?: string;
}

export interface CreateOfferDTO {
  propertyId: string;
  amount: number;
  securityDeposit: number;
  currency: string;
  moveInDate: Date;
  duration: number;
  message?: string;
  totalAmount?: number;
  expiry?: Date;
  transactionType: 'rental' | 'sale';
  isCounterOffer?: boolean;
}

export interface CounterOfferDTO {
  amount: number;
  securityDeposit: number;
  duration: number;
  moveInDate: Date;
  message?: string;
  transactionType: 'rental' | 'sale';
}

export interface OffPlatformConfig {
  allowed: boolean;
  proofRequired: boolean;
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
  status: 'pending' | 'pending_acceptance' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'completed';
  transactionType: 'rental' | 'sale';
  isCounterOffer?: boolean;
  counterOfferId?: string;
  requiresRenterConfirmation?: boolean;
  requiresOwnerConfirmation?: boolean;
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
  billingCycles?: {
    current: number;
    total: number;
    nextPaymentDue: Date;
    history: BillingCycle[];
  };
  offPlatformPayment?: {
    allowed: boolean;
    proofRequired: boolean;
    proofOfPayment?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
    notes?: string;
  };
  paymentDeadline?: Date;
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
   * Create a new offer
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
      console.log('Accepting offer (not counter offer):', offerId);
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
   * Get offer by ID
   */
  async getOfferById(offerId: string): Promise<Offer> {
    try {
      const response = await api.get<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}`
      );
  
      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch offer');
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
   * Create counter offer (property owner only)
   */
  async createCounterOffer(offerId: string, counterOfferData: CounterOfferDTO): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/counter`,
        counterOfferData
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to create counter offer');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Request owner confirmation (tenant only)
   */
  async requestOwnerConfirmation(offerId: string, message?: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/request-confirmation`,
        { message }
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to request confirmation');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Confirm acceptance (owner only)
   */
  async confirmAcceptance(offerId: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/confirm-acceptance`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to confirm acceptance');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Verify off-platform payment (owner only)
   */
  async verifyOffPlatformPayment(offerId: string, notes?: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/verify-payment`,
        { notes }
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to verify payment');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Advance to next billing cycle (owner only)
   */
  async advanceBillingCycle(offerId: string): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/advance-billing`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to advance billing cycle');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get billing cycle history
   */
  async getBillingCycleHistory(offerId: string): Promise<any> {
    try {
      const response = await api.get<APIResponse<any>>(
        `${this.baseUrl}/${offerId}/billing-history`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to get billing history');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Configure off-platform payments (owner only)
   */
  async configureOffPlatformPayments(offerId: string, config: OffPlatformConfig): Promise<Offer> {
    try {
      const response = await api.post<APIResponse<Offer>>(
        `${this.baseUrl}/${offerId}/off-platform-config`,
        config
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to configure off-platform payments');
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

  // --- Helper Methods for UI Components ---

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
   * Helper method to check if user can create a counter-offer
   */
  canCounterOffer(offer: Offer, userId: string): boolean {
    return (
      offer.owner._id === userId && 
      (offer.status === 'pending' || !!offer.requiresOwnerConfirmation)
    );
  }

  /**
   * Helper method to check if user can request owner confirmation
   */
  canRequestConfirmation(offer: Offer, userId: string): boolean {
    return (
      offer.tenant._id === userId && 
      !!offer.isCounterOffer && 
      offer.status === 'pending' &&
      !!offer.requiresRenterConfirmation
    );
  }

  /**
   * Helper method to check if user can confirm an offer acceptance
   */
  canConfirmAcceptance(offer: Offer, userId: string): boolean {
    return (
      offer.owner._id === userId && 
      !!offer.requiresOwnerConfirmation && 
      offer.status === 'pending_acceptance'
    );
  }

  /**
   * Helper method to check if user can verify off-platform payment
   */
  canVerifyPayment(offer: Offer, userId: string): boolean {
    return (
      offer.owner._id === userId && 
      offer.status === 'accepted' &&
      !!offer.offPlatformPayment?.allowed
    );
  }

  /**
   * Helper method to get offer status label with proper formatting
   */
  getStatusLabel(status: Offer['status']): string {
    const statusMap: Record<Offer['status'], string> = {
      pending: 'Pending',
      pending_acceptance: 'Awaiting Final Confirmation',
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

  /**
   * Helper method to determine if an offer is for a rental or sale
   */
  isRentalOffer(offer: Offer): boolean {
    return offer.transactionType === 'rental';
  }

  /**
   * Helper method to get the next payment due date and amount
   */
  getNextPaymentInfo(offer: Offer): { dueDate: Date | null, amount: number | null } {
    if (!offer.billingCycles || offer.status !== 'accepted') {
      return { dueDate: null, amount: null };
    }

    const nextCycle = offer.billingCycles.history.find(
      cycle => cycle.status === 'pending'
    );

    return {
      dueDate: nextCycle?.dueDate || null,
      amount: nextCycle?.amount || null
    };
  }

  /**
   * Helper method to get the next required action for an offer
   */
  getNextAction(offer: Offer, userId: string): string {
    if (offer.owner._id === userId) {
      if (offer.status === 'pending') {
        return 'Accept or reject this offer';
      }
      if (offer.status === 'pending_acceptance') {
        return 'Confirm final acceptance';
      }
      if (offer.status === 'accepted' && !offer.payment.depositPaid) {
        return 'Awaiting tenant payment';
      }
    } else if (offer.tenant._id === userId) {
      if (offer.status === 'pending' && offer.requiresRenterConfirmation) {
        return 'Accept or reject counter offer';
      }
      if (offer.status === 'accepted' && !offer.payment.depositPaid) {
        return 'Payment required';
      }
    }

    return '';
  }

  // offerService.ts - Add more detailed logs

  async acceptCounterOffer(offerId: string): Promise<Offer> {
    try {
      console.log('Accepting counter offer via /accept-counter endpoint:', offerId);
      const url = `${this.baseUrl}/${offerId}/accept-counter`;
      console.log('Full URL being called:', url);
      
      const response = await api.post<APIResponse<Offer>>(url);

      if (response.data.status === 'error' || !response.data.data) {
        console.error('Error from accept-counter endpoint:', response.data.message);
        throw new Error(response.data.message || 'Failed to accept counter offer');
      }

      console.log('Counter offer accepted successfully:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in acceptCounterOffer:', error);
      this.handleError(error);
      throw error;
    }
  }

}

// Export a singleton instance
export const offerService = new OfferService();