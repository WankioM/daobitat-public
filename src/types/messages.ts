// src/types/messages.ts
import { User } from '../services/offerService';

export interface Property {
  _id: string;
  propertyName: string;
  propertyType?: string;
  images?: string[];
  // Keeping all property fields that might be needed
}

export interface OfferDetails {
  _id: string;  // Using _id consistently
  amount: number;
  currency: string;
  currencySymbol: string;
  duration: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'completed';
  securityDeposit: number;
  moveInDate: Date | string;
  propertyImage?: string;
  totalAmount?: number;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  property: Property;
  content: string;
  read: boolean;
  type: 'text' | 'offer';
  offerDetails?: OfferDetails;
  createdAt: Date | string;  // Supporting both Date and string for flexibility
}

// Chat-specific interfaces from the original types
export interface ChatContact {
  user: User;
  property: Property;
  lastMessage?: Message;
  unreadCount: number;
}

export interface ThreadListItemProps {
  contact: ChatContact;
  isSelected: boolean;
  onClick: () => void;
}

export interface ThreadListProps {
  contacts: ChatContact[];
  selectedContactId?: string;
  onSelectContact: (contact: ChatContact) => void;
}

export interface ChatWindowProps {
  contact: ChatContact | null;  // Making it nullable instead of optional
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

// Message content for API communications
export interface MessageContent {
  type: 'text' | 'offer';
  content: string;
  offerDetails?: OfferDetails;
}

// Offer-related types
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

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'completed';
export type PaymentStatus = 'awaiting' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentType = 'rent' | 'deposit' | 'refund';