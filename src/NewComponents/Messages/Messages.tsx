import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../NewContexts/UserContext';
import { useLocation } from 'react-router-dom';
import ThreadList from './ThreadList';
import ChatWindow from './ChatWindow';
import { ChatContact, Message } from '../../types/messages';
import { messageService } from '../../services/messageService';
import { User } from '../../services/offerService';
import { getMongoId } from '../../utils/mongoUtils';

const Messages: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Helper function to check if an object is valid and has an _id
  const isValidWithId = (obj: any): boolean => {
    return obj && typeof obj === 'object' && obj._id !== undefined && obj._id !== null;
  };

  // Handle new thread creation from navigation state
  useEffect(() => {
    const newThreadInfo = sessionStorage.getItem('newThreadInfo');
    if (newThreadInfo) {
      try {
        const threadData = JSON.parse(newThreadInfo);
        if (threadData.initiateChat) {
          // Create a new contact for the thread
          const newContact: ChatContact = {
            user: {
              _id: threadData.ownerId,
              name: threadData.ownerName,
              role: 'owner', // Adding required role field
              email: threadData.ownerEmail // Optional: if available
            } as User,
            property: {
              _id: threadData.propertyId,
              propertyName: threadData.propertyName,
              propertyType: threadData.propertyType || '' // Providing default value
            },
            unreadCount: 0
          };
          
          // Add the new contact if it doesn't exist
          setContacts(prev => {
            const exists = prev.some(
              contact => 
                isValidWithId(contact.user) && 
                isValidWithId(contact.property) &&
                contact.user._id === newContact.user._id && 
                contact.property._id === newContact.property._id
            );
            if (!exists) {
              return [...prev, newContact];
            }
            return prev;
          });
          
          // Select the new contact
          setSelectedContact(newContact);
          
          // Clear the session storage
          sessionStorage.removeItem('newThreadInfo');
        }
      } catch (error) {
        console.error('Error parsing newThreadInfo:', error);
        sessionStorage.removeItem('newThreadInfo');
      }
    }
  }, []);

  // Function to fetch all messages (contacts)
  const fetchAllMessages = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      const allMessages = await messageService.getAllMessages();
      
      // Ensure we have valid messages array
      if (!Array.isArray(allMessages)) {
        console.error('Invalid messages data:', allMessages);
        return;
      }

      // Group messages by contact and property
      const contactsMap = new Map<string, ChatContact>();

      allMessages.forEach(message => {
        // Skip invalid messages
        if (!isValidWithId(message.sender) || !isValidWithId(message.receiver) || !isValidWithId(message.property)) {
          console.warn('Skipping invalid message:', message);
          return;
        }

        const otherUser = (message.sender._id === user._id) ? message.receiver : message.sender;
        
        // Skip if otherUser is invalid
        if (!isValidWithId(otherUser)) {
          console.warn('Invalid otherUser in message:', message);
          return;
        }

        const contactKey = `${otherUser._id}-${message.property._id}`;

        const currentContact: ChatContact = {
          user: otherUser,
          property: {
            _id: message.property._id,
            propertyName: message.property.propertyName || 'Unnamed Property',
            propertyType: message.property.propertyType || '',
            images: message.property.images
          },
          lastMessage: message as any,
          unreadCount: (message.receiver._id === user._id && !message.read) ? 1 : 0
        };

        if (!contactsMap.has(contactKey)) {
          contactsMap.set(contactKey, currentContact);
        } else {
          const existingContact = contactsMap.get(contactKey)!;
          
          // Compare message dates safely
          const existingDate = existingContact.lastMessage?.createdAt 
            ? new Date(existingContact.lastMessage.createdAt) 
            : new Date(0);
            
          const newDate = message.createdAt 
            ? new Date(message.createdAt) 
            : new Date(0);
            
          if (newDate > existingDate) {
            existingContact.lastMessage = message as any;
          }
          
          if (message.receiver._id === user._id && !message.read) {
            existingContact.unreadCount = (existingContact.unreadCount || 0) + 1;
          }
        }
      });

      const newContacts = Array.from(contactsMap.values());
      setContacts(prev => {
        // Preserve any new contacts that might have been added
        const preservedContacts = prev.filter(contact => 
          isValidWithId(contact.user) && 
          isValidWithId(contact.property) &&
          !newContacts.some(
            existing => 
              isValidWithId(existing.user) &&
              isValidWithId(existing.property) &&
              existing.user._id === contact.user._id && 
              existing.property._id === contact.property._id
          )
        );
        return [...newContacts, ...preservedContacts];
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  // Fetch all messages and organize them into contacts
  useEffect(() => {
    fetchAllMessages();
  }, [fetchAllMessages, refreshCount]);

  // Function to fetch conversation for selected contact
  const fetchConversation = useCallback(async () => {
    if (!selectedContact || !user || !user._id) return;
    
    // Add null checks and validation
    if (!isValidWithId(selectedContact.user) || !isValidWithId(selectedContact.property)) {
      console.error('Invalid selected contact:', selectedContact);
      return;
    }

    const userId = getMongoId(selectedContact.user._id);
    const propertyId = getMongoId(selectedContact.property._id);

    if (!userId || !propertyId) {
      console.error('Invalid user or property ID');
      return;
    }

    setIsLoading(true);
    try {
      const conversationMessages = await messageService.getConversation(
        userId,
        propertyId
      );
      
      // Validate messages
      if (Array.isArray(conversationMessages)) {
        // Filter out any invalid messages
        const validMessages = conversationMessages.filter(msg => 
          isValidWithId(msg) && isValidWithId(msg.sender) && isValidWithId(msg.receiver)
        );
        setMessages(validMessages as Message[]);
      } else {
        console.error('Invalid conversation messages:', conversationMessages);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedContact, user]);

  // Fetch messages for selected contact
  useEffect(() => {
    fetchConversation();
  }, [fetchConversation, refreshCount]);

  // Handler to refresh messages (used after offer updates)
  const handleRefreshMessages = () => {
    setRefreshCount(prevCount => prevCount + 1);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedContact) return;
    
    // Get user ID directly from localStorage if not available in context
    let userId: string | undefined;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userId = userData._id;
      }
    } catch (error) {
      console.error('Error accessing user data:', error);
    }
    
    if (!userId) {
      console.error('User ID not available');
      return;
    }
    
    // Validate selectedContact properties
    if (!isValidWithId(selectedContact.user) || !isValidWithId(selectedContact.property)) {
      console.error('Invalid contact information:', selectedContact);
      return;
    }
    
    const propertyId = getMongoId(selectedContact.property._id);
    const receiverId = getMongoId(selectedContact.user._id);
  
    if (!receiverId || !propertyId) {
      console.error('Invalid user or property ID', { receiverId, propertyId });
      return;
    }
  
    try {
      const newMessage = await messageService.sendMessage(
        receiverId,  // This is the ID of the other user
        propertyId,
        content
      );
      
      if (newMessage && isValidWithId(newMessage)) {
        setMessages(prev => [...prev, newMessage as Message]);
        
        // Update contacts list with new message
        setContacts(prev => {
          const updated = [...prev];
          const contactIndex = updated.findIndex(
            c => 
              isValidWithId(c.user) && 
              isValidWithId(c.property) &&
              getMongoId(c.user._id) === receiverId && 
              getMongoId(c.property._id) === propertyId
          );
          if (contactIndex !== -1) {
            updated[contactIndex] = {
              ...updated[contactIndex],
              lastMessage: newMessage as Message
            };
          }
          return updated;
        });
      } else {
        console.error('Invalid new message received:', newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      <div className="w-1/3 border-r border-gray-200 h-full overflow-hidden">
        <ThreadList
          contacts={contacts}
          selectedContactId={selectedContact?.user?._id}
          onSelectContact={handleContactSelect}
        />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <ChatWindow
          contact={selectedContact}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onRefreshMessages={handleRefreshMessages}
        />
      </div>
    </div>
  );
};

export default Messages;