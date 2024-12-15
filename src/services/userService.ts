import api from './api';

export const userService = {
  getUserProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userId: string, data: any) => {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  },

  deleteAccount: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }
};
