import api from './api';
import { Message, MessageContent, OfferDetails } from '../types/messages';
import { User } from '../services/offerService';

interface APIResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

// Helper to ensure user has minimum required fields
const ensureUserFields = (user: Partial<User> | undefined): Partial<User> => {
  if (!user) {
    return {
      _id: 'unknown',
      name: 'Unknown User',
      role: 'tenant'
    };
  }
  return user;
};

// Helper to determine user role based on context
const determineUserRole = (user: Partial<User>): User['role'] => {
  if (user.role) return user.role;
  return user.walletAddress ? 'owner' : 'tenant';
};

// Helper to ensure offer details are complete and properly typed
const ensureCompleteOfferDetails = (offerDetails?: Partial<OfferDetails>): OfferDetails | undefined => {
  if (!offerDetails) return undefined;

  // Ensure all required fields are present and properly typed
  return {
    _id: offerDetails._id,
    amount: offerDetails.amount,
    currency: offerDetails.currency || 'KES',
    currencySymbol: offerDetails.currencySymbol || 'KSh',
    duration: offerDetails.duration,
    status: offerDetails.status || 'pending',
    securityDeposit: offerDetails.securityDeposit,
    moveInDate: offerDetails.moveInDate,
    propertyImage: offerDetails.propertyImage,
    totalAmount: offerDetails.totalAmount
  } as OfferDetails;
};

// Helper to ensure message content is complete and properly structured
const ensureMessageContent = (content: string): MessageContent => {
  try {
    const parsedContent = JSON.parse(content) as MessageContent;
    
    // If this is an offer message, ensure the offer details are complete
    if (parsedContent.type === 'offer' && parsedContent.offerDetails) {
      return {
        ...parsedContent,
        offerDetails: ensureCompleteOfferDetails(parsedContent.offerDetails)
      };
    }
    
    return parsedContent;
  } catch (e) {
    // If parsing fails, treat it as a regular text message
    return {
      type: 'text',
      content: content
    };
  }
};

// Helper to ensure complete message structure
const ensureCompleteMessage = (message: Partial<Message>): Message => {
  // Ensure sender exists and has role
  const senderWithFields = ensureUserFields(message.sender);
  const sender = {
    ...senderWithFields,
    role: determineUserRole(senderWithFields)
  } as User;

  // Ensure receiver exists and has role
  const receiverWithFields = ensureUserFields(message.receiver);
  const receiver = {
    ...receiverWithFields,
    role: determineUserRole(receiverWithFields)
  } as User;

  // Create the complete message with all required fields
  const completeMessage: Message = {
    ...message,
    sender,
    receiver,
    type: message.type || 'text',
    read: message.read ?? false,
    createdAt: message.createdAt || new Date(),
    // Ensure offer details are properly handled if present
    offerDetails: message.offerDetails ? ensureCompleteOfferDetails(message.offerDetails) : undefined
  } as Message;

  return completeMessage;
};

export const messageService = {
  getAllMessages: async (): Promise<Message[]> => {
    const response = await api.get<APIResponse<Message[]>>('/api/messages/all');
    return response.data.data.map(ensureCompleteMessage);
  },

  getConversation: async (userId: string, propertyId: string): Promise<Message[]> => {
    const response = await api.get<APIResponse<Message[]>>(
      `/api/messages/conversation/${userId}/${propertyId}`
    );
    return response.data.data.map(ensureCompleteMessage);
  },

  sendMessage: async (receiverId: string, propertyId: string, content: string): Promise<Message> => {
    // Ensure message content is properly structured
    const messageData = ensureMessageContent(content);
    
    try {
      const response = await api.post<APIResponse<Message>>(
        '/api/messages/send',
        {
          receiverId,
          propertyId,
          ...messageData
        }
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to send message');
      }

      return ensureCompleteMessage(response.data.data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  markAsRead: async (messageId: string): Promise<void> => {
    try {
      const response = await api.patch(`/api/messages/${messageId}/read`);
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Helper method to validate message structure
  validateMessage: (message: Partial<Message>): boolean => {
    return !!(
      message &&
      message.sender?._id &&
      message.receiver?._id &&
      message.property?._id &&
      (message.type === 'text' || (message.type === 'offer' && message.offerDetails?._id))
    );
  }
};