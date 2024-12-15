// hia\src\contexts\UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged,  signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, firestore,storage } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Define the shape of the context value
interface UserContextType {
  user: any; 
  loading: boolean;
  signOutUser: () => void;
  storage: typeof storage;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          
          const userDoc = doc(firestore, 'users', firebaseUser.uid);
        
          
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            console.log('user docs')
            const userData = userSnapshot.data();
            
            console.log('User data from Firestore:', userData);
            setUser({ ...userData, uid: firebaseUser.uid });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
        console.log("User state updated:", user); 
      });
  
      return () => unsubscribe();
    }, []);

    const signOutUser = () => {
      signOut(auth).then(() => {
        setUser(null);
      });
    };
  
    return (
      <UserContext.Provider value={{ user, loading , signOutUser, storage}}>
        {children}
      </UserContext.Provider>
    );
  };
  
  // Custom hook for using the context
  export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };