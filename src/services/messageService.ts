import axios from 'axios';
import { Message } from '../NewComponents/Messages/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const messageService = {
  getAllMessages: async (): Promise<Message[]> => {
    const response = await axios.get(`${API_URL}/api/messages/all`, getAuthHeader());
    return response.data.data;
  },

  getConversation: async (userId: string, propertyId: string): Promise<Message[]> => {
    const response = await axios.get(
      `${API_URL}/api/messages/conversation/${userId}/${propertyId}`,
      getAuthHeader()
    );
    return response.data.data;
  },

  sendMessage: async (receiverId: string, propertyId: string, content: string): Promise<Message> => {
    let messageData;
    try {
      // Check if content is a JSON string containing offer details
      messageData = JSON.parse(content);
    } catch (e) {
      // If not JSON, it's a regular text message
      messageData = {
        type: 'text',
        content: content
      };
    }
  
    const response = await axios.post(
      `${API_URL}/api/messages/send`,
      {
        receiverId,
        propertyId,
        ...messageData
      },
      getAuthHeader()
    );
    return response.data.data;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await axios.patch(
      `${API_URL}/api/messages/${messageId}/read`,
      {},
      getAuthHeader()
    );
  }
};
