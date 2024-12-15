import React, { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useUser } from '../../../contexts/UserContext';
import { collection, query, where, FirestoreDataConverter, DocumentData, getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import ThreadView from './ThreadView'; 
import PropertyView from './PropertyView';

// Define the Thread interface
interface Thread {
  id: string;
  propertyId: any;
  participants: string[];
  recipientName: string;
  lastMessage: string;
}

// Converter to transform Firestore data into Thread type
const threadConverter: FirestoreDataConverter<Thread> = {
  toFirestore(thread: Thread): DocumentData {
    return {
      //propertyId: thread.propertyId,
      participants: thread.participants,
      recipientName: thread.recipientName,
      lastMessage: thread.lastMessage
    };
  },
  fromFirestore(snapshot: any, options: any): Thread {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // manually add the document ID
      propertyId: data.propertyId,
      participants: data.participants,
      recipientName: data.recipientName,
      lastMessage: data.lastMessage
    };
  },
};

const ThreadList: React.FC = () => {
  const { user } = useUser();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedProperty] = useState<string | null>(null);
  // Reference to the threads collection with the converter
  const threadsRef = collection(firestore, 'threads').withConverter(threadConverter);
  const threadsQuery = query(threadsRef, where('participants', 'array-contains', user?.uid));
  const [threads, loading, error] = useCollectionData<Thread>(threadsQuery);
 
  if (loading) {
    return <div>Loading threads...</div>;
  }

  if (error) {
    return <div>Error loading threads: {error.message}</div>;
  }

  return (
    <div className="thread-list">
      <h2>Message Threads</h2>
      <ul>
        {threads?.map((thread) => (
          <li key={thread.id} onClick={() => {setSelectedThreadId(thread.id);
            {setSelectedProperty(thread.propertyId);}

           
            console.log(`Thread selected with ID: ${thread.id}`);
            console.log('Property ID(s) associated with the thread:', thread.propertyId);
            

          }}>
            <strong>Recipient:</strong> {thread.recipientName}
            <br />
            <strong>Last Message:</strong> {thread.lastMessage}
          </li>
        ))}
      </ul>
      
      {selectedThreadId && <ThreadView threadId={selectedThreadId} />}
      {selectedThreadId && <PropertyView propertyId={selectedPropertyId} />}

{/*
  <PropertyView propertyId={selectedProperty} />
) : null}
  */}

    </div>
  );
};

export default ThreadList;
