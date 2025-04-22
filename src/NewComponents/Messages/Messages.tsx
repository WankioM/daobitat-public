import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../NewContexts/UserContext';
import { useLocation } from 'react-router-dom';
import ThreadList from './ThreadList';
import ChatWindow from './ChatWindow';
import { ChatContact, Message } from '../../types/messages';
import { messageService } from '../../services/messageService';
import { User } from '../../services/offerService';
import { getMongoId } from '../../utils/mongoUtils';
import { idToString } from '../../types/common';

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
              propertyType: threadData.propertyType || '', // Providing default value
              owner: threadData.ownerId, // Add the owner field
              price: 0, // Add required fields with default values
              space: 0,
              images: [],
              action: 'rent',
              status: {
                sold: false,
                occupied: false,
                listingState: ''
              }
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
            images: message.property.images || [],
            owner: otherUser._id, // Add owner field
            price: 0, // Add required fields with default values
            space: 0,
            action: 'rent',
            status: {
              sold: false,
              occupied: false,
              listingState: ''
            }
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

  // Load contacts on initial render
  useEffect(() => {
    fetchAllMessages();
  }, [fetchAllMessages, refreshCount]);

  // Load messages for the selected contact
  /**
   * Fetches messages for a contact and marks them as read if necessary.
   * @param {string} contactId - The ID of the contact to fetch messages for.
   * @param {string} propertyId - The ID of the property to fetch messages for.
   */
  const fetchMessagesForContact = useCallback(async (contactId: string, propertyId: string) => {
    if (!user || !user._id) return;
    
    setIsLoading(true);
    try {
      const fetchedMessages = await messageService.getConversation(contactId, propertyId);
      setMessages(Array.isArray(fetchedMessages) ? fetchedMessages as unknown as Message[] : []);
      
      // Improve message read marking
      if (fetchedMessages && fetchedMessages.length > 0) {
        const unreadMessagePromises = fetchedMessages
          .filter(message => !message.read)
          .map(message => {
            const messageId = getMongoId(message._id);
            return messageId 
              ? messageService.markAsRead(messageId).catch(error => {
                  console.warn(`Failed to mark message ${messageId} as read:`, error);
                  return null; // Continue processing other messages
                })
              : null;
          })
          .filter(promise => promise !== null);
  
        // Wait for all read marking attempts to complete
        await Promise.allSettled(unreadMessagePromises);
      }
    } catch (error) {
      console.error('Error fetching messages for contact:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load messages when selected contact changes
  useEffect(() => {
    if (selectedContact && user) {
      fetchMessagesForContact(
        getMongoId(selectedContact.user._id) || '', 
        getMongoId(selectedContact.property._id) || ''
      );
    }
  }, [selectedContact, fetchMessagesForContact, user]);

  // Handle contact selection
  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedContact || !user) return;
    
    try {
      const recipientId = getMongoId(selectedContact.user._id) || '';
      const propertyId = getMongoId(selectedContact.property._id) || '';
      
      await messageService.sendMessage(recipientId, propertyId, content);
      
      // Refresh messages
      fetchMessagesForContact(recipientId, propertyId);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw to let the component know it failed
    }
  };

  // Handle manual refresh
  const handleRefreshMessages = () => {
    if (selectedContact && user) {
      fetchMessagesForContact(
        getMongoId(selectedContact.user._id) || '', 
        getMongoId(selectedContact.property._id) || ''
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      <div className="w-1/3 border-r border-gray-200 h-full overflow-hidden">
        <ThreadList
          contacts={contacts}
          selectedContactId={selectedContact?.user?._id ? idToString(selectedContact.user._id) : undefined}
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