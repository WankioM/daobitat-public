import api from './api';
import { uploadImageToGCS } from './imageUpload';
import { User } from './offerService';

// Message types
export type MessageType = 'text' | 'offer' | 'offer_response' | 'payment_proof' | 'payment_confirmation';

// Payment proof interface
export interface PaymentProof {
  offerId: string;
  imageUrl?: string;
  method?: string;
  amount?: number;
  reference?: string;
  date?: Date;
  notes?: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  pendingVerification?: boolean;
}

// Offer details interface
export interface OfferDetails {
  _id: string | { $oid: string };
  amount: number;
  currency: string;
  currencySymbol: string;
  duration: number;
  status: 'pending' | 'accepted' | 'pending_acceptance'| 'rejected' | 'expired' | 'withdrawn' | 'completed';
  securityDeposit: number;
  moveInDate: Date;
  totalAmount: number;
  propertyImage?: string;
  transactionType?: 'rental' | 'sale'; 
  responseType?: 'acceptance' | 'rejection' | 'counter' | 'withdrawal';
}

// Message content interface
export interface MessageContent {
  type: MessageType;
  content?: string;
  offerDetails?: OfferDetails;
}

// Property interface (simplified)
export interface Property {
  _id: string;
  propertyName: string;
  images?: string[];
  propertyType?: string;
}

// Complete message interface
export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  property: Property;
  content: string;
  type: MessageType;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
  offerDetails?: OfferDetails;
  paymentProof?: PaymentProof;
}

// Payment proof submission interface
export interface PaymentProofSubmission {
  offerId: string;
  method: string;
  amount: number;
  reference: string;
  notes?: string;
  proofImageUrl: string;
}

// Payment proof verification interface
export interface PaymentProofVerification {
  verified: boolean;
  notes?: string;
}

// Offer response interface
export interface OfferResponse {
  offerId: string;
  content: string;
  responseType: 'acceptance' | 'rejection' | 'counter' | 'withdrawal';
}

// API response interface
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

  // Handle MongoDB ObjectId format
  const offerId = typeof offerDetails._id === 'object' && offerDetails._id?.$oid
    ? { $oid: offerDetails._id.$oid }
    : offerDetails._id;

  // Ensure all required fields are present and properly typed
  return {
    _id: offerId,
    amount: offerDetails.amount || 0,
    currency: offerDetails.currency || 'KES',
    currencySymbol: offerDetails.currencySymbol || 'KSh',
    duration: offerDetails.duration || 0,
    status: offerDetails.status || 'pending',
    securityDeposit: offerDetails.securityDeposit || 0,
    moveInDate: offerDetails.moveInDate || new Date(),
    propertyImage: offerDetails.propertyImage,
    totalAmount: offerDetails.totalAmount || 0,
    transactionType: offerDetails.transactionType || 'rental',
    responseType: offerDetails.responseType
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
  // Get all messages for the current user
  getAllMessages: async (): Promise<Message[]> => {
    const response = await api.get<APIResponse<Message[]>>('/api/messages/all');
    return response.data.data.map(ensureCompleteMessage);
  },

  // Get conversation between current user and another user about a specific property
  getConversation: async (userId: string, propertyId: string): Promise<Message[]> => {
    const response = await api.get<APIResponse<Message[]>>(
      `/api/messages/conversation/${userId}/${propertyId}`
    );
    return response.data.data.map(ensureCompleteMessage);
  },

  // Send a regular text message
  sendMessage: async (receiverId: string, propertyId: string, content: string): Promise<Message> => {
    // Validate required parameters
    if (!receiverId) {
      console.error('Missing receiverId in sendMessage');
      throw new Error('Receiver ID is required');
    }
    
    if (!propertyId) {
      console.error('Missing propertyId in sendMessage');
      throw new Error('Property ID is required');
    }
  
    // Log parameters for debugging
    console.log('Sending message with params:', { receiverId, propertyId, contentLength: content?.length });
    
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
        console.error('API returned error:', response.data.message);
        throw new Error(response.data.message || 'Failed to send message');
      }
  
      return ensureCompleteMessage(response.data.data);
    } catch (error) {
      console.error('Error sending message details:', { receiverId, propertyId, contentType: messageData.type });
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark a message as read
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

  // Get payment proof upload URL
  getPaymentProofUploadUrl: async (fileName: string, fileType: string): Promise<{
    signedUrl: string;
    fileUrl: string;
    publicUrl: string;
    fileName: string;
  }> => {
    try {
      const response = await api.post<APIResponse<{
        signedUrl: string;
        fileUrl: string;
        publicUrl: string;
        fileName: string;
      }>>('/api/messages/payment-proof/upload-url', {
        fileName,
        fileType
      });

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to get upload URL');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error getting payment proof upload URL:', error);
      throw error;
    }
  },

  // Submit payment proof
  submitPaymentProof: async (proofData: PaymentProofSubmission): Promise<Message> => {
    try {
      const response = await api.post<APIResponse<Message>>(
        '/api/messages/payment-proof',
        proofData
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to submit payment proof');
      }

      return ensureCompleteMessage(response.data.data);
    } catch (error) {
      console.error('Error submitting payment proof:', error);
      throw error;
    }
  },

  // Get payment proofs for an offer
  getPaymentProofsForOffer: async (offerId: string): Promise<Message[]> => {
    try {
      const response = await api.get<APIResponse<Message[]>>(
        `/api/messages/payment-proofs/${offerId}`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to get payment proofs');
      }

      return response.data.data.map(ensureCompleteMessage);
    } catch (error) {
      console.error('Error getting payment proofs:', error);
      throw error;
    }
  },

  // Send offer response
  sendOfferResponse: async (responseData: OfferResponse): Promise<Message> => {
    try {
      const response = await api.post<APIResponse<Message>>(
        '/api/messages/offer-response',
        responseData
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to send offer response');
      }

      return ensureCompleteMessage(response.data.data);
    } catch (error) {
      console.error('Error sending offer response:', error);
      throw error;
    }
  },

  // Get messages by type
  getMessagesByType: async (type: MessageType): Promise<Message[]> => {
    try {
      const response = await api.get<APIResponse<Message[]>>(
        `/api/messages/type/${type}`
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to get messages by type');
      }

      return response.data.data.map(ensureCompleteMessage);
    } catch (error) {
      console.error(`Error getting ${type} messages:`, error);
      throw error;
    }
  },

  // Verify payment proof
  verifyPaymentProof: async (messageId: string, verificationData: PaymentProofVerification): Promise<{
    verifiedMessage: Message;
    confirmationMessage: Message;
  }> => {
    try {
      const response = await api.post<APIResponse<{
        verifiedMessage: Message;
        confirmationMessage: Message;
      }>>(
        `/api/messages/${messageId}/verify-proof`,
        verificationData
      );

      if (response.data.status === 'error' || !response.data.data) {
        throw new Error(response.data.message || 'Failed to verify payment proof');
      }

      return {
        verifiedMessage: ensureCompleteMessage(response.data.data.verifiedMessage),
        confirmationMessage: ensureCompleteMessage(response.data.data.confirmationMessage)
      };
    } catch (error) {
      console.error('Error verifying payment proof:', error);
      throw error;
    }
  },

  // Upload and submit payment proof in one step
  uploadAndSubmitPaymentProof: async (
    offerId: string,
    proofImage: File,
    proofData: Omit<PaymentProofSubmission, 'proofImageUrl' | 'offerId'>
  ): Promise<Message> => {
    try {
      // Step 1: Upload the image
      const imageUrl = await uploadImageToGCS(proofImage);
      
      // Step 2: Submit the payment proof with the image URL
      return await messageService.submitPaymentProof({
        offerId,
        proofImageUrl: imageUrl,
        ...proofData
      });
    } catch (error) {
      console.error('Error uploading and submitting payment proof:', error);
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
      (
        message.type === 'text' || 
        (message.type === 'offer' && message.offerDetails?._id) ||
        (message.type === 'payment_proof' && message.paymentProof?.offerId) ||
        (message.type === 'payment_confirmation' && message.paymentProof?.offerId)
      )
    );
  },

  // Helper to format a message for display
  formatMessagePreview: (message: Message): string => {
    switch (message.type) {
      case 'text':
        return message.content;
      case 'offer':
        return 'Offer: ' + (message.offerDetails?.amount || 0) + ' ' + (message.offerDetails?.currency || '');
      case 'offer_response':
        const responseType = message.offerDetails?.responseType;
        if (responseType === 'acceptance') return 'Offer accepted';
        if (responseType === 'rejection') return 'Offer rejected';
        if (responseType === 'counter') return 'Counter offer';
        if (responseType === 'withdrawal') return 'Offer withdrawn';
        return 'Offer response';
      case 'payment_proof':
        return 'Payment proof submitted: ' + (message.paymentProof?.amount || 0) + ' via ' + (message.paymentProof?.method || 'unknown');
      case 'payment_confirmation':
        return message.paymentProof?.verified 
          ? 'Payment verified' 
          : 'Payment verification failed';
      default:
        return message.content || 'Message';
    }
  }
};

export default messageService;