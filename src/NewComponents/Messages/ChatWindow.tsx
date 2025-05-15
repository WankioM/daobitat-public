// src/NewComponents/Messages/ChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { Message, ChatContact } from '../../types/messages';
import { Offer } from '../../types/offers';
import { Property,idToString, safeGetId } from '../../types/common';
import { getMongoId } from '../../utils/mongoUtils';
import { useUser } from '../../NewContexts/UserContext';
import TextMessage from './TextMessage';
import StatefulOfferCard from './StatefulOfferCard';
import useOfferStore, { OfferAction } from '../../store/offerStore';
import PaymentVerificationMessage from './PaymentVerificationMessage';

interface ChatWindowProps {
  contact: ChatContact | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  onRefreshMessages?: () => void;
}

// Define the shape of offerDetails in message to match with expected properties
interface MessageOfferDetails {
  _id: any;
  amount: number;
  currency: string;
  currencySymbol: string;
  duration: number;
  status: string;
  securityDeposit: number;
  moveInDate: Date | string;
  tenant?: any;
  owner?: any;
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
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  contact,
  messages,
  onSendMessage,
  isLoading,
  onRefreshMessages
}) => {
  const [messageText, setMessageText] = useState('');
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const offerCardRef = useRef<HTMLDivElement>(null);
  const [pinnedOffer, setPinnedOffer] = useState<Offer | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [offerProcessing, setOfferProcessing] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Log specifically messages with payment proofs for debugging
    const paymentMessages = messages.filter(m => 
      m.type === 'payment_proof' || 
      m.type === 'payment_request' || 
      m.paymentProof
    );
    
    if (paymentMessages.length > 0) {
      console.log('🔍 Payment-related messages found:', paymentMessages.map(m => ({
        id: m._id,
        type: m.type,
        paymentProof: {
          offerId: m.paymentProof?.offerId,
          method: m.paymentProof?.method,
          amount: m.paymentProof?.amount,
          verified: m.paymentProof?.verified
        }
      })));
    }
  }, [messages]);
  
  // Filter out offer messages when pinned offer is present
  useEffect(() => {
    if (messages.length === 0) {
      setFilteredMessages([]);
      return;
    }
    
    // Only filter if we have a pinned offer
    if (pinnedOffer) {
      // Filter out offer and offer_response messages to avoid duplication
      const filtered = messages.filter(m => 
        m.type !== 'offer' && 
        m.type !== 'offer_response' &&
        !m.offerDetails
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [messages, pinnedOffer]);
  useEffect(() => {
    if (messages && messages.length > 0) {
      console.log('Message types in chat:', messages.map(m => ({
        id: m._id,
        type: m.type,
        hasPaymentProof: !!m.paymentProof,
        paymentProof: m.paymentProof
      })));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  // Find and pin the latest active offer
  useEffect(() => {
    if (messages.length > 0 && contact?.property) {
      // Get all offer messages
      const offerMessages = messages.filter((m: Message) => 
        m.type === 'offer' || 
        m.type === 'offer_response' ||
        m.offerDetails
      );
      
      if (offerMessages.length > 0) {
        // Sort by creation date (newest first)
        const sortedOfferMessages = [...offerMessages].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Find the latest active offer (not in terminal state)
        const latestActiveOffer = sortedOfferMessages.find((m: Message) => 
          m.offerDetails?.status !== 'rejected' && 
          m.offerDetails?.status !== 'withdrawn' &&
          m.offerDetails?.status !== 'expired'
        );
        
        // If no active offer found, use the latest offer message
        const offerToPin = latestActiveOffer || sortedOfferMessages[0];
        
        if (offerToPin && offerToPin.offerDetails) {
          const details = offerToPin.offerDetails as MessageOfferDetails;

          // Create a proper Property object
          const propertyId = safeGetId(contact.property._id);
          const ownerId = safeGetId(contact.user._id);
          
          // Create the minimum fields required for an Offer type
          const enhancedOffer: Offer = {
            _id: idToString(details._id),
            // Create a proper Property object from the contact property
            property: contact.property._id ? contact.property as unknown as Property : {
              _id: propertyId,
              propertyName: contact.property.propertyName || '',
              owner: ownerId, 
              price: 0,
              space: 0,
              images: [],
              location: contact.property.location || '',
              streetAddress: '',
              propertyType: '',
              specificType: '',
              action: 'rent',
              status: {
                sold: false,
                occupied: false,
                listingState: ''
              }
            },
            tenant: idToString(safeGetId(details.tenant || (offerToPin.sender && idToString(offerToPin.sender)))),
            owner: idToString(safeGetId(details.owner || (offerToPin.receiver && idToString(offerToPin.receiver)))),
            amount: details.amount,
            securityDeposit: details.securityDeposit,
            totalAmount: details.totalAmount || (details.amount + details.securityDeposit),
            currency: details.currency,
            currencySymbol: details.currencySymbol,
            moveInDate: details.moveInDate,
            duration: details.duration,
            status: details.status,
            transactionType: details.transactionType || 'rental',
            expiry: details.responseDeadline || new Date(),
            createdAt: offerToPin.createdAt,
            updatedAt: offerToPin.updatedAt || offerToPin.createdAt
          };
          
          setPinnedOffer(enhancedOffer);
        } else {
          setPinnedOffer(null);
        }
      } else {
        setPinnedOffer(null);
      }
    }
  }, [messages, contact]);

  // Handle sending a message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sendingMessage || !contact) return;
    
    try {
      setSendingMessage(true);
      await onSendMessage(messageText);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Handle offer actions (accept, reject, etc.)
const handleOfferAction = async (action: OfferAction, offerId: string, data?: any) => {
  if (!offerId || offerProcessing) return;
  
  try {
    setOfferProcessing(true);
    
    // Use the storeHandleOfferAction method from useOfferStore
    await useOfferStore.getState().storeHandleOfferAction(offerId, action, data);
    
    // Refresh messages to show updated state
    if (onRefreshMessages) {
      onRefreshMessages();
    }
  } catch (error) {
    console.error(`Error handling offer action ${action}:`, error);
  } finally {
    setOfferProcessing(false);
  }
};
  return (
    <div className="flex flex-col h-full bg-white/50">
      {/* Pinned Offer Card (if exists) */}
      {pinnedOffer && user && contact && (
        <div ref={offerCardRef} className="sticky top-0 z-10 shadow-sm">
          {(() => {
            // Get IDs as strings for proper comparison
            const tenantId = idToString(safeGetId(pinnedOffer.tenant));
            const ownerId = idToString(safeGetId(pinnedOffer.owner));
            const userId = idToString(safeGetId(user._id));
            
            // Determine which role the current user has
            const isUserTenant = tenantId === userId;
            const isUserOwner = ownerId === userId;
            
            // Set userRole based on the role match
            const userRole = isUserOwner ? 'owner' : 'tenant';
            
            // Set isOwn correctly based on the relationship between user and offer
            const isOwn = (userRole === 'tenant' && isUserTenant) || 
                         (userRole === 'owner' && isUserOwner);
            
            return (
              <StatefulOfferCard 
                offer={pinnedOffer}
                property={contact.property}
                userRole={userRole}
                isOwn={isOwn}
                onAction={(action, data) => handleOfferAction(action as OfferAction, getMongoId(pinnedOffer._id) || '', data)}
              />
            );
          })()}
        </div>
      )}
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 pt-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin h-8 w-8 text-rustyred" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-graphite/50">
            <p>{pinnedOffer ? "Only offer information available. Start the conversation!" : "No messages yet. Start the conversation!"}</p>
          </div>
        ) : (
          <>
            {filteredMessages.map((message: Message) => {
  // Safely compare IDs
  const senderID = idToString(safeGetId(message.sender));
  const userID = user ? idToString(safeGetId(user._id)) : '';
  const isOwn = userID === senderID;
  
  // Generate a unique key for each message
  const messageKey = typeof message._id === 'string' 
    ? message._id 
    : message._id ? JSON.stringify(message._id) : `msg-${Date.now()}-${Math.random()}`;
  
  // Render message based on type
  if (message.type === 'payment_proof' || message.type === 'payment_request') {
    return (
      <PaymentVerificationMessage
        key={messageKey}
        message={message}
        isOwn={isOwn}
        onVerified={onRefreshMessages}
      />
    );
  } else {
    return (
      <TextMessage 
        key={messageKey} 
        message={message} 
        isOwn={isOwn} 
      />
    );
  }
})}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t border-lightstone bg-milk"
      >
        <div className="flex items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-lightstone rounded-l-lg bg-white focus:outline-none focus:ring-2 focus:ring-rustyred/50"
            disabled={sendingMessage || offerProcessing}
          />
          <button
            type="submit"
            className="bg-rustyred text-white p-2 rounded-r-lg hover:bg-rustyred/90 transition-colors flex items-center justify-center w-10"
            disabled={!messageText.trim() || sendingMessage || offerProcessing}
          >
            {sendingMessage ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;