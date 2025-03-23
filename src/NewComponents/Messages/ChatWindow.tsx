import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { Message, ChatContact } from '../../types/messages';
import { getMongoId } from '../../utils/mongoUtils';
import { useUser } from '../../NewContexts/UserContext';
import ThreadListItem from './ThreadListItem';
import OfferMessage from './OfferMessage';
import TextMessage from './TextMessage';
import { messageService } from '../../services/messageService';

interface ChatWindowProps {
  contact: ChatContact | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  onRefreshMessages?: () => void; // New prop to refresh messages
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

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when they are viewed
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!contact || !user) return;
      
      const unreadMessages = messages.filter(
        message => 
          message.receiver._id === user._id && 
          !message.read
      );
      
      if (unreadMessages.length > 0) {
        try {
          // Mark each unread message as read
          for (const message of unreadMessages) {
            if (!message._id) continue;
            // Fix: Get message ID as string and check if it exists
            const messageId = getMongoId(message._id);
            if (messageId) {
              await messageService.markAsRead(messageId);
            }
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };
    
    markMessagesAsRead();
  }, [messages, contact, user]);

  // Handler for offer updates
  const handleOfferUpdate = () => {
    if (onRefreshMessages) {
      onRefreshMessages();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    try {
      await onSendMessage(messageText);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full bg-milk p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-graphite">Select a conversation</h3>
          <p className="text-graphite/70 text-sm mt-2">
            Choose a thread from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-lightstone bg-milk">
        <div>
          <h3 className="font-medium text-graphite">{contact.user.name}</h3>
          <p className="text-sm text-graphite/70">{contact.property.propertyName}</p>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 bg-white/50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-rustyred border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-graphite/50">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = user?._id === message.sender._id;
              
              // Fix: Convert MongoDB ID to string for key prop
              const messageKey = typeof message._id === 'string' 
                ? message._id 
                : message._id ? JSON.stringify(message._id) : `msg-${Date.now()}-${Math.random()}`;
              
              // Check if this is an offer message or text message
              if (message.type === 'offer' || message.offerDetails) {
                return (
                  <OfferMessage 
                    key={messageKey} 
                    message={message} 
                    isOwn={isOwn} 
                    onOfferUpdate={handleOfferUpdate}
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
          />
          <button
            type="submit"
            className="bg-rustyred text-white p-2 rounded-r-lg hover:bg-rustyred/90"
            disabled={!messageText.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;