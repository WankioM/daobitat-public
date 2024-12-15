import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, FirestoreDataConverter, DocumentData } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useUser } from '../../../contexts/UserContext';

// Define the Message interface
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Use the Firestore Timestamp type for accurate handling
}

// Converter to transform Firestore data into Message type
const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(message: Message): DocumentData {
    return {
      senderId: message.senderId,
      text: message.text,
      timestamp: message.timestamp,
    };
  },
  fromFirestore(snapshot: any, options: any): Message {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Manually add the document ID
      senderId: data.senderId,
      text: data.text,
      timestamp: data.timestamp,
    };
  },
};

interface ThreadViewProps {
  threadId: string; // Thread ID to fetch messages from
}

const ThreadView: React.FC<ThreadViewProps> = ({ threadId }) => {
  const { user } = useUser();
  
  // Reference to the messages collection within the thread
  const messagesRef = collection(firestore, 'threads', threadId, 'messages').withConverter(messageConverter);
  
  // Query to fetch messages ordered by timestamp
  const messagesQuery = query(messagesRef, orderBy('timestamp'));
  const [messages, loading, error] = useCollectionData<Message>(messagesQuery);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error loading messages: {error.message}</div>;
  }

  return (
    <div className="thread-view">
      <h3>Thread Messages</h3>
      <ul>
        {messages?.map((message) => (
          <li key={message.id}>
            <strong>{message.senderId === user?.uid ? 'You' : 'Other'}:</strong> {message.text}
            <br />
            <small>{new Date(message.timestamp.toDate()).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadView;
