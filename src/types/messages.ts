// src/types/messages.ts
import { 
  ID,
  User, 
  Property 
} from './common';
import { MessageType } from './offerstatusenums';
import { Offer } from './offers';

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

// Base message interface for both frontend and backend
export interface BaseMessage {
  _id: ID;
  sender: ID | User;
  receiver: ID | User;
  property: ID | Property;
  content: string;
  read: boolean;
  type: MessageType | string;
  offerDetails?: {
    _id: ID;
    amount: number;
    currency: string;
    currencySymbol: string;
    duration: number;
    status: string;
    securityDeposit: number;
    moveInDate: Date | string;
    propertyImage?: string;
    totalAmount?: number;
    pendingRenterAccept?: boolean;
    pendingOwnerConfirmation?: boolean;
    paymentDeadline?: Date | string;
    responseDeadline?: Date | string;
    offPlatformPayment?: boolean;
    proofOfPayment?: string;
    transactionType?: string;
    currentBillingCycle?: number;
    totalBillingCycles?: number;
  };
  paymentProof?: PaymentProof;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// Frontend-specific Message interface
export interface Message extends BaseMessage {
  // Add any frontend-specific properties here
}

// Chat-specific interfaces
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
  contact: ChatContact | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  onRefreshMessages?: () => void;
}

// Message content for API communications
export interface MessageContent {
  type: MessageType | string;
  content?: string;
  offerDetails?: Partial<Offer>;
}

// Timeline history event
export interface TimelineEvent {
  type: string;
  date: Date | string;
  actor: ID;
  status: 'completed' | 'pending' | 'failed';
  offerId: ID;
  data?: any;
}