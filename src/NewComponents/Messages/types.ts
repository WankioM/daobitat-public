export interface OfferDetails {
  amount: number;
  currency: string;
  currencySymbol: string;
  duration: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'completed';
  securityDeposit: number;
  moveInDate: string;
  propertyImage?: string;
}
export interface User {
  _id: string;
  name: string;
  profileImage?: string | undefined;
}

export interface Property {
  _id: string;
  propertyName: string;
  propertyType: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  property: Property;
  createdAt: string;
  read: boolean;
  type?: 'text' | 'offer';  // Add message type
  offerDetails?: OfferDetails;  // Add offer details
}

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
  contact?: ChatContact;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

