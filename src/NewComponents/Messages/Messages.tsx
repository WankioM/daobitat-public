import React, { useState, useEffect } from 'react';
import { useUser } from '../../NewContexts/UserContext';
import { useLocation } from 'react-router-dom';
import ThreadList from './ThreadList';
import ChatWindow from './ChatWindow';
import { ChatContact, Message } from './types';
import { messageService } from '../../services/messageService';

const Messages: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle new thread creation from navigation state
  useEffect(() => {
    const newThreadInfo = sessionStorage.getItem('newThreadInfo');
    if (newThreadInfo) {
      const threadData = JSON.parse(newThreadInfo);
      if (threadData.initiateChat) {
        // Create a new contact for the thread
        const newContact: ChatContact = {
          user: {
            _id: threadData.ownerId,
            name: threadData.ownerName
          },
          property: {
            _id: threadData.propertyId,
            propertyName: threadData.propertyName,
            propertyType: '' // You might want to include this in the threadData
          },
          unreadCount: 0
        };
        
        // Add the new contact if it doesn't exist
        setContacts(prev => {
          const exists = prev.some(
            contact => 
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
    }
  }, []);

  // Fetch all messages and organize them into contacts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const allMessages = await messageService.getAllMessages();

        // Group messages by contact and property
        const contactsMap = new Map<string, ChatContact>();

        allMessages.forEach(message => {
          const otherUser = message.sender._id === user?._id ? message.receiver : message.sender;
          const contactKey = `${otherUser._id}-${message.property._id}`;

          if (!contactsMap.has(contactKey)) {
            contactsMap.set(contactKey, {
              user: otherUser,
              property: message.property,
              lastMessage: message,
              unreadCount: message.receiver._id === user?._id && !message.read ? 1 : 0
            });
          } else {
            const contact = contactsMap.get(contactKey)!;
            if (new Date(message.createdAt) > new Date(contact.lastMessage!.createdAt)) {
              contact.lastMessage = message;
            }
            if (message.receiver._id === user?._id && !message.read) {
              contact.unreadCount++;
            }
          }
        });

        setContacts(prev => {
          const existingContacts = Array.from(contactsMap.values());
          // Preserve any new contacts that might have been added
          const newContacts = prev.filter(contact => 
            !existingContacts.some(
              existing => 
                existing.user._id === contact.user._id && 
                existing.property._id === contact.property._id
            )
          );
          return [...existingContacts, ...newContacts];
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (user?._id) {
      fetchMessages();
    }
  }, [user?._id]);

  // Fetch messages for selected contact
  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedContact || !user?._id) return;

      setIsLoading(true);
      try {
        const conversationMessages = await messageService.getConversation(
          selectedContact.user._id,
          selectedContact.property._id
        );
        setMessages(conversationMessages);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [selectedContact, user?._id]);

  const handleSendMessage = async (content: string) => {
    if (!selectedContact || !user?._id) return;

    try {
      const newMessage = await messageService.sendMessage(
        selectedContact.user._id,
        selectedContact.property._id,
        content
      );
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update contacts list with new message
      setContacts(prev => {
        const updated = [...prev];
        const contactIndex = updated.findIndex(
          c => 
            c.user._id === selectedContact.user._id && 
            c.property._id === selectedContact.property._id
        );
        if (contactIndex !== -1) {
          updated[contactIndex] = {
            ...updated[contactIndex],
            lastMessage: newMessage
          };
        }
        return updated;
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      <div className="w-1/3 border-r border-gray-200 h-full overflow-hidden">
        <ThreadList
          contacts={contacts}
          selectedContactId={selectedContact?.user._id}
          onSelectContact={setSelectedContact}
        />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <ChatWindow
          contact={selectedContact}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Messages;