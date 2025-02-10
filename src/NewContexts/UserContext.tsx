import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserContextType } from '../types/auth';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserWishlist = async (propertyId: string, action: 'add' | 'remove') => {
    if (!user) return;

    try {
      const updatedWishlist = action === 'add'
        ? [...(user.wishlist || []), propertyId]
        : (user.wishlist || []).filter(id => id !== propertyId);

      const updatedUser = { ...user, wishlist: updatedWishlist };

      console.log('Current user wishlist:', user.wishlist);
      console.log('Updating wishlist with action:', action, 'for property:', propertyId);
      console.log('Updated wishlist:', updatedUser.wishlist);

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const value = {
    user,
    setUser,
    signOutUser,
    updateUserWishlist,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
