import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../NewContexts/UserContext';

interface MessageOwnerProps {
  propertyId: string;
  propertyName: string;
  ownerId: string;
  ownerName: string;
}

const MessageOwner: React.FC<MessageOwnerProps> = ({
  propertyId,
  propertyName,
  ownerId,
  ownerName,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleMessageClick = () => {
    // Store the new thread info in sessionStorage
    const newThreadInfo = {
      propertyId,
      propertyName,
      ownerId,
      ownerName,
      initiateChat: true
    };
    sessionStorage.setItem('newThreadInfo', JSON.stringify(newThreadInfo));
    
    // Navigate to the Messages tab in ListerDashboard
    navigate('/listerdashboard', { 
      state: { 
        activeTab: 'Messages',
        newThread: {
          propertyId,
          propertyName,
          ownerId,
          ownerName
        }
      } 
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleMessageClick}
        className="w-full flex items-center justify-center space-x-2 bg-celadon text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium"
      >
        <FaEnvelope className="text-lg" />
        <span>Message Owner</span>
      </button>
    </div>
  );
};

export default MessageOwner;
