// src/utils/offerTypeAdapters.ts
import { PaymentStatus, PaymentType, TransactionType } from '../types/offerstatusenums';
import type { 
  CounterOfferDTO as FrontendCounterOfferDTO, 
  PaymentUpdateDTO as FrontendPaymentUpdateDTO 
} from '../types/offers';

/**
 * Convert frontend CounterOfferDTO to service-compatible format
 */
export function adaptCounterOfferForService(
  counterOffer: FrontendCounterOfferDTO
): {
  amount: number;
  securityDeposit: number;
  duration: number;
  moveInDate: Date;
  message?: string;
  transactionType: 'rental' | 'sale';  // Changed to required
} {
  return {
    ...counterOffer,
    // Ensure moveInDate is a Date object
    moveInDate: typeof counterOffer.moveInDate === 'string' 
      ? new Date(counterOffer.moveInDate) 
      : counterOffer.moveInDate,
    // Always provide a transactionType, defaulting to 'rental' if undefined
    transactionType: mapTransactionType(counterOffer.transactionType) || 'rental',
  };
}

/**
 * Convert frontend PaymentUpdateDTO to service-compatible format
 */
export function adaptPaymentUpdateForService(
  payment: FrontendPaymentUpdateDTO
): {
  paymentStatus: 'awaiting' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentType: 'rent' | 'deposit' | 'refund';
  transactionHash?: string;
} {
  return {
    paymentStatus: mapPaymentStatus(payment.paymentStatus),
    paymentType: mapPaymentType(payment.paymentType),
    transactionHash: payment.transactionHash
  };
}

/**
 * Map payment status enum/string to service-expected string literals
 */
function mapPaymentStatus(status: PaymentStatus | string): 'awaiting' | 'processing' | 'completed' | 'failed' | 'refunded' {
  if (typeof status === 'string') {
    switch (status.toLowerCase()) {
      case 'awaiting':
      case 'pending': return 'awaiting';
      case 'processing': return 'processing';
      case 'completed': return 'completed';
      case 'failed': return 'failed';
      case 'refunded': return 'refunded';
      default: return 'awaiting'; // Default fallback
    }
  }

  // Handle enum case
  switch (status) {
    case PaymentStatus.AWAITING: return 'awaiting';
    case PaymentStatus.PENDING: return 'awaiting';  // Map PENDING to awaiting for backward compatibility
    case PaymentStatus.PROCESSING: return 'processing';
    case PaymentStatus.COMPLETED: return 'completed';
    case PaymentStatus.FAILED: return 'failed';
    case PaymentStatus.REFUNDED: return 'refunded';
    default: return 'awaiting';
  }
}

/**
 * Map payment type enum/string to service-expected string literals
 */
function mapPaymentType(type: PaymentType | string): 'rent' | 'deposit' | 'refund' {
  if (typeof type === 'string') {
    switch (type.toLowerCase()) {
      case 'rent': return 'rent';
      case 'deposit': return 'deposit';
      case 'refund': return 'refund';
      default: return 'deposit'; // Default fallback
    }
  }

  // Handle enum case
  switch (type) {
    case PaymentType.RENT: return 'rent';
    case PaymentType.DEPOSIT: return 'deposit';
    case PaymentType.REFUND: return 'refund';
    default: return 'deposit';
  }
}

/**
 * Map transaction type enum/string to service-expected string literals
 * Always returns a string value, defaulting to 'rental' if input is undefined
 */
function mapTransactionType(type?: TransactionType | string): 'rental' | 'sale' {
  if (!type) return 'rental'; // Default to rental if undefined
  
  if (typeof type === 'string') {
    switch (type.toLowerCase()) {
      case 'rental': return 'rental';
      case 'sale': return 'sale';
      default: return 'rental'; // Default fallback
    }
  }

  // Handle enum case
  switch (type) {
    case TransactionType.RENTAL: return 'rental';
    case TransactionType.SALE: return 'sale';
    default: return 'rental';
  }
}