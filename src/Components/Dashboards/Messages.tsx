// src/components/Messages.tsx
import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../../contexts/UserContext'; // Assuming you're using a UserContext to get the logged-in user's info



const Messages: React.FC = () => {
  const { user } = useUser();
  

  return (
    <div className="messages-container">
      <h2>Your Messages</h2>
      
    </div>
  );
};

export default Messages;
