import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaUser } from 'react-icons/fa';
import { ThreadListItemProps } from '../../types/messages'; 

const ThreadListItem: React.FC<ThreadListItemProps> = ({ contact, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-celadon bg-opacity-10' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        {contact.user.profileImage ? (
          <img
            src={contact.user.profileImage}
            alt={contact.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <FaUser className="text-gray-400 text-xl" />
          </div>
        )}
        {contact.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-celadon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {contact.unreadCount}
          </span>
        )}
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{contact.user.name}</h3>
          {contact.lastMessage && (
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(contact.lastMessage.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mt-1">{contact.property.propertyName}</p>
        
        {contact.lastMessage && (
          <p className="text-sm text-gray-500 mt-1 truncate">
            {contact.lastMessage.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default ThreadListItem;