// src/types/enums.ts
// Define these once and import them in both frontend and backend

export enum OfferStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    PENDING_ACCEPTANCE = 'pending_acceptance',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn',
    COMPLETED = 'completed',
    EXPIRED = 'expired'
  }
  
  export enum PaymentStatus {
    AWAITING = 'awaiting',
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
  }
  
  export enum MessageType {
    TEXT = 'text',
    OFFER = 'offer',
    OFFER_RESPONSE = 'offer_response',
    PAYMENT_PROOF = 'payment_proof',
    PAYMENT_CONFIRMATION = 'payment_confirmation'
  }
  
  export enum TransactionType {
    RENTAL = 'rental',
    SALE = 'sale'
  }
  
  export enum EscrowStatus {
    PENDING = 'pending',
    CREATED = 'created',
    FUNDED = 'funded',
    RELEASED = 'released',
    REFUNDED = 'refunded',
    DISPUTED = 'disputed'
  }
  
  export enum BillingCycleStatus {
    PENDING = 'pending',
    PAID = 'paid',
    OVERDUE = 'overdue',
    WAIVED = 'waived'
  }

  export enum PaymentType {
    DEPOSIT = 'deposit',
    RENT = 'rent',
    REFUND = 'refund'
  }