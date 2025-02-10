// src/hooks/useOptionalUser.ts
import { useContext } from 'react';
import { UserContext } from '../NewContexts/UserContext';
import { User } from '../types/auth';

interface OptionalUserContextReturn {
  user: User | null;
  loading: boolean;
}

export const useOptionalUser = (): OptionalUserContextReturn => {
  const context = useContext(UserContext);
  
  // Return a default value if context is undefined
  if (!context) {
    return {
      user: null,
      loading: false
    };
  }

  return {
    user: context.user,
    loading: context.loading
  };
};