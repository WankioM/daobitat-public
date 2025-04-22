// src/types/offers.ts
import { 
    ID,
    MongoDBId, 
    User, 
    Property
  } from './common';
  import {
    OfferStatus,
    PaymentStatus,
    PaymentType,
    TransactionType,
    EscrowStatus,
    BillingCycleStatus
  } from './offerstatusenums';
  
  // BillingCycle interface for history records
  export interface BillingCycle {
    cycleNumber: number;
    amount: number;
    dueDate: Date | string;
    status: BillingCycleStatus | string;
    paidDate?: Date | string;
    paymentId?: ID;
  }
  
  // Payment History Record interface
  export interface PaymentHistoryRecord {
    type: PaymentType | string;
    amount: number;
    status: string;
    timestamp: Date | string;
    transactionHash?: string;
  }
  
  // Offer interface matching the backend model
  export interface Offer {
    _id: ID;
    property: Property | ID;
    tenant: User | ID;
    owner: User | ID;
    amount: number;
    securityDeposit: number;
    totalAmount: number;
    currency: string;
    currencySymbol: string;
    moveInDate: Date | string;
    duration: number;
    message?: string;
    status: OfferStatus | string;
    transactionType: TransactionType | string;
    
    // For counter-offer flow
    isCounterOffer?: boolean;
    counterOfferId?: ID;
    requiresRenterConfirmation?: boolean;
    requiresOwnerConfirmation?: boolean;
    
    // For deadlines
    responseDeadline?: Date | string;
    paymentDeadline?: Date | string;
    
    // Payment information
    payment?: {
      status: PaymentStatus | string;
      transactionHash?: string;
      escrowId?: string;
      depositPaid: boolean;
      rentPaid: boolean;
      history: PaymentHistoryRecord[];
    };
    
    // Escrow information
    escrow?: {
      status: EscrowStatus | string;
      escrowAddress?: string;
      depositHeld: number;
      rentHeld: number;
      lastUpdated: Date | string;
    };
    
    // Contract information
    contract?: {
      tenantSigned: boolean;
      ownerSigned: boolean;
      contractHash?: string;
      signedAt?: Date | string;
      terms?: {
        rentAmount: number;
        depositAmount: number;
        startDate: Date | string;
        endDate: Date | string;
        specialConditions: string[];
      };
    };
    
    // Billing cycles information
    billingCycles?: {
      current: number;
      total: number;
      nextPaymentDue?: Date | string;
      history: BillingCycle[];
    };
    
    // Off-platform payment information
    offPlatformPayment?: {
      allowed: boolean;
      proofRequired: boolean;
      proofOfPayment?: string;
      verifiedBy?: ID | User;
      verifiedAt?: Date | string;
      notes?: string;
    };
    
    expiry: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }
  
  // DTO for payment updates
  export interface PaymentUpdateDTO {
    paymentStatus: PaymentStatus | string;
    paymentType: PaymentType | string;
    transactionHash?: string;
  }
  
  // DTO for counter offers
  export interface CounterOfferDTO {
    amount: number;
    securityDeposit: number;
    duration: number;
    moveInDate: string | Date;
    message?: string;
    transactionType?: TransactionType | string;
  }
  
  // DTO for creating offers
  export interface CreateOfferDTO {
    propertyId: ID;
    amount: number;
    securityDeposit: number;
    currency: string;
    moveInDate: Date | string;
    duration: number;
    message?: string;
    totalAmount?: number;
    expiry?: Date | string;
    transactionType?: TransactionType | string;
  }
  
  // Configuration for off-platform payments
  export interface OffPlatformConfig {
    allowed: boolean;
    proofRequired: boolean;
  }
  
  // For backward compatibility
  export type OfferDetails = Offer;